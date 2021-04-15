var backgroundColor, labelTextColor;
const createCummulativeFrequencyDiagram = (() => {
    const node = document.getElementById('widget-container')
    const hiddenInputs = ["inequalities-lines"]
    const heightToWidthRatio = 5 / 8

    const updateHiddenInputs = (output) => {
        for (var i = 0; i < hiddenInputs.length; i++) {
            document.getElementById(hiddenInputs[i]).value = output;
        }
    }

    const getThemeColors = (theme) => {
        // Edit these colors to change the colors
        // of specific elements of the pie chart
        const themes = {
            "light": {
                backgroundColor: "#f5f7fa",
                labelTextColor: "#000000"
            },
            "dark": {
                backgroundColor: "#1D2126",
                labelTextColor: "#FFFFFF"
            }
        }

        return themes[theme]
    }

    const defaultTheme = "light"

    const setThemeColors = (theme) => {
        const themeColors = getThemeColors(theme)

        backgroundColor = themeColors.backgroundColor;
        labelTextColor = themeColors.labelTextColor;
    }

    // Define global variables that contain colors used by the widget
    setThemeColors(defaultTheme);

    // Change the theme colors when the document theme is changed
    document.addEventListener("themeset", (event) => {
        setThemeColors(event.detail.newTheme)
    })

    const getHeightOfCanvas = () => {
        const windowHeight = window.innerHeight || document.documentElement.clientHeight ||
            document.body.clientHeight
        const maxHeight = windowHeight * (5.5 / 10)

        let height = node.clientWidth * heightToWidthRatio

        if (height > maxHeight) {
            height = maxHeight
        }

        return height
    }

    let dims = {
        w: node.clientWidth,
        h: getHeightOfCanvas()
    }

    let ineq;
    var creationData = {
        canvasData: canvasData,
        interactive: interactive,
        input_lines: input_lines
    }

    // Define the p5 sketch methods
    const sketch = p => {
        p.setup = () => {
            ineq = new Inequalities(creationData, p, updateHiddenInputs)

            var solidBtn = document.createElement("button");
            solidBtn.innerText = "─ ↑";
            solidBtn.type = "button";
            solidBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
            solidBtn.onclick = () => { ineq.addLine("solid", "larger") };
            node.appendChild(solidBtn)

            var dashedBtn = document.createElement("button");
            dashedBtn.innerText = "┄ ↑";
            dashedBtn.type = "button";
            dashedBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
            dashedBtn.onclick = () => { ineq.addLine("dashed", "larger") };
            node.appendChild(dashedBtn)

            var solidBtn = document.createElement("button");
            solidBtn.innerText = "─ ↓";
            solidBtn.type = "button";
            solidBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
            solidBtn.onclick = () => { ineq.addLine("solid", "smaller") };
            node.appendChild(solidBtn)

            var dashedBtn = document.createElement("button");
            dashedBtn.innerText = "┄ ↓";
            dashedBtn.type = "button";
            dashedBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
            dashedBtn.onclick = () => { ineq.addLine("dashed", "smaller") };
            node.appendChild(dashedBtn)

            var c = p.createCanvas(dims.w, dims.h)
            c.elt.addEventListener("mousedown", () => {
                ineq.click();
            })

            c.elt.addEventListener("mouseup", () => {
                ineq.release();
            })

            c.elt.style["margin-top"] = "10px";
        }

        p.draw = () => {
            p.clear()
            ineq.draw()
        }

        p.windowResized = () => {
            p.resizeCanvas(0, 0)

            dims = {
                w: node.clientWidth,
                h: getHeightOfCanvas()
            }

            p.resizeCanvas(dims.w, dims.h)

            ineq.resize()
        }
    }

    // Create the canvas and run the sketch in the html node.
    new p5(sketch, node)
})()

class Inequalities {
    constructor({
        canvasData,
        interactive,
        input_lines
    }, p, update) {
        this.p = p;
        this.update = update;

        this.canv = new Coordinate_Canvas(canvasData, p, () => {});

        this.hoverPoint = null;
        this.dragPoint = null;

        this.interactive = interactive;

        this.lines = input_lines;
        this.v1 = undefined;
        this.add = false;
        this.line_type;
        this.line_direction;
    }

    draw() {
        var p = this.p;
        this.canv.draw();

        this.hoverPoint = null;

        var s = this.canv.snap(p.mouseX, p.mouseY)
        var mouse = this.canv.getInvPos(s.x, s.y);
        if (this.dragPoint != null) {
            if (this.interactive) {
                if (this.dragPoint == 1) {
                    this.dragLine.x1 = mouse.x;
                    this.dragLine.y1 = mouse.y;
                } else {
                    this.dragLine.x2 = mouse.x;
                    this.dragLine.y2 = mouse.y;
                }
                this.update(this.out());
            }
        }

        p.stroke(labelTextColor);
        p.fill(255, 0, 0, 64);
        p.strokeWeight(2);
        var lin = this.lines;
        if (this.v1) {
            lin = this.lines.concat([{
                x1: this.v1.x,
                y1: this.v1.y,
                x2: mouse.x,
                y2: mouse.y,
                type: this.line_type,
                direction: this.line_direction
            }])
        }

        for (var l of lin) {
            var p1 = this.canv.getPos(l.x1, l.y1);
            var p2 = this.canv.getPos(l.x2, l.y2);

            var dy = p1.y - p2.y;
            var dx = p1.x - p2.x;
            var m = dy / dx;
            var f = (x) => {
                return (m * x + p1.y - p1.x * m);
            }

            p.push();
            p.strokeWeight(10);
            p.stroke(201, 45, 24)
            if (p.dist(p1.x, p1.y, s.x, s.y) < 10 && this.hoverPoint == null && this.interactive) {
                this.hoverLine = l;
                this.hoverPoint = 1;
                p.strokeWeight(15);
            }
            p.point(p1.x, p1.y);
            p.pop();

            p.push();
            p.strokeWeight(10);
            p.stroke(201, 45, 24)
            if (p.dist(p2.x, p2.y, s.x, s.y) < 10 && this.hoverPoint == null && this.interactive) {
                this.hoverLine = l;
                this.hoverPoint = 2;
                p.strokeWeight(15);
            }
            p.point(p2.x, p2.y);
            p.pop();

            if (l.type == "dashed") {
                const ctx = p.drawingContext;
                ctx.setLineDash([10, 10]);

                if (dx == 0) {
                    p.line(p1.x, 0, p1.x, p.height);
                } else {
                    p.line(0, f(0), p.width, f(p.width))
                }

                ctx.setLineDash([10, 0]);
            } else {
                if (dx == 0) {
                    p.line(p1.x, 0, p1.x, p.height);
                } else {
                    p.line(0, f(0), p.width, f(p.width))
                }
            }

            p.push();
            p.noStroke();
            if (l.direction != undefined) {
                p.beginShape();
                if (dx == 0) {
                    if (l.direction == "larger") {
                        p.vertex(p1.x, 0)
                        p.vertex(p1.x, p.height)
                    } else {
                        p.vertex(p1.x, 0)
                        p.vertex(p1.x, p.height)
                    }
                } else {
                    p.vertex(0, f(0))
                    p.vertex(p.width, f(p.width))
                }


                if (l.direction == "larger") {
                    p.vertex(p.width, p.height);
                    p.vertex(p.width, 0);
                    p.vertex(0, 0);
                    p.vertex(0, p.height);
                    if (dx == 0) p.vertex(0, 0);
                } else {
                    if (dx == 0) p.vertex(p.width, p.height);
                    p.vertex(p.width, 0);
                    p.vertex(p.width, p.height);
                    p.vertex(0, p.height);
                    p.vertex(0, 0);
                }
                p.endShape();
            }
            p.pop();
        }
    }

    click() {
        var s = this.canv.snap(this.p.mouseX, this.p.mouseY)
        var m = this.canv.getInvPos(s.x, s.y);

        if (this.add) {
            if (!this.v1) {
                this.v1 = {
                    x: m.x,
                    y: m.y
                }
            } else {
                this.lines.push({
                    x1: this.v1.x,
                    y1: this.v1.y,
                    x2: m.x,
                    y2: m.y,
                    type: this.line_type,
                    direction: this.line_direction
                })

                this.add = false;
                this.v1 = undefined;
                this.update(this.out());
            }
        } else {
            this.dragLine = this.hoverLine;
            this.dragPoint = this.hoverPoint;
        }
    }

    release() {
        this.dragPoint = null;
    }

    out() {
        return [JSON.stringify(this.lines)];
    }

    addLine(lineType, direction) {
        this.add = true;
        this.line_type = lineType;
        this.line_direction = direction;
    }

    resize() {}
}

class Coordinate_Canvas {
    constructor({
        quadrants,
        x_axis = {
            start,
            end,
            increment,
            show,
            label
        },
        y_axis = {
            start,
            end,
            increment,
            show,
            label
        },
        showGrid,
        snapToGrid,
        axisNumbering
    }, p, update) {
        this.p = p;
        this.update = update;

        this.x_axis = x_axis;
        this.y_axis = y_axis;
        this.quadrants = quadrants;
        this.showGrid = showGrid;
        this.snapToGrid = snapToGrid;
        this.axisNumbering = axisNumbering;

        /*
        for (var val = 0; val < this.values.length; val++) {
            const regex = /\\frac\{(.*)\}\{(.*)\}/;
            var mach = values[val].match(regex);
            if (mach != null) {
                this.values[val] = {
                    type: "fraction",
                    numerator: mach[1],
                    denominator: mach[2]
                }
            }
        }*/
    }

    draw() {
        var p = this.p;

        p.background(backgroundColor)
        p.stroke(labelTextColor);
        p.strokeWeight(2);

        var x_axis_pos;
        var y_axis_pos;
        if (this.quadrants == "full") {
            x_axis_pos = 0;
            y_axis_pos = 0;
        } else if (this.quadrants == 1) {
            x_axis_pos = this.x_axis.start;
            y_axis_pos = this.y_axis.start;
        } else if (this.quadrants == 2) {
            x_axis_pos = this.x_axis.end;
            y_axis_pos = this.y_axis.start;
        } else if (this.quadrants == 3) {
            x_axis_pos = this.x_axis.end;
            y_axis_pos = this.y_axis.end;
        } else if (this.quadrants == 4) {
            x_axis_pos = this.x_axis.start;
            y_axis_pos = this.y_axis.end;
        } else if (this.quadrants == "line") {
            this.x_axis.show = true;

            this.y_axis.show = false;
            this.showGrid = false;

            x_axis_pos = 0;
            y_axis_pos = (this.y_axis.start + this.y_axis.end) / 2;
        }
        this.x_axis_pos = x_axis_pos;
        this.y_axis_pos = y_axis_pos;

        var ya = p.map(y_axis_pos, this.y_axis.start, this.y_axis.end, p.height, 0);
        var xa = p.map(x_axis_pos, this.x_axis.start, this.x_axis.end, 0, p.width);

        // X axis
        if (this.x_axis.show) {
            if (this.quadrants == "line") {
                p.line(0, p.height / 2, p.width, p.height / 2);

                p.push();
                p.fill(labelTextColor);
                p.noStroke();
                p.textAlign(p.BOTTOM, p.LEFT);
                p.text(this.x_axis.label, p.width - p.textWidth(this.x_axis.label) - 5, p.height / 2 - 12)
                p.pop();
            } else {
                p.line(0, ya, p.width, ya);

                p.push();
                p.fill(labelTextColor);
                p.noStroke();
                p.textAlign(p.TOP, p.LEFT);
                p.text(this.x_axis.label, p.width - p.textWidth(this.x_axis.label) - 3, ya - 12)
                p.pop();
            }
        }

        // Y axis
        if (this.y_axis.show) {
            p.line(xa, 0, xa, p.height);

            p.push();
            p.fill(labelTextColor);
            p.noStroke();
            p.textAlign(p.BOTTOM, p.LEFT);
            p.text(this.y_axis.label, xa + 5, 12)
            p.pop();
        }

        p.stroke(labelTextColor + "30");
        p.strokeWeight(1);
        //X lines
        for (var i = this.x_axis.increment * p.floor(this.x_axis.start / this.x_axis.increment); i <= this.x_axis.end; i += this.x_axis.increment) {
            var x = p.map(i, this.x_axis.start, this.x_axis.end, 0, p.width);

            if (this.showGrid) {
                p.line(x, 0, x, p.height);
            }

            if (this.axisNumbering) {
                if (this.x_axis.show) {
                    var rounding = this.x_axis.increment.toString().split(".")[1];
                    if (!rounding) rounding = 0;
                    else rounding = rounding.length;

                    p.push();
                    p.noStroke();
                    var rounded = Math.round(i * 10 ** rounding) / 10 ** rounding
                    if (rounded != x_axis_pos) {
                        var b = { x: x - p.textWidth(rounded) / 2, y: ya + 15 - 12, w: p.textWidth(rounded), h: 13 }
                        p.fill(backgroundColor);
                        p.rect(b.x, b.y, b.w, b.h);

                        p.fill(labelTextColor);
                        p.text(rounded, x - p.textWidth(rounded) / 2, ya + 15);
                    } else {
                        p.fill(labelTextColor);
                        p.text(rounded, x + 3, ya + 15);
                    }
                    p.pop();
                }
            }

            if (this.x_axis.show) {
                p.push();
                p.stroke(labelTextColor)
                p.line(x, ya - 2, x, ya + 2);
                p.pop();
            }
        }

        //Y lines
        for (var i = this.y_axis.increment * p.floor(this.y_axis.start / this.y_axis.increment); i <= this.y_axis.end; i += this.y_axis.increment) {
            var y = p.map(i, this.y_axis.start, this.y_axis.end, p.height, 0);

            if (this.showGrid) {
                p.line(0, y, p.width, y);
            }

            if (this.axisNumbering) {
                if (this.y_axis.show) {
                    var rounding = this.y_axis.increment.toString().split(".")[1];
                    if (!rounding) rounding = 0;
                    else rounding = rounding.length;

                    p.push();
                    p.fill(labelTextColor);
                    p.noStroke();
                    var rounded = Math.round((i) * 10 ** rounding) / 10 ** rounding
                    if (rounded != y_axis_pos) {
                        var b = { x: xa - p.textWidth(rounded) - 6, y: y + 4 - 12, w: p.textWidth(rounded) + 2, h: 13 }
                        p.fill(backgroundColor);
                        p.rect(b.x, b.y, b.w, b.h);

                        p.fill(labelTextColor);
                        p.text(rounded, xa - p.textWidth(rounded) - 5, y + 4);
                    } else {
                        p.text(rounded, xa - p.textWidth(rounded) - 5, y - 4);
                    }
                    p.pop();
                }
            }

            if (this.y_axis.show) {
                p.push();
                p.stroke(labelTextColor);
                p.line(xa - 2, y, xa + 2, y);
                p.pop();
            }
        }

        var snap = this.snap(p.mouseX, p.mouseY);
        p.strokeWeight(5);
        p.stroke(0)
        p.point(snap.x, snap.y)
    }

    snap(x, y) {
        var p = this.p;
        if (!this.snapToGrid) {
            return { x: x, y: y };
        } else {
            if (this.quadrants == "line") {
                var xa = p.map(this.x_axis_pos, this.x_axis.start, this.x_axis.end, 0, p.width);
                var xInc = p.map(this.x_axis.increment + this.x_axis.start, this.x_axis.start, this.x_axis.end, 0, p.width);
                var x_s = Math.round((x - xa) / xInc) * xInc + xa;

                var y_axis_pos = (this.y_axis.start + this.y_axis.end) / 2;
                var y_s = p.map(y_axis_pos, this.y_axis.start, this.y_axis.end, p.height, 0);

                return { x: x_s, y: y_s };
            } else {
                var xa = p.map(0, this.x_axis.start, this.x_axis.end, 0, p.width);
                var ya = p.map(0, this.y_axis.start, this.y_axis.end, p.height, 0);

                var xInc = p.map(this.x_axis.increment + this.x_axis.start, this.x_axis.start, this.x_axis.end, 0, p.width);
                var yInc = p.map(this.y_axis.increment + this.y_axis.start, this.y_axis.start, this.y_axis.end, 0, p.height);

                var x_s = p.round((x - xa) / xInc) * xInc + xa;
                var y_s = p.round((y - ya) / yInc) * yInc + ya;

                return { x: x_s, y: y_s };
            }
        }
    }

    getPos(x, y) {
        var y_m = this.p.map(y, this.y_axis.start, this.y_axis.end, this.p.height, 0);
        var x_m = this.p.map(x, this.x_axis.start, this.x_axis.end, 0, this.p.width);

        return ({ x: x_m, y: y_m });
    }

    getInvPos(x, y) {
        var y_m = this.p.map(y, this.p.height, 0, this.y_axis.start, this.y_axis.end);
        var x_m = this.p.map(x, 0, this.p.width, this.x_axis.start, this.x_axis.end);

        return ({ x: x_m, y: y_m });
    }

    click() {}

    resize() {}
}