import React, { Component } from 'react'
import {BouncingBallsDivComponent, BouncingBallsCanvasComponent} from 'react-bouncing-balls'

export default class App extends Component {
  render () {
    return (
      <div className="outer-frame">
        <div className="frame">
          <div className="label">Image</div>
          <div className="inner-frame">
            <img src="rainbowrose.jpg" alt="Rainbow Rose"/>
          </div>
        </div>
        <div className="frame">
          <div className="label">Canvas</div>
          <div className="inner-frame">
            <BouncingBallsCanvasComponent src="rainbowrose.jpg" cellSize="10"/>
          </div>
        </div>
        <div className="frame">
            <div className="label">Divs</div>
            <div className="inner-frame">
              <BouncingBallsDivComponent src="rainbowrose.jpg" cellSize="10"/>
            </div>
        </div>
      </div>
    )
  }
}
