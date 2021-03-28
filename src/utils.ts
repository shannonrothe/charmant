import { compile, serialize, stringify } from "stylis";

export const nextId = (() => {
  let id = 0;
  return function() {
    return ++id;
  };
})();

export const appendClassToStyle = (
  node: HTMLStyleElement,
  className: string,
  css: string
) => {
  const parsed = serialize(compile(`.${className} { ${css} }`), stringify);
  node.appendChild(document.createTextNode(`${parsed}`));
  document.head.appendChild(node);
};

export const isPropertyLineWithoutSemiColon = (line: string) => {
  const trimmed = line.trim();

  return (
    trimmed.length > 0 &&
    trimmed.includes(":") &&
    !trimmed.startsWith("&") &&
    !trimmed.endsWith(";")
  );
};
