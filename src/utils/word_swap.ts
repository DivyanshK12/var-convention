import * as vscode from 'vscode';
import { toCamelCase } from './words';
import { subscribeToDocumentChanges, VARIABLE_CONVENTION } from '../diagnostic';

//. this has code except the activate() part from 
// https://github.com/microsoft/vscode-extension-samples/blob/main/code-actions-sample/src/extension.ts
const COMMAND = 'first-extension.replace-command';
// code action to convert to CamelCase
class Conventionizer implements vscode.CodeActionProvider
{
    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];

    public provideCodeActions(document : vscode.TextDocument, range : vscode.Range) : vscode.CodeAction[] | undefined 
    {
        // can have initial check to ensure that we are at correct position
        // of the variable name, and can return if that is not the case
        if(range.start.character !== range.end.character)
        {
            const start = range.start;
            const line = document.lineAt(start.line);
            const variable = line.text.slice(start.character, range.end.character);
            const replaceWithCamelCase = this.createFix(document, range, variable);
            replaceWithCamelCase.isPreferred = true;
            return [replaceWithCamelCase];
        }
    }

    public createFix(document: vscode.TextDocument, range: vscode.Range, variable: string) : vscode.CodeAction 
    {
        // currently swaps to camelcase
        const fix = new vscode.CodeAction(`Convert to ${toCamelCase(variable)}`, vscode.CodeActionKind.QuickFix);
        fix.edit = new vscode.WorkspaceEdit();
        fix.edit.replace(document.uri, new vscode.Range(range.start, range.start.translate(0, variable.length)), toCamelCase(variable));
        return fix;
    }
}

class ConventionInfo implements vscode.CodeActionProvider
{
    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];

    provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken) : vscode.CodeAction[] 
    {
        return context.diagnostics
            .filter(diagnostic => diagnostic.code === VARIABLE_CONVENTION)
            .map(diagnostic => this.createCommandCodeAction(diagnostic));
    }

    private createCommandCodeAction(diagnostic : vscode.Diagnostic) : vscode.CodeAction
    {
        const action = new vscode.CodeAction("Learn more ...", vscode.CodeActionKind.QuickFix);
        action.command = { command: COMMAND, title: 'Learn more about conventions', tooltip: 'This will open the medium article' };
        action.diagnostics = [diagnostic];
        action.isPreferred = true;
        return action;
    }
}
export { Conventionizer, ConventionInfo, COMMAND };