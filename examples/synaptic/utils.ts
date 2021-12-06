export class Vector {
    public constructor(
      public x: number,
      public y: number,
    ) {}
  
    public set(x: number, y: number): Vector {
      this.x = x;
      this.y = y;
      return this;
    }
  
    public add(v: Vector) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }
  
    public sub(v: Vector) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    }
  
    public mul(s: number): Vector {
        this.x *= s;
        this.y *= s;
        return this; 
    }
    public div(s: number): Vector {
      this.x /= s;
      this.y /= s;
      return this;
    }
  
    get mag(): number {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
  
    public normalize(): Vector {
      this.mag && this.div(this.mag);
      return this;
    }
  
    get angle(): number {
      return Math.atan2(this.y, this.x);
    }
  
    public setMag(m: number): Vector {
      this.x = m * Math.cos(this.angle);
      this.y = m * Math.sin(this.angle);
      return this;
    }
  
    public setAngle(a: number): Vector {
      this.x = this.mag * Math.cos(a);
      this.y = this.mag * Math.sin(a);
      return this;
    }
  
    public rotate(a: number): Vector {
      this.setAngle(this.angle + a);
      return this;
    }
  
    public limit(l: number): Vector {
      if (this.mag > l) {
        this.setMag(l);
      }
      return this;
    }
  
    public angleBetween(v: Vector) {
      return this.angle - v.angle;
    }
  
    public dot(v: Vector): number {
      return this.x * v.x + this.y * v.y;
    }
  
    public lerp(v: Vector, amt:number): Vector {
      this.x += (v.x - this.x) * amt;
      this.y += (v.y - this.y) * amt;
      return this;
    }
  
    public dist(v: Vector): number {
      const dx = this.x - v.x;
      const dy = this.y - v.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  
    get copy(): Vector {
      return new Vector(this.x, this.y);
    }
  
    public random(): Vector {
      this.set(1, 1);
      this.setAngle(Math.random() * Math.PI * 2);
      return this;
    }
  
  }