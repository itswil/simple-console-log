import * as assert from 'assert';

suite('Console Log Format', () => {
  test('console log format is correct', () => {
    const varName = 'myVariable';
    const indentation = '  ';
    const expectedLog = `${indentation}console.log('🐸 ${varName}:', ${varName});`;

    assert.strictEqual(expectedLog, '  console.log(\'🐸 myVariable:\', myVariable);');
  });

  test('console log format with empty varName', () => {
    const varName = '';
    const indentation = '';
    const expectedLog = `${indentation}console.log('🐸 ${varName}:', ${varName});`;

    assert.strictEqual(expectedLog, 'console.log(\'🐸 :\', );');
  });
});
