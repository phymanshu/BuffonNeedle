// Neon Buffon's Needle in p5.js
// Works in browser, ~150 lines

let spacing = 48;     // distance between lines
let needleLen = 48;   // needle length
let needles = [];
let totalThrows = 0;
let totalCrosses = 0;
let autoMode = false;

function setup() {
  createCanvas(960, 640);
  strokeWeight(2);
  frameRate(60);
  textFont('Arial');
}

function draw() {
  background(5,2,10);
  drawLines();
  
  // update and draw needles
  for (let n of needles) {
    n.update();
    n.show();
  }
  
  drawStats();
  
  if (autoMode && frameCount % 15 === 0) dropNeedle();
}

// Draw horizontal neon lines
function drawLines() {
  for (let y = spacing/2; y < height; y += spacing) {
    stroke(126,252,255,150);
    line(0, y, width, y);
  }
}

// Needle class
class Needle {
  constructor(x, y, angle) {
    this.x = x;
    this.y = -needleLen; // start above canvas
    this.targetY = y;
    this.angle = angle;
    this.settled = false;
  }
  
  update() {
    if (!this.settled) {
      this.y += 6; // fall speed
      this.angle += 0.02 * (random() > 0.5 ? 1 : -1); // rotate while falling
      if (this.y >= this.targetY) {
        this.y = this.targetY;
        this.settled = true;
        this.checkCross();
      }
    }
  }
  
  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    stroke(126,252,255);
    line(-needleLen/2,0,needleLen/2,0);
    pop();
  }
  
  checkCross() {
    let y1 = this.y - sin(this.angle)*needleLen/2;
    let y2 = this.y + sin(this.angle)*needleLen/2;
    if (floor(y1/spacing) != floor(y2/spacing)) totalCrosses++;
    totalThrows++;
  }
}

// Drop a needle at random position
function dropNeedle() {
  let x = random(60, width-60);
  let y = random(spacing/2+10, height-spacing/2-10);
  let angle = random(0, PI);
  needles.push(new Needle(x, y, angle));
}

// Draw stats and pi estimate
function drawStats() {
  fill(255);
  noStroke();
  textSize(16);
  text("Throws: " + totalThrows, 20, 30);
  text("Crosses: " + totalCrosses, 20, 50);
  let piEst = totalCrosses>0 ? (2*needleLen*totalThrows)/(totalCrosses*spacing) : '—';
  text("π ≈ " + piEst, 20, 70);
}

// Key presses for controls
function keyPressed() {
  if (key === ' ') dropNeedle();           // space = drop
  if (key === 'A' || key === 'a') autoMode = !autoMode;  // A = toggle auto
  if (key === 'R' || key === 'r') {       // R = reset
    needles = [];
    totalThrows = 0;
    totalCrosses = 0;
  }
}

// Optional: click to drop
function mousePressed() { dropNeedle(); }

