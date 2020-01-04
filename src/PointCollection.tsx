import {Vector} from './vector';
import {Point} from './point';

/**
 * A collection of points / balls to be rendered to either a canvas or the dom as well as utilities to populate it
 */
export class PointCollection {
  public mousePos: Vector = new Vector(0, 0, 0);
  public points: Point[] = [];

  /**
   * Generates a css style color from the RGBA coordinates of a color
   */
  private static toColor( r: number, g: number, b: number, a: number): string {
    return 'rgba(' + [r, g, b, a].join(',') + ')';
  }

  /**
   * Adjusts a point to fit within the desired area
   */
  private static scalePoint( p: Point, canvasWidth: number, canvasHeight: number, imageWidth: number, imageHeight: number): void {
    p.curPos.x = ((canvasWidth - imageWidth) / 2) + p.curPos.x;
    p.curPos.y = ((canvasHeight - imageHeight) / 2) + p.curPos.y;
    p.originalPos.x = ((canvasWidth - imageWidth) / 2) + p.originalPos.x;
    p.originalPos.y = ((canvasHeight - imageHeight) / 2) + p.originalPos.y;
  }


  /**
   * Determines the average color within the cell so we know the color of the ball, summing the squares gives a better looking color
   */
  private static dominantColor( x: number, y: number, w: number, cellSize: number, data: Uint8ClampedArray): string | null {
    // Average the colors in the area
    let pixels = 0;
    let rSummed = 0;
    let gSummed = 0;
    let bSummed = 0;
    let aSummed = 0;
    for ( let localX = x; localX < x + cellSize; localX++) {
      for ( let localY = y; localY < y + cellSize; localY++) {
        const i = ((y * w) + x) * 4;
        if ( i < data.byteLength) {
          const r = data[i];
          rSummed += r * r;
          const g = data[i + 1];
          gSummed += g * g;
          const b = data[i + 2];
          bSummed += b * b;
          const a = data[i + 3];
          aSummed += a * a;
          pixels++;
        }
      }
    }

    const rFinal = Math.sqrt(rSummed / pixels);
    const gFinal = Math.sqrt(gSummed / pixels);
    const bFinal = Math.sqrt(bSummed / pixels);
    const aFinal = Math.sqrt(aSummed / pixels);

    if ( aFinal < 10 || (rFinal > 230 && gFinal > 230 && bFinal > 230)) {
      return null;
    }

    return PointCollection.toColor(rFinal, gFinal, bFinal, aFinal);
  }

  /**
   * Extracts point for an image into the point collection
   */
  public loadFromSource(
    src: string,
    destWidth: number,
    destHeight: number,
    cellSize: number): void {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.className = 'ng-bouncing-balls-bg-canvas';
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const context = tempCanvas.getContext('2d');
      if( context != null) {
        context.drawImage(img, 0, 0, img.width, img.height);
        const pixels = context.getImageData(0, 0, img.width, img.height);
        this.pointsFromImage(pixels, destWidth, destHeight, cellSize);
      }
    };

    img.onerror = (err) => {
      console.log(err);
    };
    img.src = src;
  }

  private pointsFromImage( img: ImageData, destWidth: number, destHeight: number, cellSize: number): void {
    const realCellSize = Math.max( 1, cellSize);
    const cellRadius = Math.floor(realCellSize / 2);
    const cols = Math.ceil(img.width / realCellSize);
    const rows = Math.ceil(img.height / realCellSize);
    for ( let y = 0; y < rows; y++) {
      for ( let x = 0; x < cols; x++) {
        const cellX = x * realCellSize;
        const cellY = y * realCellSize;
        const color = PointCollection.dominantColor(cellX, cellY, img.width, realCellSize, img.data);
        if ( color) {
          const p = new Point(cellX + cellRadius, cellY + cellRadius, 0, cellRadius, color);
          PointCollection.scalePoint(p, destWidth, destHeight, img.width, img.height);
          this.points.push(p);
        }
      }
    }
  }

  /**
   * Triggers the per-frame updates to the point collection
   */
  update(): void {
    for (const point of this.points) {
      const dx = this.mousePos.x - point.curPos.x;
      const dy = this.mousePos.y - point.curPos.y;
      const dd = (dx * dx) + (dy * dy);
      const d = Math.sqrt(dd);
      if (d < 150) {
        point.targetPos.x = (this.mousePos.x < point.curPos.x) ? point.curPos.x - dx : point.curPos.x - dx;
        point.targetPos.y = (this.mousePos.y < point.curPos.y) ? point.curPos.y - dy : point.curPos.y - dy;
      } else {
        point.targetPos.x = point.originalPos.x;
        point.targetPos.y = point.originalPos.y;
      }
      point.update();
    }
  }

  /**
   * Draws the point collection to a canvas
   */
  drawCanvas(cx: CanvasRenderingContext2D): void {
    for (const point of this.points) {
      point.drawCanvas(cx);
    }
  }

  /**
   * Draws the point collection to the DOM
   */
  drawDiv(parent: Element): void {
    for (const point of this.points) {
      point.drawDiv(parent);
    }
  }
}
