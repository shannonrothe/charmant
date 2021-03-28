export const enum Error {
  RESOLVE,
  SEMI_COLON,
}

export type ErrorMessage =
  | {
      type: Error.RESOLVE;
      tag: string;
    }
  | { type: Error.SEMI_COLON; tag: string; lines: string[] };

export const getError = (error: ErrorMessage) => {
  switch (error.type) {
    case Error.RESOLVE:
      return `Could not resolve theme value for tag ${error.tag} as no theme was provided. Please ensure you pass a theme to \`chic()\` or set a theme globally with \`theme()\`.`;
    case Error.SEMI_COLON:
      const multiple = error.lines.length > 1;
      return `\tThe following line${multiple ? "s" : ""} for tag '${
        error.tag
      }' ${multiple ? "are" : "is"} missing ${
        multiple ? "semi-colons" : "a semi-colon"
      } at the end and as a result may not render correctly:\n\n${error.lines.join(
        "\n"
      )}\n`;
  }
};
