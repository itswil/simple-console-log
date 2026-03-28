import * as assert from 'assert';
import { isSupportedLanguageId } from './isSupportedLanguageId';

suite('isSupportedLanguageId', () => {
  test('returns true for supported language ids', () => {
    assert.strictEqual(isSupportedLanguageId('javascript'), true);
    assert.strictEqual(isSupportedLanguageId('javascriptreact'), true);
    assert.strictEqual(isSupportedLanguageId('typescript'), true);
    assert.strictEqual(isSupportedLanguageId('typescriptreact'), true);
    assert.strictEqual(isSupportedLanguageId('astro'), true);
    assert.strictEqual(isSupportedLanguageId('svelte'), true);
    assert.strictEqual(isSupportedLanguageId('vue'), true);
  });

  test('returns false for unsupported language ids', () => {
    assert.strictEqual(isSupportedLanguageId('python'), false);
    assert.strictEqual(isSupportedLanguageId('java'), false);
    assert.strictEqual(isSupportedLanguageId('go'), false);
    assert.strictEqual(isSupportedLanguageId('rust'), false);
    assert.strictEqual(isSupportedLanguageId('json'), false);
    assert.strictEqual(isSupportedLanguageId('html'), false);
    assert.strictEqual(isSupportedLanguageId('css'), false);
  });

  test('is case sensitive', () => {
    assert.strictEqual(isSupportedLanguageId('Javascript'), false);
    assert.strictEqual(isSupportedLanguageId('TypeScript'), false);
  });
});