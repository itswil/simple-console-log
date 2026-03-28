import path from 'path';
import * as vscode from 'vscode';
import { insertConsoleLog } from './helpers/insertConsoleLog';
import { isLoggableSelection } from './helpers/isLoggableSelection';
import { isSupportedFileExtension } from './helpers/isSupportedFileExtension';
import { isSupportedLanguageId } from './helpers/isSupportedLanguageId';

export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand('fastConsoleLog.log', () => {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return;
    }

    if (!isSupportedLanguageId(editor.document.languageId) &&
      !isSupportedFileExtension(path.extname(editor.document.fileName).toLowerCase())) {
      vscode.window.showInformationMessage("Fast Console Log: Only JS and TS files are supported.");
      return;
    }

    const document = editor.document;
    const selection = editor.selection;

    if (!selection.isEmpty) {
      // Case 1: User has text selected (could be multiple words/lines)

      const selectedText = document.getText(selection);

      if (selectedText) {
        if (isLoggableSelection(selectedText)) {
          insertConsoleLog(editor, selectedText);
        } else {
          vscode.window.showWarningMessage(`Fast Console Log: Text selection cannot be logged.`);
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
        vscode.window.showWarningMessage("Fast Console Log: No word or selection found.");
      }
    }

  });

  context.subscriptions.push(command);
}

export function deactivate() { }
