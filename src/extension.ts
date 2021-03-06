// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "snippetbox" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('snippetbox.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Woop Woop from SnippetBox!');
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(
		vscode.commands.registerCommand('snippetbox.open', () => {
			// create and show a new webview
			const panel = vscode.window.createWebviewPanel(
				'snippetBox', // used internally to identify type fo webview
				'SnippetBox', // Title of panel displayed to the user
				vscode.ViewColumn.One, // editor column to show new webview panel
				{
					// enableScripts: true
				} // webview options
			);

			const snippetFilePath = vscode.Uri.file(
				path.join(context.extensionPath, 'src', 'html', 'snippets.html')
			);
			
			// set HTML content
			panel.webview.html = fs.readFileSync(snippetFilePath.fsPath, 'utf8');
		})
	);
}



// this method is called when your extension is deactivated
export function deactivate() {}
