import p5 from "p5";

const PINGPONG = false;

const dirs: p5.Vector[] = [];
const pos: p5.Vector[] = [];
const speed: number[] = []
const N = PINGPONG ? 1 : 100;
const radius = 20;

const FLOOR_NORMAL: p5.Vector = new p5.Vector(0, -1);
const CEIL_NORMAL: p5.Vector = new p5.Vector(0, 1);
const LEFT_NORMAL: p5.Vector = new p5.Vector(1, 0);
const RIGHT_NORMAL: p5.Vector = new p5.Vector(-1, 0);

const PLAYER_SPEED = 0.3

const p1 = {
    pos: 300,
    puntos: 0
}

const p2 = {
    pos: 300,
    puntos: 0
}

const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth - 4, p.windowHeight - 4);
        p.frameRate(60);

        dirs.push(p.createVector(p.random(-1, 1), p.random(-0.1, 0.1)).normalize())
        pos.push(p.createVector(p.width / 2, p.height / 2))
        speed[0] = p.random(0.2, 0.4)

        for (let i = 1; i < N; i++) {
            dirs.push(p.createVector(p.random(-0.8, 0.8), p.random(0.1, 0.8)).normalize())
            pos.push(p.createVector(p.random(20, p.width - 20), p.random(50, 100)))
            speed[i] = p.random(0.1, 0.3)
        }
    };

    p.draw = () => {
        p.background(26, 15, 46);

        p.noStroke();
        p.fill(255, 255, 255, 255);

        if (PINGPONG) {
            p.rect(20, p1.pos, 30, 80)
            p.rect(p.width - 20 - 30, p2.pos, 30, 80)

            const W = 87;
            const S = 83;
            if (p.keyIsDown(W)) {
                p1.pos -= p.deltaTime * PLAYER_SPEED
            }
            if (p.keyIsDown(S)) {
                p1.pos += p.deltaTime * PLAYER_SPEED
            }

            if (p.keyIsDown(p.DOWN_ARROW)) {
                p2.pos += p.deltaTime * PLAYER_SPEED
            }
            if (p.keyIsDown(p.UP_ARROW)) {
                p2.pos -= p.deltaTime * PLAYER_SPEED
            }
        }

        for (let i = 0; i < N; i++) {
            if (PINGPONG) {
                if (pos[i].dist(p.createVector(50, p1.pos)) < 50) {
                    dirs[i].reflect(LEFT_NORMAL)
                }

                if (pos[i].dist(p.createVector(p.width - 50, p2.pos)) < 50) {
                    dirs[i].reflect(RIGHT_NORMAL)
                }
            }
            let posAdd = p.createVector(dirs[i].x, dirs[i].y)
            posAdd.mult(p.deltaTime * speed[i])
            pos[i].add(posAdd)

            const ESTELA = 20;
            for (let j = 0; j < ESTELA; j++) {
                p.fill(255, 255, 255, 255 - (255 / ESTELA) * j - (ESTELA - j) * 8)

                let estela_pos = pos[i].copy()
                estela_pos.sub(posAdd.x * j * 0.5, posAdd.y * j * 0.5)
                p.circle(estela_pos.x, estela_pos.y, radius)
            }


            if (pos[i].x > p.width) {
                if (PINGPONG) {
                    pos[i] = p.createVector(p.width / 2, p.height / 2)
                    dirs[i] = p.createVector(p.random(-1, 1), p.random(-0.1, 0.1)).normalize()
                    p1.puntos += 1;
                } else {
                    dirs[i].reflect(RIGHT_NORMAL)
                    pos[i].x = p.width - 1
                }
            }

            if (pos[i].x < 0) {
                if (PINGPONG) {
                    pos[i] = p.createVector(p.width / 2, p.height / 2)
                    dirs[i] = p.createVector(p.random(-1, 1), p.random(-0.1, 0.1)).normalize()
                    p2.puntos += 2;
                } else {
                    dirs[i].reflect(LEFT_NORMAL)
                    pos[i].x = 1
                }
            }

            if (pos[i].y > p.height) {
                dirs[i].reflect(FLOOR_NORMAL)
                pos[i].y = p.height - 1
            }

            if (pos[i].y < 0) {
                dirs[i].reflect(CEIL_NORMAL)
                pos[i].y = 1
            }

        }

        if (PINGPONG) {
            p.textSize(30)
            p.fill(255)
            p.text(p1.puntos, 20, 50)

            p.textSize(30)
            p.fill(255)
            p.text(p1.puntos, p.width - 20 - 20, 50)
        }

        p.fill(255);
        p.noStroke();
        p.textSize(16);
        p.text(((1 / p.frameRate()) * 1000).toFixed(2) + " ms/f", 10, 20);
    };
};

new p5(sketch);
