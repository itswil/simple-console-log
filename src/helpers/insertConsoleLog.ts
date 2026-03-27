import * as vscode from 'vscode';

export const insertConsoleLog = (editor: vscode.TextEditor, varName: string) => {
  const document = editor.document;
  const lineIndex = editor.selection.active.line;
  const lineAt = document.lineAt(lineIndex);

  // Determine indentation to match the current line
  const indentation = lineAt.text.substring(0, lineAt.firstNonWhitespaceCharacterIndex);

  // Construct the log statement
  const logStatement = `${indentation}console.log('🐸 ${varName}:', ${varName});`;

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