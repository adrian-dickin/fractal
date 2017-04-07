class Angles {
  static twoPI = 2.0 * Math.PI;

  static normalise(angle) {
    if (angle > Angles.twoPI) {
      angle -= Angles.twoPI;
    }
    return angle;
  }
}

class Circle {
  x: number;
  y: number;
  radius: number;
  depth: number;
  angle: number;

  constructor(x: number, y: number, radius, depth, angle: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.depth = depth;
    this.angle = angle;
  }

  overlapping(x, y, radius): boolean {
    let xDelta = x - this.x;
    let yDelta = y - this.y;
    let distance = Math.sqrt((xDelta * xDelta) + (yDelta * yDelta));
    return (distance < radius + this.radius);
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "green";
  /*  context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.stroke();*/
    let startAngle = this.angle;
    let step = Math.PI / 15.0;
  //  let halfPI = Math.PI / 2.0;
    context.arc(this.x, this.y, this.radius, this.angle, this.angle + Math.PI);
    for (let i = 1; i < 40; i++) {
      let radius = this.radius - (i / 60) * this.radius;
      let angle = this.angle + Math.PI + i * step;
      let x = this.x + Math.cos(angle) * radius;
      let y = this.y + Math.sin(angle) * radius;
      context.lineTo(x, y);
    }
    context.stroke();
  }
};

class Circles {
  circles: Circle[];
  context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  private noOverlap(x, y , radius): boolean {
    let i: number;
    for (i = 0; i < this.circles.length; i++) {
      if (this.circles[i].overlapping(x, y, radius)) {
        return false;
      }
    }
    return true;
  }

  addCircle(x, y, radius, depth, angle) {
    this.circles.push(new Circle(x, y, radius, depth, angle));
    if (depth >= 10) {
      return;
    }

  }

  draw() {
    this.circles.forEach(circle => circle.draw(this.context));
  }

  addToLevel(depth, radius) {
    let circlesAtLevel = this.circles.filter(circle => { return circle.depth === depth; });
    for (let i = 0; i < 16; i++) {
      circlesAtLevel.forEach(circle => {
        let angle = Math.random() * 2 * Math.PI;
        let newX = circle.x + (circle.radius + radius) * Math.cos(angle);
        let newY = circle.y + (circle.radius + radius) * Math.sin(angle);
        if (this.noOverlap(newX, newY, radius)) {
          let newAngle = Angles.normalise(angle + Math.PI);
          this.addCircle(newX, newY, radius, depth + 1, newAngle);
        }
      });
    }
  }

  start(): void {
    this.circles = [];
    let radius = 50;
    this.addCircle(512, 320, radius, 1, 0.0);

    let depth;
    for (depth = 1; depth < 14; depth++) {
      radius = radius * 0.8;
      this.addToLevel(depth, radius);
    }
    this.draw();
  }
}


document.addEventListener("DOMContentLoaded", () => {
  let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("drawing");
  let context: CanvasRenderingContext2D = canvas.getContext("2d");
  let circles: Circles = new Circles(context);
  circles.start();
});
