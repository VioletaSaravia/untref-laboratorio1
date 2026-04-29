import p5 from 'p5'

let shapes = [
  {
    shape: "",
    color: [],
    dir: new p5.Vector,
    pos: new p5.Vector,
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

const SHAPE_MAX = 32;

let shapeCounter = 0
let nextShape = 0

function star(/** @type p5 */ p, /** @type number */ x, /** @type number */ y, /** @type number */ r) {
  const leftX = x - r / 1.5
  const rightX = x + r / 1.5
  const upperY = y - r / 4
  const midY = y - r / 1.5
  const botY = y + r / 2
  p.line(leftX, upperY, rightX, upperY)
  p.line(x, midY, leftX, botY)
  p.line(x, midY, rightX, botY)
  p.line(leftX, botY, rightX, upperY)
  p.line(rightX, botY, leftX, upperY)
}

const sketch = (/** @type p5 */ p) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth - 8, p.windowHeight - 8)
    p.background(220)

    for (let i = 0; i < SHAPE_MAX; i++) {
      shapes.push(
        {
          shape: "",
          color: [],
          dir: new p5.Vector,
          pos: new p5.Vector,
        }
      )
    }
  }

  p.draw = () => {
    shapeCounter = (shapeCounter + 1) % 5

    let mouseDir = p.createVector(p.mouseX - p.pmouseX, p.mouseY - p.pmouseY)
      .normalize()

    if (shapeCounter == 0) {
      const idle = mouseDir.magSq() === 0
      if (idle) {
        mouseDir = p.createVector(p.random(1), p.random(1)).normalize()
      }

      const shapeDir = mouseDir.mult(-1).rotate(p.random(-p.PI / 2, p.PI / 2))

      shapes[nextShape] = {
        shape: p.random(ShapeType),
        color: p.random(Colors),
        dir: shapeDir,
        pos: p.createVector(p.mouseX, p.mouseY)
      }
      console.log(shapes[nextShape])

      nextShape = (nextShape + 1) % SHAPE_MAX
    }

    p.background(Background[0], Background[1], Background[2])

    p.noFill()
    p.stroke(255, 0, 255)

    shapes.forEach(s => {
      s.pos = s.pos.add(s.dir)

      switch (s.shape) {
        case "circle":
          p.stroke(s.color[0], s.color[1], s.color[2])
          p.circle(s.pos.x, s.pos.y, 30)
          break;

        case "square":
          p.stroke(s.color[0], s.color[1], s.color[2])
          p.square(s.pos.x, s.pos.y, 30)
          break;

        case "star":
          p.stroke(s.color[0], s.color[1], s.color[2])
          star(p, s.pos.x, s.pos.y, 30)

        default: break;
      }
    }
    );

    p.fill(255)
    p.noStroke()
    p.textSize(16)
    p.text((1 / p.frameRate() * 1000).toFixed(2) + ' ms/f', 10, 20)
  }
}

new p5(sketch)