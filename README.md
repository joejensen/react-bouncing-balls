# react-bouncing-balls
> React component to make google doodle style bouncing balls from an arbitrary image.  

[![NPM](https://img.shields.io/npm/v/react-bouncing-balls.svg)](https://www.npmjs.com/package/react-bouncing-balls) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Example
See demo available [here](https://www.joejensen.com/react-bouncing-balls/).

## Install

```bash
npm install --save react-bouncing-balls
```

## Usage

```ts
import React, { Component } from 'react'
import {BouncingBallsDivComponent, BouncingBallsCanvasComponent} from 'react-bouncing-balls'

export default class App extends Component {
  render () {
    return (
      <BouncingBallsDivComponent src="rainbowrose.jpg" cellSize="10"/>
    )
  }
}
```

## License

UNLICENSE © [joejensen](https://github.com/joejensen)
