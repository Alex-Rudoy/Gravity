export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

  add(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  subtract(v: Vector): Vector {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  multiplyBy(n: number): Vector {
    return new Vector(this.x * n, this.y * n);
  }

  divideBy(n: number): Vector {
    return new Vector(this.x / n, this.y / n);
  }

  changeLength(l: number) {
    this.x = l * Math.cos(this.angle);
    this.y = l * Math.sin(this.angle);
  }
}
