# charmant

**charmant** is a small CSS-in-JS library written for React.

charmant comes batteries-included with the following features:

- ⚡️ Custom theming
- 🔥 Pseudo-selectors
- 🎉 < 5kb production bundle (minified, gzipped)

⚠️ **Warning** This library is in an alpha stage and is likely to change frequently with breaking changes

## Installation

**yarn**

```sh
yarn add charmant
```

**npm**

```sh
npm install charmant
```

## Usage

To get started with **charmant**, call the `charmant` function and provide an optional theme. This function returns a `styled` function which you can use to create your React components.

```tsx
import React from "react";
import { charmant } from "charmant";

const { styled } = charmant();

const Box = styled("div")`
  width: 100%;
  height: 32px;
  background: black;
`;

export default function App() {
  return <Box />;
}
```

### Theming

Providing a theme object to the `charmant` function will allow you to resolve theme values in your components.

```tsx
import React from "react";
import { charmant } from "charmant";

const { styled } = charmant({
  colors: {
    blue: "#0000ff",
  },
});

const Button = styled("button")`
  background: ${(theme) => theme.colors.blue};
  color: white;
  border: 1px solid ${(theme) => theme.colors.blue};
`;

export default function App() {
  return <Button>Press me!</Button>;
}
```

### Pseudo-selectors

Sometimes you want to target pseudo properties on your components such as `hover` or `focus`. You can do that too in **charmant** – just add them to your defintions:

```tsx
const { styled } = charmant({
  colors: {
    blue: "#0000ff",
    red: "#ff0000",
  },
});

const Button = styled("button")`
  background: ${(theme) => theme.colors.blue};
  color: white;
  border: 1px solid ${(theme) => theme.colors.blue};

  &:hover {
    border-color: ${(theme) => theme.colors.red};
  }
`;

export default function App() {
  return <Button>Press me!</Button>;
}
```
