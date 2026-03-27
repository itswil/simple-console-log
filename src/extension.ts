import path from 'path';
import * as vscode from 'vscode';
import { insertConsoleLog } from './helpers/insertConsoleLog';
import { isSupportedFileExtension } from './helpers/isSupportedFileExtension';

export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand('fastConsoleLog.log', () => {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return;
    }

    if (!isSupportedFileExtension(path.extname(editor.document.fileName))) {
      vscode.window.showInformationMessage("Fast Console Log only supports JS and TS files.");
      return;
    }

    const document = editor.document;
    const selection = editor.selection;

    if (!selection.isEmpty) {
      // Case 1: User has text selected (could be multiple words/lines)
      const variableRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
      const selectedText = document.getText(selection);

      if (selectedText) {
        if (variableRegex.test(selectedText)) {
          insertConsoleLog(editor, selectedText);
        } else {
          vscode.window.showWarningMessage(`"${selectedText}" cannot be logged.`);
        }
      }
    } else {
      // Case 2: No text is selected
      const wordRange = document.getWordRangeAtPosition(selection.active);
      const line = document.lineAt(selection.active.line);

      if (wordRange) {
        // Case 2.1: Word found under cursor
        const word = document.getText(wordRange);
        insertConsoleLog(editor, word);
      } else if (line.isEmptyOrWhitespace) {
        // Case 2.2: Cursor on empty line
        insertConsoleLog(editor, "");
      } else {
        vscode.window.showWarningMessage("No word or selection found.");
      }
    }

  });

  context.subscriptions.push(command);
}

export function deactivate() { }
