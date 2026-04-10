import * as assert from "assert";
import * as vscode from "vscode";
import { buildLogStatement, insertLogStatement } from "./extension";

suite("buildLogStatement", () => {
  let mockDocument: vscode.TextDocument;

  setup(() => {
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

suite("insertLogStatement", () => {
  let mockEditor: vscode.TextEditor;
  let mockDocument: vscode.TextDocument;
  let insertCalls: Array<{ position: vscode.Position; text: string }> = [];

  setup(() => {
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
