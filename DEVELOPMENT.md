# Development Documentation

## Developing 

Use the in-built VSCode "Run and Debug" `F5` function (the Play button).

### Tips

The `watch` script is automatically run as declared in `.vscode/tasks.json` and launched by `.vscode/launch.json`.

The Extension Development Host (popup VSCode window) will open `sample-workspace` automatically as declared in `args` in `launch.json`.

### Iterating

1. Make change in code
2. In the Extension Development Host (popup VSCode window), `command shift p` -> `Developer: Restart Extension Host`
3. Changes should show

Or, you could use the green, circle arrow button to Restart, but it is slower.

## Testing
```
pnpm test
```

The `pretest` script is automatically run by `vscode-test`

## Publishing
```
pnpm vscode:publish
```
The `vscode:prepublish` script is automatically run by `vsce publish` allowing you to customise what is compiled and released

### Things to note
In order to minimise the size of the published extension (contents of `dist`), the test files are compiled separately into `dist-test` and are not distributed.

## Changes from the default scaffold

### Tools

- Uses [pnpm](https://pnpm.io/) (instead of npm)
- Uses [tsdown](https://tsdown.dev/) to build and bundle the app (instead of tsc)
- Uses [oxc](https://oxc.rs/docs/guide/introduction.html) (instead of eslint)

⚠️ No changes were made to the testing dependencies since the VSCode Test CLI [exclusively uses Mocha under the hood](https://code.visualstudio.com/api/working-with-extensions/testing-extension).

### Build

- The compiled output is now bundled into one `dist/extension.cjs` file