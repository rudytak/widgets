let cnv;
let inputCards = [];
let placeholders = [];
let output = [];
let out = false;
let resetButton;
let submitButton;
let _canvas;
let mobile = false;
function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  _canvas.position(x, y);
  _canvas.style("touch-action", " none");
  _canvas.style("display", "block");
  resetEverything();
}
function windowResized() {
  if (windowWidth > 576) {
    _canvas = createCanvas(floor(windowWidth * 0.8), floor(windowHeight));
    mobile = false;
  } else {
    mobile = true;
    _canvas = createCanvas(floor(windowWidth), floor(windowWidth));
  }
  centerCanvas();
  cardsWidgetCreator(inputArr);
  cnv.snappingPoints(); //calculates snapping points
}
function backCanvas() {
  if (windowWidth > 576) {
    _canvas = createCanvas(floor(windowWidth * 0.8), floor(windowHeight));
  } else {
    _canvas = createCanvas(floor(windowWidth), floor(windowWidth));
  }
  centerCanvas();
}

function setup() {
  textAlign(CENTER);
  frameRate(60);
  backCanvas();
  cnv = canvasCreator(
    false, //Background: grid, none (true or false)
    0, //x axis starting position
    0, //x axis ending position
    0, //x axis increment value
    false, //x axis display (true or false)
    "none", //x axis name label
    0, //y axis starting position
    0, //y axis ending position
    0, //y axis increment value
    false, //y axis display (true or false)
    "none", //y axis name label
    "none", //quadrant (full, partial, line)
    "none" //snapping value (none, integer, 1dp)
  );

  rectMode(CENTER);
  cardsWidgetCreator(inputArr);
}

function draw() {
  cursor(ARROW);

  background(240);
  textSize(16);
  fill(0);
  text("Smallest", placeholders[0].x, placeholders[0].y + width * 0.12);
  text("Greatest", placeholders[4].x, placeholders[4].y + width * 0.12);
  for (let i = 0; i < 5; i++) {
    placeholders[i].show();
  }
  for (let i = 0; i < 5; i++) {
    inputCards[i].show();
    inputCards[i].clicked();
  }
  if (allPlaced()) {
    submitButton.clr = color(255, 50, 255, 90);
  }
  if (out && allPlaced()) {
    textSize(width * 0.05);
    fill(0);
    let x = "";
    for (let i = 0; i < 5; i++) {
      if (placeholders[i].val != undefined) {
        output[i] = placeholders[i].val;
        x += placeholders[i].val + " ";
      }
    }
    text("output: " + x, width / 2, height * 0.1);
  } else {
    out = false;
  }
  submitButton.show();
  submitButton.clicked(submit);
  resetButton.show();
  resetButton.clicked(resetEverything);
}
function submit() {
  out = true;
}
function allPlaced() {
  for (let i = 0; i < 5; i++) {
    if (inputCards[i].placed == false) {
      return false;
    }
  }
  return true;
}
class Button {
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.clr = color(255, 50, 255, 90);
  }
  show() {
    fill(this.clr);
    rect(this.x, this.y, width * 0.2, height * 0.07, 20);
    fill(0);
    textSize(height * 0.03);
    text(this.name, this.x, this.y + 5);
  }
  clicked(func) {
    if (mouseIsPressed) {
      if (
        abs(mouseX - this.x) < width * 0.1 &&
        abs(mouseY - this.y) < height * 0.035
      ) {
        fill(20, 20, 20, 50);
        rect(this.x, this.y, width * 0.2, height * 0.07, 20);

        func();
      }
    }
  }
}
class Card {
  constructor(x, y, val) {
    this.x = x;
    this.y = y;
    this.org = [];
    this.org[0] = x;
    this.org[1] = y;
    this.val = val;
    this.clr = 255;
    this.placed = false;
    this.click = false;
  }
  show() {
    let findDiv;
    let findExp;
    if (this.val != undefined) {
      findDiv = this.val.indexOf("/");
    }
    if (this.val != undefined) {
      findExp = this.val.indexOf("^");
    }
    fill(this.clr);
    rect(this.x, this.y, width * 0.1, width * 0.15, 10);
    fill(0);
    textSize(width * 0.05);
    textAlign(CENTER);
    if (findDiv == -1 && findExp == -1) {
      text(this.val, this.x, this.y + width * 0.01);
    } else {
      if (this.val != undefined && findDiv != -1) {
        text(this.val.substring(0, findDiv), this.x, this.y - width * 0.01);
        push();
        strokeWeight(2);
        line(this.x - width * 0.02, this.y, this.x + width * 0.02, this.y);
        pop();
        text(
          this.val.substring(findDiv + 1, this.val.length),
          this.x,
          this.y + width * 0.045
        );
      } else if (this.val != undefined && findExp != -1) {
        textSize(width * 0.03);

        text(
          this.val.substring(0, findExp),
          this.x - width * 0.005,
          this.y + width * 0.01
        );
        textSize(width * 0.02);
        text(
          this.val.substring(findExp + 1, this.val.length),
          this.x + width * 0.03,
          this.y - width * 0.015
        );
      }
    }
  }
  changeColor(clr) {
    this.clr = clr;
  }
  clicked() {
    if (this.placed) {
      this.click = false;
      return;
    }
    if (
      (abs(mouseX - this.x) < width * 0.05 &&
        abs(mouseY - this.y) < width * 0.075) ||
      this.click
    ) {
      cursor(HAND);
      if (mouseIsPressed) {
        for (let i = 0; i < 5; i++) {
          if (inputCards[i].click && inputCards[i] != this) {
            return;
          }
        }
        this.click = true;
        this.x = mouseX;
        this.y = mouseY;
      }
    } else {
      this.x = this.org[0];
      this.y = this.org[1];
    }
  }
  place(card) {
    if (
      abs(card.x - this.x) < width * 0.05 &&
      abs(card.y - this.y) < width * 0.075
    ) {
      if (this.val == undefined) {
        return true;
      }
    }
    return false;
  }
}
function mouseReleased() {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (placeholders[j].place(inputCards[i])) {
        inputCards[i].x = placeholders[j].x;
        inputCards[i].y = placeholders[j].y;
        placeholders[j].val = inputCards[i].val;
        inputCards[i].placed = true;
      }
    }
    inputCards[i].click = false;
    if (!inputCards[i].placed) {
      inputCards[i].x = inputCards[i].org[0];
      inputCards[i].y = inputCards[i].org[1];
    }
  }
}
function resetEverything() {
  cardsWidgetCreator(inputArr);
  out = false;
  redraw();
}
