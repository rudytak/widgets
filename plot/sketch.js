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

    let plt;
    var creationData = {
        canvasData: canvasData,
        interactive: interactive,
        input_lines: input_lines,
        input_points: input_points
    }

    // Define the p5 sketch methods
    const sketch = p => {
        p.setup = () => {
            plt = new Plot(creationData, p, updateHiddenInputs)

            var pointBtn = document.createElement("button");
            pointBtn.innerText = "●";
            pointBtn.type = "button";
            pointBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
            pointBtn.onclick = () => { plt.addPoint() };
            node.appendChild(pointBtn)

            var lineBtn = document.createElement("button");
            lineBtn.innerText = "─";
            lineBtn.type = "button";
            lineBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
            lineBtn.onclick = () => { plt.addLine("solid") };
            node.appendChild(lineBtn)

            var vectorBtn = document.createElement("button");
            vectorBtn.innerText = "→";
            vectorBtn.type = "button";
            vectorBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
            vectorBtn.onclick = () => { plt.addLine("vector") };
            node.appendChild(vectorBtn)

            var linearFunctionBtn = document.createElement("button");
            linearFunctionBtn.innerText = "Linear function";
            linearFunctionBtn.type = "button";
            linearFunctionBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
            linearFunctionBtn.onclick = () => { plt.addFunction(2) };
            node.appendChild(linearFunctionBtn)

            var quadraticFunctionBtn = document.createElement("button");
            quadraticFunctionBtn.innerText = "Quadratic function";
            quadraticFunctionBtn.type = "button";
            quadraticFunctionBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
            quadraticFunctionBtn.onclick = () => { plt.addFunction(3) };
            node.appendChild(quadraticFunctionBtn)

            var cubicFunctionBtn = document.createElement("button");
            cubicFunctionBtn.innerText = "Cubic function";
            cubicFunctionBtn.type = "button";
            cubicFunctionBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
            cubicFunctionBtn.onclick = () => { plt.addFunction(4) };
            node.appendChild(cubicFunctionBtn)

            var sinFunctionBtn = document.createElement("button");
            sinFunctionBtn.innerText = "Sinusodial function";
            sinFunctionBtn.type = "button";
            sinFunctionBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
            sinFunctionBtn.onclick = () => { plt.addSin() };
            node.appendChild(sinFunctionBtn)

            var tanFunctionBtn = document.createElement("button");
            tanFunctionBtn.innerText = "Tangentodial function";
            tanFunctionBtn.type = "button";
            tanFunctionBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
            tanFunctionBtn.onclick = () => { plt.addTan() };
            node.appendChild(tanFunctionBtn)

            var expFunctionBtn = document.createElement("button");
            expFunctionBtn.innerText = "Exponential function";
            expFunctionBtn.type = "button";
            expFunctionBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
            expFunctionBtn.onclick = () => { plt.addExp() };
            node.appendChild(expFunctionBtn)

            var recipFunctionBtn = document.createElement("button");
            recipFunctionBtn.innerText = "Reciprocal function";
            recipFunctionBtn.type = "button";
            recipFunctionBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
            recipFunctionBtn.onclick = () => { plt.addReci() };
            node.appendChild(recipFunctionBtn)

            var c = p.createCanvas(dims.w, dims.h)
            c.elt.addEventListener("mousedown", () => {
                plt.click();
            })

            c.elt.addEventListener("mouseup", () => {
                plt.release();
            })

            c.elt.style["margin-top"] = "10px";
        }

        p.draw = () => {
            p.clear()
            plt.draw()
        }

        p.windowResized = () => {
            p.resizeCanvas(0, 0)

            dims = {
                w: node.clientWidth,
                h: getHeightOfCanvas()
            }

            p.resizeCanvas(dims.w, dims.h)

            plt.resize()
        }
    }

    // Create the canvas and run the sketch in the html node.
    new p5(sketch, node)
})()

class Plot {
    constructor({
        canvasData,
        interactive,
        input_lines,
        input_points
    }, p, update) {
        this.p = p;
        this.update = update;

        this.canv = new Coordinate_Canvas(canvasData, p, () => {});

        this.hoverPoint = null;
        this.dragPoint = null;

        this.interactive = interactive;

        this.lines = input_lines;
        this.v1 = undefined;
        this.addLn = false;
        this.line_type;

        this.points = input_points;

        this.functions = [];
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
                } else if (this.dragPoint == 2) {
                    this.dragLine.x2 = mouse.x;
                    this.dragLine.y2 = mouse.y;
                } else if (this.dragLine == null) {
                    this.dragPoint.x = mouse.x;
                    this.dragPoint.y = mouse.y;
                }
                this.update(this.out());
            }
        }

        //DRAW POINTS
        p.stroke(labelTextColor);
        for (var poi of this.points) {
            p.push();
            p.stroke(201, 45, 24)
            p.strokeWeight(10);
            var pos = this.canv.getPos(poi.x, poi.y);
            if (p.dist(pos.x, pos.y, p.mouseX, p.mouseY) < 10 && this.hoverPoint == null && this.interactive) {
                this.hoverLine = null;
                this.hoverPoint = poi;
                p.strokeWeight(15);
            }
            p.point(pos.x, pos.y);
            p.pop();
        }

        // DRAW LINES
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
                type: this.line_type
            }])
        }

        for (var l of lin) {
            var p1 = this.canv.getPos(l.x1, l.y1)
            var p2 = this.canv.getPos(l.x2, l.y2)

            p.push();
            p.stroke(201, 45, 24)
            p.strokeWeight(10);
            if (p.dist(p1.x, p1.y, p.mouseX, p.mouseY) < 10 && this.hoverPoint == null && this.interactive) {
                this.hoverLine = l;
                this.hoverPoint = 1;
                p.strokeWeight(15);
            }
            p.point(p1.x, p1.y);
            p.pop();

            p.push();
            p.stroke(201, 45, 24)
            p.strokeWeight(10);
            if (p.dist(p2.x, p2.y, p.mouseX, p.mouseY) < 10 && this.hoverPoint == null && this.interactive) {
                this.hoverLine = l;
                this.hoverPoint = 2;
                p.strokeWeight(15);
            }
            p.point(p2.x, p2.y);
            p.pop();

            if (l.type == "dashed") {
                const ctx = p.drawingContext;
                ctx.setLineDash([10, 5]);

                p.line(p1.x, p1.y, p2.x, p2.y);

                ctx.setLineDash([10, 0]);
            } else if (l.type == "vector") {
                this.drawArrow(p.createVector(p1.x, p1.y), p.createVector(p2.x - p1.x, p2.y - p1.y), labelTextColor)
            } else {
                p.line(p1.x, p1.y, p2.x, p2.y);
            }
        }

        //DRAW FUNCTIONS
        for (var f of this.functions) {
            try {
                var coef;
                switch (f.type) {
                    case "sin":
                        coef = fitSin(f.points);
                        break;
                    case "tan":
                        coef = fitTan(f.points);
                        break;
                    case "exp":
                        coef = fitExp(f.points);
                        break;
                    case "reci":
                        coef = fitReci(f.points);
                        break;
                    case "polynomial":
                        coef = fitPoints(f.points);
                        break;
                }

                p.strokeWeight(2);
                p.noFill();
                p.beginShape(p.LINE);
                for (var i = this.canv.x_axis.start - 0.05 * this.canv.x_axis.increment; i < this.canv.x_axis.end; i += this.canv.x_axis.increment / 10) {
                    var value = 0;

                    switch (f.type) {
                        case "sin":
                            value = coef[0] * Math.sin(coef[1] * (i + coef[2])) + coef[3];
                            break;
                        case "tan":
                            value = coef[0] * Math.tan(coef[1] * (i + coef[2])) + coef[3];
                            break;
                        case "exp":
                            value = coef[0] ** (i + coef[1]);
                            break;
                        case "reci":
                            value = coef[0] / (i + coef[1]) + coef[2];
                            break;
                        case "polynomial":
                            for (var c = 0; c < coef.length; c++) {
                                value += coef[c] * i ** c;
                            }
                            break;
                    }

                    var pos = this.canv.getPos(i, value);
                    p.vertex(pos.x, pos.y);
                }
                p.endShape();
            } catch (e) {
                //if (p.frameCount % 100 == 0) console.log(e)

                p.push();
                p.strokeWeight(2);
                p.stroke(255, 0, 0);
                p.noFill();
                p.beginShape(p.LINE);
                for (var poi of f.points) {
                    var pos = this.canv.getPos(poi.x, poi.y);
                    p.vertex(pos.x, pos.y);
                }
                p.endShape();
                p.pop();
            }

            for (var poi of f.points) {
                p.push();
                var pos = this.canv.getPos(poi.x, poi.y);

                p.stroke(201, 45, 24)
                p.strokeWeight(10);
                if (p.dist(pos.x, pos.y, p.mouseX, p.mouseY) < 10 && this.hoverPoint == null && this.interactive) {
                    this.hoverPoint = f.points[f.points.indexOf(poi)];
                    p.strokeWeight(15);
                }
                p.point(pos.x, pos.y);
                p.pop();
            }
        }
    }

    click() {
        var s = this.canv.snap(this.p.mouseX, this.p.mouseY)
        var m = this.canv.getInvPos(s.x, s.y);

        if (this.addLn) {
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
                    type: this.line_type
                })

                this.addLn = false;
                this.v1 = undefined;
                this.update(this.out());
            }
        } else if (this.addPnt) {
            this.points.push(m)

            this.addPnt = false;
            this.update(this.out());
        } else {
            this.dragLine = this.hoverLine;
            this.dragPoint = this.hoverPoint;

            console.log(this.dragPoint)
        }
    }

    release() {
        this.dragPoint = null;
    }

    out() {
        return [JSON.stringify(this.lines)];
    }

    addLine(lineType) {
        this.addLn = true;
        this.line_type = lineType;
    }

    addPoint() {
        this.addPnt = true;
    }

    addFunction(points) {
        var pnt = []

        for (var i = 0; i < points; i++) {
            pnt.push({
                x: i,
                y: i ** i / 5
            })
        }

        this.functions.push({
            points: pnt,
            type: "polynomial"
        })
    }

    addSin() {
        this.functions.push({
            points: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
            type: "sin"
        })
    }

    addTan() {
        this.functions.push({
            points: [{ x: -1, y: -1 }, { x: 1, y: 1 }],
            type: "tan"
        })
    }

    addExp() {
        this.functions.push({
            points: [{ x: 2, y: 2 }],
            type: "exp"
        })
    }

    addReci() {
        this.functions.push({
            points: [{ x: -1, y: -1 }, { x: 1, y: 1 }],
            type: "reci"
        })
    }

    resize() {}

    drawArrow(base, vec, myColor) {
        var p = this.p;

        p.push();
        p.stroke(myColor);
        p.strokeWeight(3);
        p.fill(myColor);
        p.translate(base.x, base.y);
        p.line(0, 0, vec.x, vec.y);
        p.rotate(vec.heading());
        let arrowSize = 7;
        p.translate(vec.mag() - arrowSize, 0);
        p.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        p.pop();
    }
}

function fitReci(pnts) {
    // y = A/(x+B) + C

    var B = -(pnts[1].x + pnts[0].x) / 2;
    var A = (pnts[1].x - pnts[0].x) / 2 * (pnts[1].y - pnts[0].y) / 2;
    var C = (pnts[1].y + pnts[0].y) / 2;

    return ([A, B, C]);
}

function fitExp(pnts) {
    // A^(x-B)

    if (pnts[0].y < 0) {
        throw "Point cannot be under x axis.";
    }

    var B = -pnts[0].x + 1;
    var A = pnts[0].y;

    return [A, B];
}

function fitSin(pnts) {
    //A * sin (B(x+C))+D

    if (pnts[1].x - pnts[0].x == 0) {
        throw "Points cannot be directly above eachother.";
    }

    var X = pnts.map(x => x.x);
    var Y = pnts.map(x => x.y);

    var period = 2 * (pnts[1].x - pnts[0].x)

    // VERTICAL SHIFT
    var D = (Math.max(...Y) + Math.min(...Y)) / 2;

    // AMPLITUDE
    var A = (pnts[1].y - pnts[0].y) / 2;

    // FREQUENCY
    var B = 2 * Math.PI / period;

    // HORIZONTAL SHIFT
    var C = -((pnts[1].x + pnts[0].x) / 2);

    return ([A, B, C, D])
}

function fitTan(pnts) {
    //A * tan (B(x+C))+D

    if (pnts[1].x - pnts[0].x == 0) {
        throw "Points cannot be directly above eachother.";
    }

    var X = pnts.map(x => x.x);
    var Y = pnts.map(x => x.y);

    var period = 4 * (pnts[1].x - pnts[0].x)

    // VERTICAL SHIFT
    var D = (Math.max(...Y) + Math.min(...Y)) / 2;

    // AMPLITUDE
    var A = (pnts[1].y - pnts[0].y) / 2;

    // FREQUENCY
    var B = 2 * Math.PI / period;

    // HORIZONTAL SHIFT
    var C = -((pnts[1].x + pnts[0].x) / 2);

    return ([A, B, C, D])
}

function fitPoints(pnts) {
    var coefficients;
    var Y = math.matrix(pnts.map(x => [x.y]));
    var X = [];

    for (var p of pnts) {
        var r = []
        for (var i = 0; i < pnts.length; i++) {
            r.push(p.x ** i);
        }
        X.push(r);
    }
    X = math.matrix(X);

    var X_inv = math.inv(X);

    coefficients = math.multiply(X_inv, Y);

    return (coefficients._data.map(x => x[0]));
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

    resize() {}
}