const selectionRegex = /^[#a-zA-Z_$][a-zA-Z0-9_$*[\]().?#'"]*$/;

export const isLoggableSelection = (selection: string) => selectionRegex.test(selection);
