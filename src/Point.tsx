import {Vector} from './vector';

/**
 * A point tracks the size and position of each ball
 */
export class Point {
  public curPos: Vector;
  public friction: number;
  public originalPos: Vector;
  public radius: number;
  public size: number;
  public springStrength: number;
  public targetPos: Vector;
  public velocity: Vector;
  public color: string;

  // References used only by the div renderer
  private ballDiv: Element;

  constructor(x: number, y: number, z: number, size: number, color: string) {
    this.curPos = new Vector(x, y, z);
    this.size = size;
    this.color = color;
    this.friction = 0.8;
    this.originalPos = new Vector(x, y, z);
    this.radius = size;
    this.size = size;
    this.springStrength = 0.1;
    this.targetPos = new Vector(x, y, z);
    this.velocity = new Vector(0.0, 0.0, 0.0);
  }

  update(): void {
    const dx = this.targetPos.x - this.curPos.x;
    const ax = dx * this.springStrength;
    this.velocity.x += ax;
    this.velocity.x *= this.friction;
    this.curPos.x += this.velocity.x;

    const dy = this.targetPos.y - this.curPos.y;
    const ay = dy * this.springStrength;
    this.velocity.y += ay;
    this.velocity.y *= this.friction;
    this.curPos.y += this.velocity.y;

    const dox = this.originalPos.x - this.curPos.x;
    const doy = this.originalPos.y - this.curPos.y;
    const dd = (dox * dox) + (doy * doy);
    const d = Math.sqrt(dd);

    this.targetPos.z = d / 100 + 1;
    const dz = this.targetPos.z - this.curPos.z;
    const az = dz * this.springStrength;
    this.velocity.z += az;
    this.velocity.z *= this.friction;
    this.curPos.z += this.velocity.z;

    this.radius = this.size * this.curPos.z;
    if (this.radius < 1) {
      this.radius = 1;
    }
  }

  drawCanvas(cx: CanvasRenderingContext2D): void {
    cx.fillStyle = this.color;
    cx.beginPath();
    cx.arc(this.curPos.x, this.curPos.y, this.radius, 0, Math.PI * 2, true);
    cx.fill();
  }

  drawDiv( parent: Element): void {
    if (!this.ballDiv) {
      this.ballDiv = document.createElement('div');
      this.ballDiv.classList.add('point');
      parent.appendChild(this.ballDiv);
    }

    this.ballDiv.setAttribute('style',
      `background-color: ${this.color};
      top: ${this.curPos.y - this.radius}px;
      left: ${this.curPos.x - this.radius}px;
      width: ${this.radius * 2}px;
      height: ${this.radius * 2}px`);
  }
}
