import React from "react";
import { createAnimation, KeyframeOptions, Keyframes } from "./animation/index";
import { Error, getError } from "./errors";
import { CharmantProps } from "./types";
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

const styledFactory = <T>(tag: keyof HTMLElementTagNameMap, theme?: T, animations?: string[]) => {
  return (styles: TemplateStringsArray, ...expressions: ExpressionList<T>) => {
    let css = styles[0];
    const className = `c${nextId()}`;

    expressions.length > 0 &&
      (css = parseExpressions(tag, css, styles, expressions, theme));

    if (animations) {
      css += `animation: ${animations.join(', ')};\n`;
    }

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
    }: CharmantProps<HTMLElementTagNameMap[typeof tag]>) =>
      React.createElement(tag, { ...props, children, className });
  };
};

type ExpressionList<T> = (string | ((theme: T) => string))[];

export const charmant = <T>(theme?: T) => {
  const keyframes = (frames: Keyframes, opts?: KeyframeOptions) => createAnimation(styleNode, frames, opts);

  const styled = (tag: keyof HTMLElementTagNameMap, animations?: string[]) => (
    styles: TemplateStringsArray,
    ...expressions: ExpressionList<T>
  ) => {
    return styledFactory<T>(tag, theme, animations)(styles, ...expressions);
  };

  return { styled, keyframes };
};
