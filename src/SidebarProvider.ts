import * as vscode from "vscode";
import { authenticate } from "./authenticate";
import { apiBaseUrl } from "./constants";
import { getNonce } from "./getNonce";
import { TokenManager } from "./TokenManager";
import { ToolboxPanel } from "./ToolboxPanel";


export class SidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;
    _doc?: vscode.TextDocument;
    private static sidebarWebview: vscode.Webview;
    public static keywords = ""; // TODO make private and add getter/setter

    constructor(private readonly _extensionUri: vscode.Uri) { }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;
        SidebarProvider.sidebarWebview = webviewView.webview;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "toolbox": {
                    vscode.commands.executeCommand("snippetbox.toolbox");
                    break;
                }
                case "startListen": {
                    if (!SidebarProvider.keywords) {
                      SidebarProvider.keywords = data.value; // set keywords the first time
                    }
                    vscode.commands.executeCommand("snippetbox.listen");
                    ToolboxPanel.getPanelWebview()?.postMessage({
                        type: "setting",
                        value: "startListen",
                    });
                    break;
                }
                case "stopListen": {
                    vscode.commands.executeCommand("snippetbox.stopListen");
                    ToolboxPanel.getPanelWebview()?.postMessage({
                        type: "setting",
                        value: "stopListen",
                    });
                    break;
                }
                case "startNotifications": {
                    ToolboxPanel.getPanelWebview()?.postMessage({
                        type: "setting",
                        value: "startNotifications",
                    });
                    break;
                }
                case "stopNotifications": {
                    ToolboxPanel.getPanelWebview()?.postMessage({
                        type: "setting",
                        value: "stopNotifications",
                    });
                    break;
                }
                case "logout": {
                    TokenManager.setToken("");
                    break;
                }
                case "authenticate": {
                    authenticate(() => {
                        webviewView.webview.postMessage({
                            type: "token",
                            value: TokenManager.getToken(),
                        });
                    });
                    break;
                }
                case "get-token": {
                    webviewView.webview.postMessage({
                        type: "token",
                        value: TokenManager.getToken(),
                    });
                    break;
                }
                case "onInfo": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
            }
        });
    }

    public static getWebview() {
        return SidebarProvider.sidebarWebview;
    }

    public revive(panel: vscode.WebviewView) {
        this._view = panel;
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const styleResetUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
        );
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
        );
        const styleMainUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
        );
        const styleVSCodeUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
        );

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
                -->
                <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource
                    }; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleResetUri}" rel="stylesheet">
                <link href="${styleVSCodeUri}" rel="stylesheet">
                <link href="${styleMainUri}" rel="stylesheet">
                <script nonce="${nonce}">
                    const tsvscode = acquireVsCodeApi();
                    const apiBaseUrl = ${JSON.stringify(apiBaseUrl)}
                </script>
                </head>
                <body>
                    <script nonce="${nonce}" src="${scriptUri}"></script>
                </body>
                </html>`;
    }
}