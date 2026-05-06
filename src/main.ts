import p5 from "p5";

let shapes = [
  {
    shape: "",
    color: [],
    alpha: 255,
    dir: new p5.Vector(),
    pos: new p5.Vector(),
  },
];

const ShapeType = ["circle", "square", "star"];

const Background = [26, 15, 46];

const Colors = [
  [110, 52, 140],
  [223, 53, 193],
  [100, 72, 140],
  [203, 73, 193],
];

const FRAMERATE = 60;
const SHAPE_MAX = 256;
const SHAPE_RADIUS = 12;
const SHAPE_FREQ = 60 / FRAMERATE;
const SHAPE_LIFETIME = SHAPE_MAX * SHAPE_FREQ;

let spawnTimer = 0;

function star(p: p5, x: number, y: number, r: number) {
  const leftX = x - r / 1.5;
  const rightX = x + r / 1.5;
  const upperY = y - r / 4;
  const midY = y - r / 1.5;
  const botY = y + r / 2;
  p.line(leftX, upperY, rightX, upperY);
  p.line(x, midY, leftX, botY);
  p.line(x, midY, rightX, botY);
  p.line(leftX, botY, rightX, upperY);
  p.line(rightX, botY, leftX, upperY);
}

const AnimationType = ["spiral", "mouse"];
let animation = AnimationType[0];

const Spiral = {
  cur: new p5.Vector(),
  prev: new p5.Vector(),
  offset: new p5.Vector(),
  speedRadial: 5,
  speedAngular: 5,
};

const sketch = (p: p5) => {
  p.setup = () => {
    const scrollbarGap = 4;
    p.createCanvas(p.windowWidth - scrollbarGap, p.windowHeight - scrollbarGap);
    p.frameRate(FRAMERATE);
    p.background(220);

    for (let i = 0; i < SHAPE_MAX; i++) {
      shapes.push({
        shape: "",
        color: [],
        alpha: 255,
        dir: new p5.Vector(),
        pos: new p5.Vector(),
      });
    }

    Spiral.cur = p.createVector(10, 0);
    Spiral.prev = p.createVector(10, 0);
    Spiral.offset = p.createVector(p.windowWidth / 2, p.windowHeight / 2);
  };

  p.draw = () => {
    spawnTimer += p.deltaTime;
    let px = 0,
      py = 0,
      prevx = 0,
      prevy = 0;

    switch (animation) {
      case "mouse":
        px = p.mouseX;
        py = p.mouseY;
        prevx = p.pmouseX;
        prevy = p.pmouseY;
        break;

      case "spiral":
        px = Spiral.cur.x + Spiral.offset.x;
        py = Spiral.cur.y + Spiral.offset.y;
        prevx = Spiral.prev.x + Spiral.offset.x;
        prevy = Spiral.prev.y + Spiral.offset.y;
        break;

      default:
        break;
    }

    let direction = p.createVector(px - prevx, py - prevy).normalize();

    while (spawnTimer >= SHAPE_FREQ) {
      const idle = direction.magSq() === 0;
      if (idle) {
        direction = p.createVector(p.random(1), p.random(1)).normalize();
      }

      const shapeDir = direction.mult(-1).rotate(p.random(-p.PI / 2, p.PI / 2));

      shapes[p.frameCount % SHAPE_MAX] = {
        shape: p.random(ShapeType),
        color: p.random(Colors),
        alpha: 255,
        dir: shapeDir,
        pos: p.createVector(px, py),
      };

      spawnTimer -= SHAPE_FREQ;
    }

    p.background(Background[0], Background[1], Background[2]);

    p.noFill();
    p.stroke(255, 0, 255);

    shapes.forEach((s) => {
      s.pos = s.pos.add(s.dir);
      p.stroke(s.color[0], s.color[1], s.color[2], s.alpha);

      switch (s.shape) {
        case "circle":
          p.circle(s.pos.x, s.pos.y, SHAPE_RADIUS);
          break;

        case "square":
          p.square(s.pos.x, s.pos.y, SHAPE_RADIUS);
          break;

        case "star":
          star(p, s.pos.x, s.pos.y, SHAPE_RADIUS);

        default:
          break;
      }

      s.alpha -= 255 / SHAPE_LIFETIME;
    });

    p.fill(255);
    p.noStroke();
    p.textSize(16);
    p.text(((1 / p.frameRate()) * 1000).toFixed(2) + " ms/f", 10, 20);

    Spiral.prev = Spiral.cur;
    Spiral.cur = Spiral.cur.mult(1 + Spiral.speedRadial * p.deltaTime * 0.0003);
    Spiral.cur = Spiral.cur.rotate(Spiral.speedAngular * p.deltaTime * 0.002);

    if (Spiral.cur.x > p.windowWidth / 2) {
      Spiral.cur = p.createVector(5, 0, 0);
      Spiral.prev = p.createVector(5, 0, 0);
    }
  };
};

new p5(sketch);
