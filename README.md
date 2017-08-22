# dprs

<p align="center">
  <a href="https://npmjs.org/package/dprs">
    <img src="https://img.shields.io/npm/v/dprs.svg?style=flat"
         alt="NPM Version">
  </a>
  
  <a href="https://travis-ci.org/nhz-io/dprs">
    <img src="https://img.shields.io/travis/nhz-io/dprs.svg?style=flat"
         alt="Travis Build">
  </a>

  <a href="https://coveralls.io/github/nhz-io/dprs">
    <img src="https://img.shields.io/coveralls/nhz-io/dprs.svg?style=flat"
         alt="Coveralls">
  </a>

  <a href="https://www.bithound.io/github/nhz-io/dprs">
    <img src="https://img.shields.io/bithound/code/github/nhz-io/dprs.svg?style=flat"
         alt="Bithound Status">
  </a>

  <a href="https://github.com/nhz-io/dprs/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/nhz-io/dprs.svg?style=flat"
         alt="License">
  </a>
</p>
<p align="center">
    <h3 align="center">Dependency Resolver</h3>
</p>

## Install
```bash
npm i -S dprs
```

## Usage

> Circular dependencies will never get resolved

```javascript
const DependencyResolver = require('dprs')

const dprs = new DependencyResolver()

dprs.add('foobar', ['foo', 'bar'])
dprs.add('barfoo', ['foo', 'bar'])
dprs.add('foo', ['bar'])

dprs.resolve('foobar') // -> false
dprs.resolve('barfoo') // -> false
dprs.resolve('foo')    // -> false

dprs.resolve('bar')    // -> true
dprs.resolve('foobar') // -> false
dprs.resolve('barfoo') // -> false

dprs.resolve('foo')    // -> true
dprs.resolve('foobar') // -> true
dprs.resolve('barfoo') // -> true
```

## Dev

```sh
git clone https://github.com/nhz-io/dprs
cd dprs
npm i
npm start
```

### Coverage
```sh
npm run coverage
npm run report
```

## License

### [MIT](LICENSE)

## Version 1.0.3