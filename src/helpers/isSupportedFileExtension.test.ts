import * as assert from 'assert';
import { isSupportedFileExtension } from './isSupportedFileExtension';

suite('isSupportedFileExtension', () => {
  test('returns true for supported extensions', () => {
    assert.strictEqual(isSupportedFileExtension('.js'), true);
    assert.strictEqual(isSupportedFileExtension('.ts'), true);
    assert.strictEqual(isSupportedFileExtension('.jsx'), true);
    assert.strictEqual(isSupportedFileExtension('.tsx'), true);
    assert.strictEqual(isSupportedFileExtension('.mjs'), true);
    assert.strictEqual(isSupportedFileExtension('.cjs'), true);
    assert.strictEqual(isSupportedFileExtension('.mts'), true);
    assert.strictEqual(isSupportedFileExtension('.cts'), true);
    assert.strictEqual(isSupportedFileExtension('.astro'), true);
    assert.strictEqual(isSupportedFileExtension('.svelte'), true);
    assert.strictEqual(isSupportedFileExtension('.vue'), true);
  });

  test('returns false for unsupported extensions', () => {
    assert.strictEqual(isSupportedFileExtension('.py'), false);
    assert.strictEqual(isSupportedFileExtension('.java'), false);
    assert.strictEqual(isSupportedFileExtension('.cpp'), false);
    assert.strictEqual(isSupportedFileExtension('.go'), false);
    assert.strictEqual(isSupportedFileExtension('.rs'), false);
    assert.strictEqual(isSupportedFileExtension('.json'), false);
    assert.strictEqual(isSupportedFileExtension('.html'), false);
    assert.strictEqual(isSupportedFileExtension('.css'), false);
  });

  test('handles edge cases', () => {
    assert.strictEqual(isSupportedFileExtension(''), false);
    assert.strictEqual(isSupportedFileExtension('.JS'), false);
    assert.strictEqual(isSupportedFileExtension('.TS'), false);
  });
});
