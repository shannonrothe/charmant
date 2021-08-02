import { nextId } from "../utils";

export type Keyframes = { [key: string]: { [key: string]: string | number } };
export type KeyframeOptions = {
  duration?: number,
  curve?: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear',
  iteration?: 'infinite' | number,
};

export const createAnimation = (
  styleNode: HTMLElement,
  frames: Keyframes,
  opts: KeyframeOptions = {},
) => {
  let { duration = 0.2, curve = 'ease-out', iteration = 1 } = opts;
  const suffixedDuration = duration > 1 ? `${duration}ms` : `${duration}s`;

  const animationName = `a${nextId()}`;
  let k = `@keyframes ${animationName}{`;
  for (const key in frames) {
    const properties = frames[key];
    k += `${key}{`;
    for (const attribute in properties) {
      const val = properties[attribute];
      k += `${attribute}:${val};`;
    }
    k += "}";
  }
  k += "}";

  styleNode.appendChild(document.createTextNode(k));

  return `${animationName} ${suffixedDuration} ${curve} ${iteration}`;
};