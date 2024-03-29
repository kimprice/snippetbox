// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ToolboxPanel } from './ToolboxPanel';
import { SidebarProvider } from './SidebarProvider';
import { authenticate } from './authenticate';
import { TokenManager } from './TokenManager';
import { SpeechClient } from './SpeechClient';

let speechClientInitiated = false;
let keywords = "";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export let extContext: vscode.ExtensionContext;
export function activate(context: vscode.ExtensionContext) {
	extContext = context;
	TokenManager.globalState = context.globalState;
	console.log("token value is: ", TokenManager.getToken());
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, the DECKS extension is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('snippetbox.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Woop Woop from SnippetBox!');
	// });

	// context.subscriptions.push(disposable);
	const sidebarProvider = new SidebarProvider(context.extensionUri);

	const item = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right
	);
	// $ convention below is for icon and name in parenthesis is from codicons
	item.text = "$(file-code) Add Todo";
	item.command = "snippetbox.add";
	// item.show();

	context.subscriptions.push(
	  vscode.window.registerWebviewViewProvider(
		"snippetbox-sidebar",
		sidebarProvider
	  )
	);
	
	context.subscriptions.push(
		vscode.commands.registerCommand('snippetbox.toolbox', () => {
			ToolboxPanel.createOrShow(context.extensionUri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('snippetbox.authenticate', () => {
			try {
				authenticate(() => {});
			} catch (err) {
				console.log(err);
			}
			
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('snippetbox.add', () => {
			const { activeTextEditor } = vscode.window;

			if (!activeTextEditor) {
				vscode.window.showInformationMessage("No active text editor");
				return;
			}

			const text = activeTextEditor.document.getText(
				activeTextEditor.selection
			);

			sidebarProvider._view?.webview.postMessage({
				type: "new-todo",
				value: text,
			});
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('snippetbox.refresh', async () => {
			// uncomment below when working on webview panel
			// HelloWorldPanel.kill();
			// HelloWorldPanel.createOrShow(context.extensionUri);
			setTimeout(() => {
				vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools");
			}, 500);

			// working on sidebar
			await vscode.commands.executeCommand("workbench.action.closeSidebar");
			await vscode.commands.executeCommand("workbench.view.extension.snippetbox-sidebar-view");


		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('snippetbox.open', () => {
			// create and show a new webview
			const panel = vscode.window.createWebviewPanel(
				'snippetBox', // used internally to identify type fo webview
				'DECKS', // Title of panel displayed to the user
				vscode.ViewColumn.One, // editor column to show new webview panel
				{
					// enableScripts: true
				} // webview options
			);

			const stylePath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'css', 'styles.css'));
			const styleSrc = panel.webview.asWebviewUri(stylePath);
			
			const snippetFilePath = vscode.Uri.file(
				path.join(context.extensionPath, 'src', 'html', 'snippets.html')
			);
			
			// set HTML content
			panel.webview.html = fs.readFileSync(snippetFilePath.fsPath, 'utf8');

			
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('snippetbox.listen', async () => {
			try {
				if (!speechClientInitiated) {
					if (ToolboxPanel.keywords) {
						keywords = ToolboxPanel.keywords;
					} else if (SidebarProvider.keywords) {
						keywords = SidebarProvider.keywords;
					}
					console.log(JSON.parse(keywords)); // error here if turn listen on from settings
					SpeechClient.startSpeechRecognition(JSON.parse(keywords));
					speechClientInitiated = true;
				}
				else {
					SpeechClient.startSpeechRecognition();
				}
				
			} catch (err) {
				console.log(err);
			}
			
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('snippetbox.stopListen', async () => {
			try {
				SpeechClient.stopSpeechRecognition();
			} catch (err) {
				console.log(err);
			}
			
		})
	);

	// SpeechClient.startSpeechRecognition();
}



// this method is called when your extension is deactivated
export function deactivate() {}
