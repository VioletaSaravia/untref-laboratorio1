let shapes = [
  {
    shape: "",
    color: [],
    dir: new p5.Vector(),
    pos: new p5.Vector(),
  }
]

const ShapeType = ["circle", "square", "star"]

const Background = [26, 15, 46]

const Colors = [
  [110, 52, 140],
  [223, 53, 193],
  [100, 72, 140],
  [203, 73, 193],
]

const SHAPE_MAX = 64;
const SHAPE_RADIUS = 16;
const SHAPE_FREQ = 1;

let shapeCounter = 0
let nextShape = 0

function star(x, y, r) {
  const leftX = x - r / 1.5
  const rightX = x + r / 1.5
  const upperY = y - r / 4
  const midY = y - r / 1.5
  const botY = y + r / 2
  line(leftX, upperY, rightX, upperY)
  line(x, midY, leftX, botY)
  line(x, midY, rightX, botY)
  line(leftX, botY, rightX, upperY)
  line(rightX, botY, leftX, upperY)
}

const AnimationType = ["spiral", "mouse"]
let animation = AnimationType[1]

const Spiral = {
  cur: new p5.Vector(),
  prev: new p5.Vector(),
  offset: new p5.Vector(),
  speedRadial: 5,
  speedAngular: 5,
}

function setup() {
    createCanvas(windowWidth - 8, windowHeight - 8)
    background(220)

    for (let i = 0; i < SHAPE_MAX; i++) {
      shapes.push(
        {
          shape: "",
          color: [],
          dir: new p5.Vector(),
          pos: new p5.Vector(),
        }
      )
    }

    Spiral.cur = createVector(10, 0)
    Spiral.prev = createVector(10, 0)
    Spiral.offset = createVector(windowWidth / 2, windowHeight / 2)
  }

function draw() {
    let px = 0, py = 0, prevx = 0, prevy = 0

    switch (animation) {
      case "mouse":
        px = mouseX
        py = mouseY
        prevx = pmouseX
        prevy = pmouseY
        break;

      case "spiral":
        px = Spiral.cur.x + Spiral.offset.x
        py = Spiral.cur.y + Spiral.offset.y
        prevx = Spiral.prev.x + Spiral.offset.x
        prevy = Spiral.prev.y + Spiral.offset.y
        break;

      default:
        break;
    }

    shapeCounter = (shapeCounter + 1) % SHAPE_FREQ

    let direction = createVector(px - prevx, py - prevy).normalize()

    if (shapeCounter == 0) {
      const idle = direction.magSq() === 0
      if (idle) {
        direction = createVector(random(1), random(1)).normalize()
      }

      const shapeDir = direction.mult(-1).rotate(random(-PI / 2, PI / 2))

      shapes[nextShape] = {
        shape: random(ShapeType),
        color: random(Colors),
        dir: shapeDir,
        pos: createVector(px, py)
      }

      nextShape = (nextShape + 1) % SHAPE_MAX
    }

    background(Background[0], Background[1], Background[2])

    noFill()
    stroke(255, 0, 255)

    shapes.forEach(s => {
      s.pos = s.pos.add(s.dir)

      switch (s.shape) {
        case "circle":
          stroke(s.color[0], s.color[1], s.color[2])
          circle(s.pos.x, s.pos.y, SHAPE_RADIUS)
          break;

        case "square":
          stroke(s.color[0], s.color[1], s.color[2])
          square(s.pos.x, s.pos.y, SHAPE_RADIUS)
          break;

        case "star":
          stroke(s.color[0], s.color[1], s.color[2])
          star(s.pos.x, s.pos.y, SHAPE_RADIUS)

        default: break;
      }
    }
    );

    fill(255)
    noStroke()
    textSize(16)
    text((1 / frameRate() * 1000).toFixed(2) + ' ms/f', 10, 20)

    Spiral.prev = Spiral.cur
    Spiral.cur = Spiral.cur.mult(1 + Spiral.speedRadial * deltaTime * 0.0003)
    Spiral.cur = Spiral.cur.rotate(Spiral.speedAngular * deltaTime * 0.002)

    if (Spiral.cur.y > windowHeight / 2) {
      Spiral.cur = createVector(5, 0, 0)
      Spiral.prev = createVector(5, 0, 0)
    }
  }
