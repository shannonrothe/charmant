import React from "react";
import { Error, getError } from "./errors";
import { ChicProps } from "./types";
import {
  appendClassToStyle,
  isPropertyLineWithoutSemiColon,
  nextId,
} from "./utils";

let shown = false;
let errors: string[] = [];
const styleNode = document.createElement("style");

const parseExpressions = <T>(
  tag: keyof HTMLElementTagNameMap,
  css: string,
  styles: TemplateStringsArray,
  expressions: ExpressionList<T>,
  theme?: T
) =>
  expressions
    .reduce(
      (acc, exp, position) => {
        if (typeof exp === "function") {
          if (!theme) {
            if (!shown) {
              errors.push(getError({ type: Error.RESOLVE, tag }));
              shown = true;
            }
          }
          acc.push(theme ? exp(theme) : "", styles[position + 1]);
        } else {
          acc.push(exp, styles[position + 1]);
        }

        return acc;
      },
      [css]
    )
    .filter(Boolean)
    .join("");

const styledFactory = <T>(tag: keyof HTMLElementTagNameMap, theme?: T) => {
  return (styles: TemplateStringsArray, ...expressions: ExpressionList<T>) => {
    let css = styles[0];
    const className = `c${nextId()}`;

    expressions.length > 0 &&
      (css = parseExpressions(tag, css, styles, expressions, theme));

    errors.forEach((err) => console.warn(err));
    errors = [];

    const invalidLines = css
      .trim()
      .split("\n")
      .filter(isPropertyLineWithoutSemiColon);
    invalidLines.length > 0 &&
      console.error(
        getError({
          type: Error.SEMI_COLON,
          tag,
          lines: invalidLines,
        })
      );

    appendClassToStyle(styleNode, className, css);

    return ({
      children,
      ...props
    }: ChicProps<HTMLElementTagNameMap[typeof tag]>) =>
      React.createElement(tag, { ...props, children, className });
  };
};

type ExpressionList<T> = (string | ((theme: T) => string))[];

export const chic = <T>(theme?: T) => {
  const styled = (tag: keyof HTMLElementTagNameMap) => (
    styles: TemplateStringsArray,
    ...expressions: ExpressionList<T>
  ) => styledFactory<T>(tag, theme)(styles, ...expressions);

  return { styled };
};
