import p5 from "p5";

function show_mspf(p: p5) {
  p.fill(255);
  p.noStroke();
  p.textSize(16);
  p.text(((1 / p.frameRate()) * 1000).toFixed(2) + " ms/f", 10, 20);
}
