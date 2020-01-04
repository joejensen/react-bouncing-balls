/**
 * A basic 3d vector used to track position and velocity of the balls
 */
export class Vector {
  constructor(public x: number, public y: number, public z: number) {
  }

  setValue(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
