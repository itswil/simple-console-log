import path from 'path';
import * as vscode from 'vscode';
import { isLoggableSelection } from './helpers/isLoggableSelection';
import { isSupportedFileExtension } from './helpers/isSupportedFileExtension';
import { isSupportedLanguageId } from './helpers/isSupportedLanguageId';

export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand('simpleConsoleLog.log', () => {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return;
    }

    if (!isSupportedLanguageId(editor.document.languageId) &&
      !isSupportedFileExtension(path.extname(editor.document.fileName).toLowerCase())) {
      vscode.window.showInformationMessage("Simple Console Log: Only JS and TS files are supported.");
      return;
    }

    const document = editor.document;
    const selection = editor.selection;
    const activeLine = selection.active.line;

    if (!selection.isEmpty) {
      // Case 1: User has text selected (could be multiple words/lines)

      const selectedText = document.getText(selection);

      if (selectedText) {
        if (isLoggableSelection(selectedText)) {
          const logStatement = buildLogStatement(document, activeLine, selectedText);
          insertLogStatement(editor, document, activeLine, logStatement);
        } else {
          vscode.window.showWarningMessage(`Simple Console Log: Text selection cannot be logged.`);
        }
      }
    } else {
      // Case 2: No text is selected
      const wordRange = document.getWordRangeAtPosition(selection.active);
      const line = document.lineAt(activeLine);

      if (wordRange) {
        // Case 2.1: Word found under cursor
        const word = document.getText(wordRange);
        const logStatement = buildLogStatement(document, activeLine, word);
        insertLogStatement(editor, document, activeLine, logStatement);
      } else if (line.isEmptyOrWhitespace) {
        // Case 2.2: Cursor on empty line
        const logStatement = buildLogStatement(document, activeLine, "");
        insertLogStatement(editor, document, activeLine, logStatement);
      } else {
        vscode.window.showWarningMessage("Simple Console Log: No word or selection found.");
      }
    }
  });

  context.subscriptions.push(command);
}

export function deactivate() { }

export const buildLogStatement = (document: vscode.TextDocument, lineIndex: number, textSelection: string) => {
  const lineAt = document.lineAt(lineIndex);
  const indentation = lineAt.text.substring(0, lineAt.firstNonWhitespaceCharacterIndex);
  return `${indentation}console.log('🐸 ${textSelection}:', ${textSelection});`;
};

export const insertLogStatement = (editor: vscode.TextEditor, document: vscode.TextDocument, lineIndex: number, logStatement: string) => {
  const lineAt = document.lineAt(lineIndex);

  editor.edit(editBuilder => {
    // If it's the last line of the file, we need to insert a newline BEFORE the log
    if (lineIndex === document.lineCount - 1) {
      editBuilder.insert(lineAt.range.end, `\n${logStatement}`);
    } else {
      // Otherwise, insert at the start of the next line with a newline AFTER
      const nextLinePosition = new vscode.Position(lineIndex + 1, 0);
      editBuilder.insert(nextLinePosition, `${logStatement}\n`);
    }
  });
};