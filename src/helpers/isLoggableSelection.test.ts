import * as assert from "assert";
import { isLoggableSelection } from "./isLoggableSelection";

suite("isLoggableSelection", () => {
  test("returns true for valid identifiers", () => {
    assert.strictEqual(isLoggableSelection("foo"), true);
    assert.strictEqual(isLoggableSelection("bar"), true);
    assert.strictEqual(isLoggableSelection("_private"), true);
    assert.strictEqual(isLoggableSelection("$special"), true);
    assert.strictEqual(isLoggableSelection("camelCase"), true);
    assert.strictEqual(isLoggableSelection("PascalCase"), true);
    assert.strictEqual(isLoggableSelection("withNumbers123"), true);
    assert.strictEqual(isLoggableSelection("with_underscore"), true);
    assert.strictEqual(isLoggableSelection("$"), true);
    assert.strictEqual(isLoggableSelection("_"), true);
    assert.strictEqual(isLoggableSelection("#myPrivateProp"), true);
  });

  test("returns true for valid expressions", () => {
    assert.strictEqual(isLoggableSelection("foo.bar"), true);
    assert.strictEqual(isLoggableSelection("this.user.profile.id"), true);
    assert.strictEqual(isLoggableSelection("foo[0]"), true);
    assert.strictEqual(isLoggableSelection("matrix[0][1]"), true);
    assert.strictEqual(isLoggableSelection("foo()"), true);
    assert.strictEqual(isLoggableSelection("user.getName()"), true);
    assert.strictEqual(isLoggableSelection("foo.bar()"), true);
    assert.strictEqual(isLoggableSelection("arr[0].name"), true);
    assert.strictEqual(isLoggableSelection("obj.prop.nested"), true);
    assert.strictEqual(isLoggableSelection("arr[*]"), true);
    assert.strictEqual(isLoggableSelection("user?.address?.city"), true);
    assert.strictEqual(isLoggableSelection("data['key']"), true);
  });

  test("returns false for invalid selections", () => {
    assert.strictEqual(isLoggableSelection("123"), false);
    assert.strictEqual(isLoggableSelection("foo-bar"), false);
    assert.strictEqual(isLoggableSelection("foo bar"), false);
    assert.strictEqual(isLoggableSelection(""), false);
    assert.strictEqual(isLoggableSelection("foo bar"), false);
  });
});
