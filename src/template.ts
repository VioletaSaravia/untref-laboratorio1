import p5 from "p5";

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth - 4, p.windowHeight - 4);
    p.frameRate(60);
  };

  p.draw = () => {
    p.background(26, 15, 46);
  };
};

new p5(sketch);
