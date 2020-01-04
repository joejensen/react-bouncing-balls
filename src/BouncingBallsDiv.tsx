/**
 * @class BouncingBallsDivComponent
 */
import * as React from 'react';
import {RefObject} from "react";
import {PointCollection} from "./PointCollection";

export type BouncingBallsDivProps = {
  src: string;
  width: number;
  height: number;
  cellSize: number;
}

export default class BouncingBallsDivComponent extends React.Component<BouncingBallsDivProps> {
  static defaultProps: BouncingBallsDivProps = {
    src: '',
    width: 512,
    height: 512,
    cellSize: 20
  };

  private readonly containerRef: RefObject<HTMLDivElement>;
  private readonly pointCollection: PointCollection = new PointCollection();

  constructor(props: BouncingBallsDivProps) {
    super(props);
    this.containerRef = React.createRef();
  }

  render() {
    return (
      <div ref={this.containerRef} className="BouncingBallsDiv_container"/>
    )
  }

  public componentDidMount(): void {
    const containerEl: HTMLDivElement | null = this.containerRef.current;
    if( !containerEl) {
      return;
    }

    containerEl.ontouchstart = e => {
      e.preventDefault();
    };

    containerEl.ontouchmove = e => {
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

      let currentObject: any = containerEl;
      if ( currentObject.offsetParent) {
        do {
          ePosx += currentObject.offsetLeft;
          ePosy += currentObject.offsetTop;
          currentObject = currentObject.offsetParent;
        } while ( currentObject.offsetParent);
      }
      this.pointCollection.mousePos.setValue(mPosx - ePosx, mPosy - ePosy, 0);
    };

    containerEl.ontouchend = e => {
      e.preventDefault();
      this.pointCollection.mousePos.setValue(-999, -999, -999);
    };

    containerEl.ontouchcancel = e => {
      e.preventDefault();
      this.pointCollection.mousePos.setValue(-999, -999, -999);
    };

    containerEl.onmousemove = e => {
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

      let currentObject: any = containerEl;
      if ( currentObject.offsetParent) {
        do {
          ePosx += currentObject.offsetLeft;
          ePosy += currentObject.offsetTop;
          currentObject = currentObject.offsetParent;
        } while ( currentObject.offsetParent);
      }
      this.pointCollection.mousePos.setValue(mPosx - ePosx, mPosy - ePosy, 0);
    };

    containerEl.onmouseleave = _e => {
      this.pointCollection.mousePos.setValue(-999, -999, -999);
    };

    containerEl.setAttribute('style', `width:${this.props.width}px; height:${this.props.height}px`);
    this.pointCollection.loadFromSource( this.props.src, this.props.width, this.props.height, this.props.cellSize);
    this.timeout();
  }

  private timeout(): void {
    const container: HTMLDivElement | null = this.containerRef.current;
    if( !container) {
      return;
    }

    this.pointCollection.drawDiv(container);
    this.pointCollection.update();
    setTimeout(() => this.timeout(), 30);
  }
}
