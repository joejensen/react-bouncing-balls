/**
 * @class BouncingBallsCanvasComponent
 */
import * as React from 'react';
import {RefObject} from "react";
import {PointCollection} from "./PointCollection";
import {BouncingBallsDivProps} from "./BouncingBallsDiv";

export type BouncingBallsCanvasProps = {
  src: string;
  width: number;
  height: number;
  cellSize: number;
}

export default class BouncingBallsCanvasComponent extends React.Component<BouncingBallsCanvasProps> {
  static defaultProps: BouncingBallsDivProps = {
    src: '',
    width: 512,
    height: 512,
    cellSize: 20
  };

  private readonly canvasRef: RefObject<HTMLCanvasElement>;
  private readonly pointCollection: PointCollection = new PointCollection();
  private cx: CanvasRenderingContext2D | null;

	constructor(props: BouncingBallsCanvasProps) {
	  super(props);
    this.canvasRef = React.createRef();
	}

  render() {
    return (
      <canvas ref={this.canvasRef} className="react-bouncing-balls-canvas"/>
    )
  }

  public componentDidMount(): void {
    const canvasEl: HTMLCanvasElement | null= this.canvasRef.current;
    if( !canvasEl) {
      return;
    }

    canvasEl.ontouchstart = e => {
      e.preventDefault();
    };

    canvasEl.ontouchmove = e => {
      e.preventDefault();

      let mPosx = 0;
      let mPosy = 0;
      let ePosx = 0;
      let ePosy = 0;

      if (e.targetTouches[0].pageX || e.targetTouches[0].pageY) {
        mPosx = e.targetTouches[0].pageX;
        mPosy = e.targetTouches[0].pageY;
      } else if (e.targetTouches[0].clientX || e.targetTouches[0].clientY) {
        mPosx = e.targetTouches[0].clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        mPosy = e.targetTouches[0].clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }

      let currentObject: any = canvasEl;
      if ( currentObject.offsetParent) {
        do {
          ePosx += currentObject.offsetLeft;
          ePosy += currentObject.offsetTop;
          currentObject = currentObject.offsetParent;
        } while ( currentObject.offsetParent);
      }
      this.pointCollection.mousePos.setValue(mPosx - ePosx, mPosy - ePosy, 0);
    };

    canvasEl.ontouchend = e => {
      e.preventDefault();
      this.pointCollection.mousePos.setValue(-999, -999, -999);
    };

    canvasEl.ontouchcancel = e => {
      e.preventDefault();
      this.pointCollection.mousePos.setValue(-999, -999, -999);
    };

    canvasEl.onmousemove = e => {
      let mPosx = 0;
      let mPosy = 0;
      let ePosx = 0;
      let ePosy = 0;

      if (e.pageX || e.pageY) {
        mPosx = e.pageX;
        mPosy = e.pageY;
      } else if (e.clientX || e.clientY) {
        mPosx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        mPosy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }

      let currentObject: any = canvasEl;
      if ( currentObject.offsetParent) {
        do {
          ePosx += currentObject.offsetLeft;
          ePosy += currentObject.offsetTop;
          currentObject = currentObject.offsetParent;
        } while ( currentObject.offsetParent);
      }
      this.pointCollection.mousePos.setValue(mPosx - ePosx, mPosy - ePosy, 0);
    };

    canvasEl.onmouseleave = _e => {
      this.pointCollection.mousePos.setValue(-999, -999, -999);
    };

    this.cx = canvasEl.getContext('2d');

    // set the width and height
    canvasEl.width = this.props.width;
    canvasEl.height = this.props.height;
    this.pointCollection.loadFromSource( this.props.src, this.props.width, this.props.height, this.props.cellSize);
    this.timeout();
  }

  private timeout(): void {
    const canvasEl: HTMLCanvasElement | null = this.canvasRef.current;
    if (!canvasEl || !this.cx) {
      return;
    }

    this.cx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    this.pointCollection.drawCanvas(this.cx);
    this.pointCollection.update();
    setTimeout(() => this.timeout(), 30);
  }

}
