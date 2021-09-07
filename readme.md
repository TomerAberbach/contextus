<h1 align="center">
  contextus
</h1>

<div align="center">
  <a href="https://npmjs.org/package/contextus">
    <img src="https://badgen.now.sh/npm/v/contextus" alt="version" />
  </a>
  <a href="https://github.com/TomerAberbach/contextus/actions">
    <img src="https://github.com/TomerAberbach/contextus/workflows/CI/badge.svg" alt="CI" />
  </a>
  <a href="https://bundlephobia.com/result?p=contextus">
    <img src="https://badgen.net/bundlephobia/minzip/contextus" alt="minzip size" />
  </a>
</div>

<div align="center">
  The context you know and love, but framework agnostic!
</div>

## Features

- **Microscopic:** ~175 B minzipped!
- **Simple:** just `provide` and `use`
- **Fancy:** contextus is Latin for context!

## Install

```sh
$ npm i contextus
```

## Usage

```js
import context from 'contextus'

const myContext = context()

function a() {
  b()

  return `Amazing!`
}

function b() {
  c()
}

function c() {
  d()
}

function d() {
  const value = myContext.use()

  console.log(`d: ${value}`)
}

const returnValue = myContext.provide(`Spectacular!`, a)
//=> d: Spectacular!

console.log(returnValue)
//=> Amazing!

try {
  myContext.use()
} catch (e) {
  console.log(e.message)
}
//=> context: use called outside provide
```

See the
[type definitions](https://github.com/TomerAberbach/contextus/blob/main/src/index.d.ts)
for more documentation.

## Contributing

Stars are always welcome!

For bugs and feature requests,
[please create an issue](https://github.com/TomerAberbach/contextus/issues/new).

For pull requests, please read the
[contributing guidelines](https://github.com/TomerAberbach/contextus/blob/master/contributing.md).

## License

[Apache 2.0](https://github.com/TomerAberbach/contextus/blob/master/license)

This is not an official Google product.
