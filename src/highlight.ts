import * as vscode from 'vscode';

let timeout: NodeJS.Timer | undefined = undefined;
let activeEditor = vscode.window.activeTextEditor;

const semicolonDecorationType = vscode.window.createTextEditorDecorationType({
    borderWidth: '1px',
    borderStyle: 'solid',
    overviewRulerColor: 'blue',
    overviewRulerLane: vscode.OverviewRulerLane.Right,
    light: {
            // this color will be used in light color themes
            borderColor: 'darkblue'
    },
    dark: {
        // this color will be used in dark color themes
        borderColor: 'lightblue'
    }
});

function updateDecorations() : void {
    if (!activeEditor) {
        return;
    }

    const regEx = /;[\/\w *]*$/gm;// matches ; at end of line
    // accomodates comments too if at the end of a line
    const text = activeEditor.document.getText();
    const colons: vscode.DecorationOptions[] = [];
    let match;
    while ((match = regEx.exec(text))) {
        const startPos = activeEditor.document.positionAt(match.index);
        const endPos = activeEditor.document.positionAt(match.index + 1);// 1 since only ; is needed to be highlighted
        const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: `; present at ${endPos.character}` };
        colons.push(decoration);
    }
    activeEditor.setDecorations(semicolonDecorationType, colons);
};

function triggerUpdateDecorations() {
    if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
    }
    timeout = setTimeout(updateDecorations, 500);
}

function highlightMain(context : vscode.ExtensionContext)
{
    if (activeEditor) {
		triggerUpdateDecorations();
	}
	
	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);
	
	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);
}
export { highlightMain };