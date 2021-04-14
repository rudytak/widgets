class Canvas {
  constructor() {
    this.background = true;
    this.xaxis = {
      /* start and end determine the width of the x-axis*/
      start: -1,
      end: 1,

      increment: 1, //step length throughout the width

      show: true, //show on screen
      name: "x axis", //label
    };
    this.yaxis = {
      /* start and end determine the length of the x-axis*/
      start: -4,
      end: 4,

      increment: 1, //step length throughout the width

      show: true, //show on screen
      name: "y axis", //label
    };
    this.snapping = [];
    this.quadrant = "full";
    this.snap = "1dp";
  }
  show() {
    if (this.background) {
      stroke(150);
      strokeWeight(1);
      if (this.quadrant == "full") {
        let xrange = width - 40; //range of x
        let x = 40; //starting x
        let yrange = height - 40; //range of y
        let y = 40; //starting y
        /*determining how many lines to print in the gridlines vertically and horizontally*/
        let xinc =
          (abs(this.xaxis.start) + abs(this.xaxis.end)) / this.xaxis.increment;
        xinc = (width - 80) / xinc;
        let yinc =
          (abs(this.yaxis.start) + abs(this.yaxis.end)) / this.yaxis.increment;
        yinc = (height - 80) / yinc;
        if (xinc) {
          for (let i = x; i <= xrange; i += xinc) {
            line(i, y, i, yrange);
          }
        }
        if (yinc) {
          for (let i = y; i <= yrange; i += yinc) {
            line(x, i, xrange, i);
          }
        }
      } else if (this.quadrant == "partial") {
        let xrange = width - 40; //range of x
        let x = 40;
        let yrange = 40;
        let y = height - 40;
        /*determining how many lines to print in the quadrant vertically and horizontally*/
        let xinc = abs(this.xaxis.end) / this.xaxis.increment;
        xinc = (width - 80) / xinc;
        let yinc = abs(this.yaxis.end) / this.yaxis.increment;
        yinc = (height - 80) / yinc;
        if (xinc) {
          for (let i = x; i <= xrange; i += xinc) {
            line(i, y, i, yrange);
          }
        }
        if (yinc) {
          for (let i = y; i >= yrange; i -= yinc) {
            line(x, i, xrange, i);
          }
        }
      } else if (this.quadrant == "line") {
        let xrange = width - 40; //range of x
        let x = 40;
        /*determining how many lines to print in the quadrant vertically and horizontally*/
        let xinc =
          (abs(this.xaxis.end) + abs(this.xaxis.end)) / this.xaxis.increment;
        xinc = (width - 80) / xinc;
        for (let i = x; i <= xrange; i += xinc) {
          line(i, 40, i, height - 40);
        }
      }
    }
    if (this.quadrant == "full") {
      if (this.xaxis.show) {
        stroke(0);
        strokeWeight(2);
        line(20, height / 2, width - 20, height / 2);
        line(20, height / 2, 25, height / 2 - 5);
        line(20, height / 2, 25, height / 2 + 5);
        line(width - 20, height / 2, width - 25, height / 2 - 5);
        line(width - 20, height / 2, width - 25, height / 2 + 5);
        fill(0);
        noStroke();
        textSize(12);
        text(this.xaxis.name, width - 35, height / 2 + 20);
      }
      if (this.yaxis.show) {
        stroke(0);
        strokeWeight(2);
        line(width / 2, 20, width / 2, height - 20);
        line(width / 2, 20, width / 2 - 5, 25);
        line(width / 2, 20, width / 2 + 5, 25);
        line(width / 2, height - 20, width / 2 - 5, height - 25);
        line(width / 2, height - 20, width / 2 + 5, height - 25);
        fill(0);
        noStroke();
        textSize(12);
        text(this.yaxis.name, width / 2 - 10, 15);
      }
    } else if (this.quadrant == "partial") {
      if (this.xaxis.show) {
        stroke(0);
        strokeWeight(2);
        line(10, height - 40, width - 20, height - 40);
        line(10, height - 40, 15, height - 45);
        line(10, height - 40, 15, height - 35);
        line(width - 20, height - 40, width - 25, height - 45);
        line(width - 20, height - 40, width - 25, height - 35);
        fill(0);
        noStroke();
        textSize(14);
        text(this.xaxis.name, width - 40, height - 20);
      }
      if (this.yaxis.show) {
        stroke(0);
        strokeWeight(2);
        line(40, 20, 40, height - 10);
        line(40, 20, 35, 25);
        line(40, 20, 45, 25);
        line(40, height - 10, 40 - 5, height - 15);
        line(40, height - 10, 40 + 5, height - 15);
        fill(0);
        noStroke();
        textSize(14);
        text(this.yaxis.name, 10, 15);
      }
    } else if (this.quadrant == "line") {
      if (this.xaxis.show) {
        stroke(0);
        strokeWeight(2);
        line(20, height / 2, width - 20, height / 2);
        line(20, height / 2, 25, height / 2 - 5);
        line(20, height / 2, 25, height / 2 + 5);
        line(width - 20, height / 2, width - 25, height / 2 - 5);
        line(width - 20, height / 2, width - 25, height / 2 + 5);
        fill(0);
        noStroke();
        textSize(12);
        text(this.xaxis.name, width - 35, height / 2 + 20);
      }
    }
  }
  snappingPoints() {
    if (this.snap == "null") {
      return;
    }
    if (this.quadrant == "full") {
      if (this.snap == "integer") {
        let xrange = width - 40; //range of x
        let x = 40; //starting x
        let yrange = height - 40; //range of y
        let y = 40; //starting y
        /*determining how many lines to print in the gridlines vertically and horizontally*/
        let xinc =
          (abs(this.xaxis.start) + abs(this.xaxis.end)) / this.xaxis.increment;
        xinc = (width - 80) / xinc;
        let yinc =
          (abs(this.yaxis.start) + abs(this.yaxis.end)) / this.yaxis.increment;
        yinc = (height - 80) / yinc;
        for (let i = x, k = 0; i <= xrange; i += xinc) {
          for (let j = y; j <= yrange; j += yinc) {
            this.snapping[k] = {
              x: i,
              y: j,
            };
            k++;
          }
        }
      } else if (this.snap == "1dp") {
        let xrange = width - 40; //range of x
        let x = 40; //starting x
        let yrange = height - 40; //range of y
        let y = 40; //starting y
        /*determining how many lines to print in the gridlines vertically and horizontally*/
        let xinc =
          (abs(this.xaxis.start) + abs(this.xaxis.end)) / this.xaxis.increment;
        xinc = (width - 80) / xinc;
        let yinc =
          (abs(this.yaxis.start) + abs(this.yaxis.end)) / this.yaxis.increment;
        yinc = (height - 80) / yinc;
        for (let i = x, k = 0; i <= xrange; i += xinc) {
          for (let j = y; j <= yrange; j += yinc / 10) {
            if (i < xrange) {
              for (let p = 0; p < 10; p++) {
                this.snapping[k] = {
                  x: i + 0.1 * p * xinc,
                  y: j,
                };
                k++;
              }
            } else {
              this.snapping[k] = {
                x: i,
                y: j,
              };
              k++;
            }
          }
        }
      }
    } else if (this.quadrant == "partial") {
      if (this.snap == "integer") {
        let xrange = width - 40; //range of x
        let x = 40; //starting x
        let yrange = height - 40; //range of y
        let y = 40; //starting y
        /*determining how many lines to print in the gridlines vertically and horizontally*/
        let xinc = abs(this.xaxis.end) / this.xaxis.increment;
        xinc = (width - 80) / xinc;
        let yinc = abs(this.yaxis.end) / this.yaxis.increment;
        yinc = (height - 80) / yinc;
        for (let i = x, k = 0; i <= xrange; i += xinc) {
          for (let j = y; j <= yrange; j += yinc) {
            this.snapping[k] = {
              x: i,
              y: j,
            };
            k++;
          }
        }
      } else if (this.snap == "1dp") {
        let xrange = width - 40; //range of x
        let x = 40; //starting x
        let yrange = height - 40; //range of y
        let y = 40; //starting y
        /*determining how many lines to print in the gridlines vertically and horizontally*/
        let xinc = abs(this.xaxis.end) / this.xaxis.increment;
        xinc = (width - 80) / xinc;
        let yinc = abs(this.yaxis.end) / this.yaxis.increment;
        yinc = (height - 80) / yinc;
        for (let i = x, k = 0; i <= xrange; i += xinc) {
          for (let j = y; j <= yrange; j += yinc / 10) {
            if (i < xrange) {
              for (let p = 0; p < 10; p++) {
                this.snapping[k] = {
                  x: i + 0.1 * p * xinc,
                  y: j,
                };
                k++;
              }
            } else {
              this.snapping[k] = {
                x: i,
                y: j,
              };
              k++;
            }
          }
        }
      }
    } else if (this.quadrant == "line") {
      if (this.snap == "integer") {
        let xrange = width - 40; //range of x
        let x = 40; //starting x
        let yrange = height - 40; //range of y
        let y = 40; //starting y
        /*determining how many lines to print in the gridlines vertically and horizontally*/
        let xinc =
          (abs(this.xaxis.start) + abs(this.xaxis.end)) / this.xaxis.increment;
        xinc = (width - 80) / xinc;
        for (let i = x, k = 0; i <= xrange; i += xinc) {
          for (let j = y; j <= yrange; j += 1) {
            this.snapping[k] = {
              x: i,
              y: j,
            };
            k++;
          }
        }
      } else if (this.snap == "1dp") {
        let xrange = width - 40; //range of x
        let x = 40; //starting x
        let yrange = height - 40; //range of y
        let y = 40; //starting y
        /*determining how many lines to print in the gridlines vertically and horizontally*/
        let xinc =
          (abs(this.xaxis.start) + abs(this.xaxis.end)) / this.xaxis.increment;
        xinc = (width - 80) / xinc;

        for (let i = x, k = 0; i <= xrange; i += xinc) {
          for (let j = y; j <= yrange; j += 1) {
            if (i < xrange) {
              for (let p = 0; p < 10; p++) {
                this.snapping[k] = {
                  x: i + 0.1 * p * xinc,
                  y: j,
                };
                k++;
              }
            } else {
              this.snapping[k] = {
                x: i,
                y: j,
              };
              k++;
            }
          }
        }
      }
    }
  }
  snapper() {
    if (this.snap == "null") {
      return;
    }
    if (this.snap == "integer") {
      let len = this.snapping.length;
      for (let i = 0; i < len; i++) {
        if (
          abs(this.snapping[i].x - mouseX) < 4 &&
          abs(this.snapping[i].y - mouseY) < 4
        ) {
          fill(255, 0, 200);
          ellipse(this.snapping[i].x, this.snapping[i].y, 5, 5);
          let x, y;
          if (this.quadrant == "full") {
            x = this.snapping[i].x - width / 2;
            x /= (width - 80) / (abs(this.xaxis.start) + abs(this.xaxis.end));
            y = this.snapping[i].y - height / 2;
            y /= (height - 80) / (abs(this.yaxis.start) + abs(this.yaxis.end));
            y = -y;
          } else if (this.quadrant == "partial") {
            x = this.snapping[i].x - 40;
            x /= (width - 80) / abs(this.xaxis.end);
            y = this.snapping[i].y - 40;
            y /= (height - 80) / abs(this.yaxis.end);
            y = abs(y);
          } else if (this.quadrant == "line") {
            x = this.snapping[i].x - width / 2;
            x /= (width - 80) / (abs(this.xaxis.start) + abs(this.xaxis.end));
          }
          fill(0);
          textSize(16);
          if (this.quadrant == "line") {
            text("x = " + x, width - 150, 15);
          } else {
            text("(x,y) = (" + x + ", " + y + ")", width - 150, 15);
          }
        }
      }
    } else if (this.snap == "1dp") {
      let len = this.snapping.length;
      for (let i = 0; i < len; i++) {
        if (
          abs(this.snapping[i].x - mouseX) < 4 &&
          abs(this.snapping[i].y - mouseY) < 4
        ) {
          fill(255, 0, 200);
          ellipse(this.snapping[i].x, this.snapping[i].y, 5, 5);
          let x, y;
          if (this.quadrant == "full") {
            x = ceil(this.snapping[i].x - width / 2);
            x /= (width - 80) / (abs(this.xaxis.start) + abs(this.xaxis.end));
            x = x.toFixed(1);
            y = ceil(this.snapping[i].y - height / 2);
            y /= (height - 80) / (abs(this.yaxis.start) + abs(this.yaxis.end));
            y = y.toFixed(1);
            y = -y;
          } else if (this.quadrant == "partial") {
            x = ceil(this.snapping[i].x - 40);
            x /= (width - 80) / abs(this.xaxis.end);
            x = x.toFixed(1);
            y = ceil(this.snapping[i].y - (height - 40));
            y /= (height - 80) / abs(this.yaxis.end);
            y = y.toFixed(1);
            y = -y;
          } else if (this.quadrant == "line") {
            x = ceil(this.snapping[i].x - width / 2);
            x /= (width - 80) / (abs(this.xaxis.start) + abs(this.xaxis.end));
            x = x.toFixed(1);
          }
          fill(0);
          textSize(16);
          if (this.quadrant == "line") {
            text("x = " + x, width - 150, 15);
          } else {
            text("(x,y) = (" + x + ", " + y + ")", width - 150, 15);
          }
        }
      }
    }
  }
}
