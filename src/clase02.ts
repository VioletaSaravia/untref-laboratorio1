import p5 from "p5";

const N = 64;
const Y = 48;

const yOffsets: number[] = []

let scan = 0
let mult = [0.5, 0, 0.2]

const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth - 4, p.windowHeight - 4);
        p.frameRate(60);

        for (let i = 0; i < N; i++) {
            yOffsets[i] = p.random(30, 60)
        }
    };

    p.draw = () => {
        scan = scan + p.deltaTime * 3
        if (scan > p.width) {
            scan -= p.width
            mult = [p.random(0.2, 1), p.random(0.2, 1), p.random(0.2, 1)]
        }
        p.background(26, 15, 46);
        for (let i = 10; i < N - 1 - 10; i++) {
            for (let j = 5; j < Y + 5; j++) {
                let xStart = i * p.width / N;
                let yStart = yOffsets[i] + j * 12;

                let int = p.abs(xStart - scan) + 10;
                p.stroke(mult[0] * int, mult[1] * int, mult[2] * int)
                p.line(xStart, yStart, (i + 1) * p.width / N, yOffsets[i + 1] + j * 12)
            }
        }
    };
};

new p5(sketch);
