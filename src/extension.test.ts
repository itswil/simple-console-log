import assert from "node:assert/strict";
import { beforeEach, describe, test } from "node:test";
import * as vscode from "vscode";
import { buildLogStatement, insertLogStatement } from "./extension";

describe("buildLogStatement", () => {
  let mockDocument: vscode.TextDocument;

  beforeEach(() => {
    mockDocument = {
      lineAt: (lineIndex: number) => {
        const lines = [
          { text: "  const foo = 1;", firstNonWhitespaceCharacterIndex: 2 },
          { text: "\tconst bar = 2;", firstNonWhitespaceCharacterIndex: 1 },
          { text: "const baz = 3;", firstNonWhitespaceCharacterIndex: 0 },
          { text: "    nested.prop = 4;", firstNonWhitespaceCharacterIndex: 4 },
        ];
        return lines[lineIndex] as vscode.TextLine;
      },
    } as unknown as vscode.TextDocument;
  });

  test("builds log statement with no indentation", () => {
    const result = buildLogStatement(mockDocument, 2, "myVar");
    assert.strictEqual(result, "console.log('🐸 myVar:', myVar);");
  });

  test("builds log statement with space indentation", () => {
    const result = buildLogStatement(mockDocument, 0, "foo");
    assert.strictEqual(result, "  console.log('🐸 foo:', foo);");
  });

  test("builds log statement with tab indentation", () => {
    const result = buildLogStatement(mockDocument, 1, "bar");
    assert.strictEqual(result, "\tconsole.log('🐸 bar:', bar);");
  });

  test("builds log statement with nested property", () => {
    const result = buildLogStatement(mockDocument, 3, "nested.prop");
    assert.strictEqual(result, "    console.log('🐸 nested.prop:', nested.prop);");
  });

  test("builds log statement with empty text selection", () => {
    const result = buildLogStatement(mockDocument, 0, "");
    assert.strictEqual(result, "  console.log('🐸 :', );");
  });

  test("builds log statement with expression", () => {
    const result = buildLogStatement(mockDocument, 0, "arr[0]");
    assert.strictEqual(result, "  console.log('🐸 arr[0]:', arr[0]);");
  });
});

describe("insertLogStatement", () => {
  let mockEditor: vscode.TextEditor;
  let mockDocument: vscode.TextDocument;
  let insertCalls: Array<{ position: vscode.Position; text: string }> = [];

  beforeEach(() => {
    insertCalls = [];
    mockDocument = {
      lineCount: 5,
      lineAt: (lineIndex: number) => {
        return {
          range: { end: new vscode.Position(lineIndex, 10) },
        } as vscode.TextLine;
      },
    } as unknown as vscode.TextDocument;

    mockEditor = {
      edit: (editBuilder: (builder: vscode.TextEditorEdit) => void) => {
        const mockBuilder = {
          insert: (position: vscode.Position, text: string) => {
            insertCalls.push({ position, text });
          },
        } as unknown as vscode.TextEditorEdit;
        editBuilder(mockBuilder);
        return Promise.resolve(true);
      },
    } as unknown as vscode.TextEditor;
  });

  test("inserts log statement on next line when not last line", async () => {
    const logStatement = "console.log('🐸 foo:', foo);";
    await insertLogStatement(mockEditor, mockDocument, 0, logStatement);

    assert.strictEqual(insertCalls.length, 1);
    assert.strictEqual(insertCalls[0].position.line, 1);
    assert.strictEqual(insertCalls[0].position.character, 0);
    assert.strictEqual(insertCalls[0].text, "console.log('🐸 foo:', foo);\n");
  });

  test("inserts log statement at end of line when last line", async () => {
    const logStatement = "console.log('🐸 bar:', bar);";
    await insertLogStatement(mockEditor, mockDocument, 4, logStatement);

    assert.strictEqual(insertCalls.length, 1);
    assert.strictEqual(insertCalls[0].position.line, 4);
    assert.strictEqual(insertCalls[0].position.character, 10);
    assert.strictEqual(insertCalls[0].text, "\nconsole.log('🐸 bar:', bar);");
  });

  test("handles middle lines correctly", async () => {
    const logStatement = "console.log('🐸 baz:', baz);";
    await insertLogStatement(mockEditor, mockDocument, 2, logStatement);

    assert.strictEqual(insertCalls.length, 1);
    assert.strictEqual(insertCalls[0].position.line, 3);
    assert.strictEqual(insertCalls[0].position.character, 0);
  });
});

describe("integration", () => {
  test("should insert log with variable name in TypeScript", async () => {
    const document = await vscode.workspace.openTextDocument({
      content: "const count = 5;",
      language: "typescript",
    });

    const onDidChange = new Promise<void>((resolve) => {
      const disposable = vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document === document) {
          disposable.dispose(); // Clean up listener
          resolve();
        }
      });
    });

    const editor = await vscode.window.showTextDocument(document);

    const position = new vscode.Position(0, 8);
    editor.selection = new vscode.Selection(position, position);

    await vscode.commands.executeCommand("simpleConsoleLog.log");
    await onDidChange;

    const updatedText = document.getText();
    const expectedLog = "console.log('🐸 count:', count);";

    assert.ok(updatedText.includes(expectedLog), `Expected log not found. Got: ${updatedText}`);
  });

  test("should insert log with variable name in TypeScript JSX", async () => {
    const document = await vscode.workspace.openTextDocument({
      content: "const count = 5;",
      language: "typescriptreact",
    });

    const onDidChange = new Promise<void>((resolve) => {
      const disposable = vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document === document) {
          disposable.dispose(); // Clean up listener
          resolve();
        }
      });
    });

    const editor = await vscode.window.showTextDocument(document);

    const position = new vscode.Position(0, 11);
    editor.selection = new vscode.Selection(position, position);

    await vscode.commands.executeCommand("simpleConsoleLog.log");
    await onDidChange;

    const updatedText = document.getText();
    assert.ok(updatedText.includes("console.log('🐸 count:', count);"));
  });

  test("should be active for all supported languages", async () => {
    const supportedLanguageId = ["javascript", "typescript", "javascriptreact", "typescriptreact"];

    for (const lang of supportedLanguageId) {
      const doc = await vscode.workspace.openTextDocument({ content: "", language: lang });
      await vscode.window.showTextDocument(doc);

      const extension = vscode.extensions.getExtension("itswil.simple-console-log-frog");
      assert.strictEqual(extension?.isActive, true, `Extension should be active for ${lang}`);
    }
  });
});
