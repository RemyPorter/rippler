const ROWS = 90/2;
const COLS = 160/2;
const HUE_SPEED = 0.04;
const ROT_SIZE = 20;
const SPEED = 0.8;

let font;
function preload() {
  font = loadFont("neuropol x rg.ttf");
}

function smoothstep(edge0, edge1, x) {
  let t = constrain((x-edge0)/(edge1-edge0), 0, 1);
  return t * t * (3.0 - 2.0 * t);
}

function displayTitle(started, duration, fadeOut) {
  push();
  colorMode(RGB, 1.0);
  let alpha = 1;
  if (millis() > started+duration+fadeOut) {
    return;
  } else if (millis() > started+duration) {
    let t = smoothstep(started+duration, started+duration+fadeOut, millis());
    alpha = (1.0 - t);
  }
  textFont(font);
  textAlign(CENTER, CENTER);
  textSize(height/10);
  stroke(0);
  fill(1, 1, 1, alpha);
  text("Your mouse is\na center of calm", width/2, height/2);
  pop();
}

function mouseClicked() {
  let fs = fullscreen();
  fullscreen(!fs);
  windowResized();
}

function seedPoint(row, col, numRows, numCols) {
  let offset = (row%2==0)?0.5:0;
  let y = (row/numRows)*(height+ROT_SIZE);
  let xstep = 1.0/numCols*(width+ROT_SIZE);;
  let x = col*xstep + offset*xstep;
  return createVector(x, y);
}

let points;

function buildPoints() {
  let res = {};
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      res[`${x}_${y}`] = seedPoint(y, x, ROWS, COLS);
    }
  }
  return res;
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  points = buildPoints();
  console.log(points);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function rot(dc) {
  let dd = width/dist(mouseX, mouseY, width/2, height/2);
  return smoothstep(0, width, dd) * ROT_SIZE + ROT_SIZE;
}

function drawPoint(p) {
  push();
  let dc = smoothstep(0, 1, dist(p.x, p.y, mouseX, mouseY)/width*1.2);
  fill(abs(cos(dc*PI+frameCount*HUE_SPEED)), 1, 0.6+sin(2*dc*PI+frameCount*HUE_SPEED*2)*0.5);
  let rs = rot(dc);
  translate(p.x+sin(frameCount*dc*SPEED)*rs, p.y+cos(frameCount*dc*SPEED)*rs);
  ellipse(0, 0, 5, 5);
  pop();
}

let started = -1;
function draw() {
  background(0);
  if (started < 0) started = millis();
  noStroke();
  colorMode(HSL, 1.0);
  Object.values(points).forEach(drawPoint);
  displayTitle(started, 2000, 1000);
}
