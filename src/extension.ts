// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { toSnakeCase, toCamelCase } from './utils/words';
import { subscribeToDocumentChanges, VARIABLE_CONVENTION } from './diagnostic';
import {Conventionizer, ConventionInfo, COMMAND } from './utils/word_swap';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "first-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let tosnakecase = vscode.commands.registerCommand('first-extension.toSnakecase', () => {
		
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		if(editor)
		{
			const document = editor.document;
			const selection = editor.selection;

			const word = document.getText(selection);
			const newWord : string = toSnakeCase(word);
			editor.edit(editBuilder => {
				editBuilder.replace(selection, newWord);
			});
		}
		
	});

	let tocamelcase = vscode.commands.registerCommand('first-extension.toCamelcase', () => {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		if(editor)
		{
			const document = editor.document;
			const selection = editor.selection;

			const word = document.getText(selection);
			const newWord : string = toCamelCase(word);
			editor.edit(editBuilder => {
				editBuilder.replace(selection, newWord);
			});
		}
	});
	// diagnostic example
	let cvIzer = vscode.languages.registerCodeActionsProvider('c', new Conventionizer(), {
		providedCodeActionKinds : Conventionizer.providedCodeActionKinds
	});
	let cvInfo = vscode.languages.registerCodeActionsProvider('markdown', new ConventionInfo(), {
		providedCodeActionKinds : ConventionInfo.providedCodeActionKinds
	}); // this gives the idea-icon kind of thingy
	// when uncommenting, also add this to subscriptions.push()

	const convDiagnostics = vscode.languages.createDiagnosticCollection("convention");
	const cmd = vscode.commands.registerCommand(COMMAND, () => vscode.env.openExternal(vscode.Uri.parse('https://unicode.org/emoji/charts-12.0/full-emoji-list.html')));
	subscribeToDocumentChanges(context, convDiagnostics);

	context.subscriptions.push(tosnakecase, tocamelcase, cvIzer, cvInfo, convDiagnostics, cmd);
}

// this method is called when your extension is deactivated
export function deactivate() {}
