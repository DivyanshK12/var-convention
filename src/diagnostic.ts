import * as vscode from 'vscode';

const VARIABLE_CONVENTION = 'variable convention';

const VARIABLE = /[a-z0-9]*_+[a-z0-9_]+/gm;// searches for this string in the document

function refreshDiagnostics(doc: vscode.TextDocument, variableDiagnostics: vscode.DiagnosticCollection) : void 
{
    const diagnostics : vscode.Diagnostic[] = [];

    for(let lineIndex = 0; lineIndex < doc.lineCount; lineIndex++)
    {
        const lineOfText = doc.lineAt(lineIndex);
        if(lineOfText.text.search(VARIABLE) !== -1)// returns index of match
        {
            diagnostics.push(createDiagnostic(doc, lineOfText, lineIndex));
        }
    }
    variableDiagnostics.set(doc.uri, diagnostics);
}

function createDiagnostic(doc: vscode.TextDocument, lineOfText: vscode.TextLine, lineIndex: number) : vscode.Diagnostic
{
    // find at which index the variable occours in that line
    const matches = lineOfText.text.match(VARIABLE)!;// used non null assertion operator
    const index = lineOfText.text.indexOf(matches[0]);
    // create range which represents where that variable occoured
    const range = new vscode.Range(lineIndex, index, lineIndex, index+matches[0].length);

    const diagnostic = new vscode.Diagnostic(range, "Do you want to update this variable name ?", vscode.DiagnosticSeverity.Hint);

    diagnostic.code = VARIABLE_CONVENTION;
    return diagnostic;
}

function subscribeToDocumentChanges(context : vscode.ExtensionContext, variableDiagnostics : vscode.DiagnosticCollection) : void 
{
    if(vscode.window.activeTextEditor)
    {
        refreshDiagnostics(vscode.window.activeTextEditor.document, variableDiagnostics);
    }
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor( editor => {
            if(editor)
            {
                refreshDiagnostics(editor.document, variableDiagnostics);
            }
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument( e => refreshDiagnostics(e.document, variableDiagnostics))
    );
    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument( doc => variableDiagnostics.delete(doc.uri))
    );

}

export { refreshDiagnostics, createDiagnostic, subscribeToDocumentChanges, VARIABLE_CONVENTION };