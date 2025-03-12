const EPS = 1e-9;

const eq = (a, b) => Math.abs(a - b) <= EPS;

function vector(x) {
  return new Vector(x, x, x)
}

function vector(x, y, z) {
  return new Vector(x, y, z);
}

class Vector {
  constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize() {
    return this.divide(this.length());
  }

  negative() {
    return vector(-this.x, -this.y, -this.z);
  }

  add(v) {
    return vector(this.x + v.x, this.y + v.y, this.z + v.z)
  }

  subtract(v) {
    return vector(this.x - v.x, this.y - v.y, this.z - v.z)
  }

  multiply(k) {
    return vector(this.x * k, this.y * k, this.z * k)
  }

  divide(k) {
    return vector(this.x / k, this.y / k, this.z / k)
  }

  equals(v) {
    return eq(this.x, v.x) && eq(this.y, v.y) && eq(this.z, v.z);
  }

  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v) {
    return vector(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  toAngles() {
    return {
      theta: Math.atan2(this.z, this.x),
      phi: Math.asin(this.y / this.length())
    }
  }

  angleTo(a) {
    return Math.acos(this.dot(a) / (this.length() * a.length()));
  }
};

