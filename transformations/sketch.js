var backgroundColor, labelTextColor;
const createCummulativeFrequencyDiagram = (() => {
    const node = document.getElementById('widget-container')
    const hiddenInputs = ["transformations-shape-B-points"]
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

    let trans;
    var creationData = {
        canvasData: canvasData,
        shapeA: shapeA,
        shapeB: shapeB,
        interactive: interactive
    }

    // Define the p5 sketch methods
    const sketch = p => {
        p.setup = () => {
            // Create instance of the transofrmation calss
            trans = new Transformation(creationData, p, updateHiddenInputs)

            // Add the buttons if interactive
            if (creationData.interactive) {
                var solidBtn = document.createElement("button");
                solidBtn.innerText = "Clear";
                solidBtn.type = "button";
                solidBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                solidBtn.onclick = () => { trans.clear() };
                node.appendChild(solidBtn)

                var solidBtn = document.createElement("button");
                solidBtn.innerText = "Solid line";
                solidBtn.type = "button";
                solidBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                solidBtn.onclick = () => { trans.addSolid() };
                node.appendChild(solidBtn)

                var dashedBtn = document.createElement("button");
                dashedBtn.innerText = "Dashed line";
                dashedBtn.type = "button";
                dashedBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                dashedBtn.onclick = () => { trans.addDashed() };
                node.appendChild(dashedBtn)
            }

            // Create the canvas and add click and release lsiteners
            var c = p.createCanvas(dims.w, dims.h)
            c.elt.addEventListener("mousedown", () => {
                trans.click();
            })

            c.elt.addEventListener("mouseup", () => {
                trans.release();
            })

            c.elt.style["margin-top"] = "10px";
        }

        // p5 draw function
        p.draw = () => {
            p.clear()
            trans.draw()
        }

        // resizing the window
        p.windowResized = () => {
            p.resizeCanvas(0, 0)

            dims = {
                w: node.clientWidth,
                h: getHeightOfCanvas()
            }

            p.resizeCanvas(dims.w, dims.h)

            trans.resize()
        }
    }

    // Create the canvas and run the sketch in the html node.
    new p5(sketch, node)
})()

class Transformation {
    // Data in: canvas data, shape A data, shape B data, interactive (true/false)
    constructor({
        canvasData,
        shapeA,
        shapeB,
        interactive
    }, p, update) {
        // Save all the values
        this.p = p;
        this.update = update;

        // Create the canvas
        this.canv = new Coordinate_Canvas(canvasData, p, () => {});

        this.sA = shapeA;
        this.sB = shapeB;

        this.hoverPoint = null;
        this.dragPoint = null;

        this.interactive = interactive;

        this.lines = [];
        this.v1 = undefined;
        this.addSol = false;
        this.addDash = false;
    }

    draw() {
        var p = this.p;
        // draw the canvas
        this.canv.draw();

        this.hoverPoint = null;

        // Moving the drag point
        var s = this.canv.snap(p.mouseX, p.mouseY)
        var m = this.canv.getInvPos(s.x, s.y);
        if (this.dragPoint != null) {
            if (this.interactive) {
                if (this.hoverLine) {
                    this.hoverLine["x" + this.dragPoint] = m.x
                    this.hoverLine["y" + this.dragPoint] = m.y
                } else {
                    this.dragPoint.x = m.x;
                    this.dragPoint.y = m.y;
                }
                this.update(this.out());
            }
        }

        p.noStroke();

        // draw shape A
        p.fill(this.sA.col);
        p.beginShape();
        for (var poi of this.sA.points) {
            var pos = this.canv.getPos(poi.x, poi.y);
            p.vertex(pos.x, pos.y);
        }
        p.endShape(p.CLOSE);

        /*
        p.fill(this.sA.primary_col)
        for (var poi of this.sA.points) {
            var pos = this.canv.getPos(poi.x, poi.y);
            if (p.dist(pos.x, pos.y, p.mouseX, p.mouseY) < 10) {
                p.ellipse(pos.x, pos.y, 10, 10);
                this.hoverPoint = this.sA.points[this.sA.points.indexOf(poi)];
            } else p.ellipse(pos.x, pos.y, 5, 5);
        }*/

        // draw shape B
        p.fill(this.sB.col);
        p.beginShape();
        for (var poi of this.sB.points) {
            var pos = this.canv.getPos(poi.x, poi.y);
            p.vertex(pos.x, pos.y);
        }
        p.endShape(p.CLOSE);

        // draw shape B points
        if (this.interactive) {
            p.fill(201, 45, 24)
            for (var poi of this.sB.points) {
                var pos = this.canv.getPos(poi.x, poi.y)

                p.stroke(201, 45, 24)
                p.strokeWeight(10);
                if (p.dist(pos.x, pos.y, p.mouseX, p.mouseY) < 10 && this.hoverPoint == null && this.interactive) {
                    this.hoverPoint = this.sB.points[this.sB.points.indexOf(poi)];
                    p.strokeWeight(15);
                }
                p.point(pos.x, pos.y);
            }
        }

        // add one more line if we are in the process of adding one
        p.stroke(labelTextColor);
        p.strokeWeight(2);
        var lin = this.lines;
        if (this.v1) {
            lin = this.lines.concat([{
                x1: this.v1.x,
                y1: this.v1.y,
                x2: m.x,
                y2: m.y,
                type: this.addSol ? "solid" : "dashed"
            }])
        }

        // draw all the lines
        for (var l of lin) {
            // get positions of the line points
            var p1 = this.canv.getPos(l.x1, l.y1);
            var p2 = this.canv.getPos(l.x2, l.y2);

            p.push();
            p.stroke(201, 45, 24)
            p.strokeWeight(10);
            if (p.dist(p1.x, p1.y, p.mouseX, p.mouseY) < 10 && this.hoverPoint == null && this.interactive) {
                this.hoverLine = l;
                this.hoverPoint = 1;
                p.strokeWeight(15);
            }
            if (this.interactive) p.point(p1.x, p1.y);
            p.pop();

            p.push();
            p.stroke(201, 45, 24)
            p.strokeWeight(10);
            if (p.dist(p2.x, p2.y, p.mouseX, p.mouseY) < 10 && this.hoverPoint == null && this.interactive) {
                this.hoverLine = l;
                this.hoverPoint = 2;
                p.strokeWeight(15);
            }
            if (this.interactive) p.point(p2.x, p2.y);
            p.pop();

            // calculate the line as linear function
            var dy = p1.y - p2.y;
            var dx = p1.x - p2.x;
            var m = dy / dx;
            var f = (x) => {
                return (m * x + p1.y - p1.x * m);
            }

            // cehck if dashed
            if (l.type == "dashed") {
                const ctx = p.drawingContext;
                p.strokeWeight(3)
                ctx.setLineDash([20, 20]);

                // draw the line
                if (dx == 0) {
                    p.line(p1.x, 0, p1.x, p.height);
                } else {
                    p.line(0, f(0), p.width, f(p.width))
                }

                ctx.setLineDash([10, 0]);
            } else {
                // draw the line
                if (dx == 0) {
                    p.line(p1.x, 0, p1.x, p.height);
                } else {
                    p.line(0, f(0), p.width, f(p.width))
                }
            }
        }
    }

    click() {
        // set the dragged point to be the same as the hovered point
        this.dragPoint = this.hoverPoint;
    }

    release() {
        this.dragPoint = null;
    }

    out() {
        // ouput the points of both shapes
        return [JSON.stringify(this.sB.points)];
    }

    addSolid() {
        this.lines.push({
            x1: this.p.random(this.canv.x_axis.start, this.canv.x_axis.end),
            y1: this.p.random(this.canv.y_axis.start, this.canv.y_axis.end),
            x2: this.p.random(this.canv.x_axis.start, this.canv.x_axis.end),
            y2: this.p.random(this.canv.y_axis.start, this.canv.y_axis.end),
            type: "solid"
        })
    }

    addDashed() {
        this.lines.push({
            x1: this.p.random(this.canv.x_axis.start, this.canv.x_axis.end),
            y1: this.p.random(this.canv.y_axis.start, this.canv.y_axis.end),
            x2: this.p.random(this.canv.x_axis.start, this.canv.x_axis.end),
            y2: this.p.random(this.canv.y_axis.start, this.canv.y_axis.end),
            type: "dashed"
        })
    }

    resize() {}

    clear() {
        this.lines = []
    }
}

class Coordinate_Canvas {
    // takes in: quadrants to show (full/line/1/2/3/4)
    // x axis data
    // y axis data
    // snap to grid, show grid, aixs numbering (true/false)
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
        // Set all the appropriate values
        this.p = p;
        this.update = update;

        this.x_axis = x_axis;
        this.x_axis.start -= this.x_axis.increment / 2;
        this.x_axis.end += this.x_axis.increment / 2;

        this.y_axis = y_axis;
        this.y_axis.start -= this.y_axis.increment / 2;
        this.y_axis.end += this.y_axis.increment / 2;

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

        // set the colors
        p.background(backgroundColor)
        p.stroke(labelTextColor);
        p.strokeWeight(2);

        // determine the positions of the axes onb the type
        var x_axis_pos;
        var y_axis_pos;
        if (this.quadrants == "full") {
            x_axis_pos = 0;
            y_axis_pos = 0;
        }
        /*else if (this.quadrants == 1) {
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
               } */
        else if (this.quadrants == "line") {
            this.x_axis.show = true;

            this.y_axis.show = false;
            this.showGrid = false;

            x_axis_pos = 0;
            y_axis_pos = (this.y_axis.start + this.y_axis.end) / 2;
        } else {
            x_axis_pos = 0;
            y_axis_pos = 0;
        }
        this.x_axis_pos = x_axis_pos;
        this.y_axis_pos = y_axis_pos;

        var ya = p.map(y_axis_pos, this.y_axis.start, this.y_axis.end, p.height, 0);
        var xa = p.map(x_axis_pos, this.x_axis.start, this.x_axis.end, 0, p.width);

        // X axis
        if (this.x_axis.show) {
            if (this.quadrants == "line") {
                // draw x axis line
                p.line(0, p.height / 2, p.width, p.height / 2);

                // add axis label
                p.push();
                p.fill(labelTextColor);
                p.noStroke();
                p.textAlign(p.BOTTOM, p.LEFT);
                p.textSize(20);
                p.text(this.x_axis.label, p.width - p.textWidth(this.x_axis.label) - 5, p.height / 2 - 12)
                p.pop();
            } else {
                // draw x axis
                p.line(0, ya, p.width, ya);


                p.push();
                p.fill(labelTextColor);
                p.noStroke();
                p.textAlign(p.TOP, p.LEFT);
                p.textSize(20);
                p.text(this.x_axis.label, p.width - p.textWidth(this.x_axis.label) - 3, ya - 12)
                p.pop();
            }
        }

        // Y axis
        if (this.y_axis.show) {
            // draw y axis line
            p.line(xa, 0, xa, p.height);

            // add axis label
            p.push();
            p.fill(labelTextColor);
            p.noStroke();
            p.textAlign(p.BOTTOM, p.LEFT);
            p.textSize(20);
            p.text(this.y_axis.label, xa + 5, 12)
            p.pop();
        }

        p.stroke(labelTextColor + "30");
        p.strokeWeight(1);
        //X lines
        for (var i = this.x_axis.increment * p.floor(this.x_axis.start / this.x_axis.increment); i <= this.x_axis.end; i += this.x_axis.increment) {
            // draw all the lines perpendicular to x axis
            var x = p.map(i, this.x_axis.start, this.x_axis.end, 0, p.width);

            //draw the line
            if (this.showGrid) {
                p.line(x, 0, x, p.height);
            }

            // handle axis numbering
            if (this.axisNumbering) {
                if (this.x_axis.show) {
                    // calculate rounded value
                    var rounding = this.x_axis.increment.toString().split(".")[1];
                    if (!rounding) rounding = 0;
                    else rounding = rounding.length;

                    p.push();
                    p.noStroke();
                    var rounded = Math.round(i * 10 ** rounding) / 10 ** rounding
                        // not at origin
                    if (rounded != x_axis_pos) {
                        // draw the rounded value
                        p.textSize(20);
                        var b = { x: x - p.textWidth(rounded) / 2, y: ya + 22 - 12, w: p.textWidth(rounded), h: 13 }
                        p.fill(backgroundColor);
                        p.rect(b.x, b.y, b.w, b.h);

                        p.fill(labelTextColor);
                        p.text(rounded, x - p.textWidth(rounded) / 2, ya + 22);
                    } else {
                        /*
                        p.fill(labelTextColor);
                        p.text(rounded, x + 3, ya + 15);*/
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
            // draw all the lines perpendicular to y axis
            var y = p.map(i, this.y_axis.start, this.y_axis.end, p.height, 0);

            //draw the line
            if (this.showGrid) {
                p.line(0, y, p.width, y);
            }

            // handle axis numbering
            if (this.axisNumbering) {
                if (this.y_axis.show) {
                    // calculate rounded value
                    var rounding = this.y_axis.increment.toString().split(".")[1];
                    if (!rounding) rounding = 0;
                    else rounding = rounding.length;

                    p.push();
                    p.fill(labelTextColor);
                    p.noStroke();
                    var rounded = Math.round((i) * 10 ** rounding) / 10 ** rounding
                        // not at origin
                    if (rounded != y_axis_pos) {
                        // draw the rounded value
                        p.textSize(20);
                        var b = { x: xa - p.textWidth(rounded) - 6, y: y + 4 - 12, w: p.textWidth(rounded) + 2, h: 13 }
                        p.fill(backgroundColor);
                        p.rect(b.x, b.y, b.w, b.h);

                        p.fill(labelTextColor);
                        p.text(rounded, xa - p.textWidth(rounded) - 5, y + 4);
                    } else {
                        /*
                        p.text(rounded, xa - p.textWidth(rounded) - 5, y - 4);*/
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

        // draw point at the snapped cursor
        var snap = this.snap(p.mouseX, p.mouseY);
        p.strokeWeight(5);
        p.stroke(0)
        p.point(snap.x, snap.y)
    }

    snap(x, y) {
        var p = this.p;
        if (!this.snapToGrid) {
            // if jnot snap to grid, return original value
            return { x: x, y: y };
        } else {
            if (this.quadrants == "line") {
                // handle and calculate the position for line canvas
                var xa = p.map(this.x_axis_pos, this.x_axis.start, this.x_axis.end, 0, p.width);
                var xInc = p.map(this.x_axis.increment + this.x_axis.start, this.x_axis.start, this.x_axis.end, 0, p.width);
                var x_s = Math.round((x - xa) / xInc) * xInc + xa;

                var y_axis_pos = (this.y_axis.start + this.y_axis.end) / 2;
                var y_s = p.map(y_axis_pos, this.y_axis.start, this.y_axis.end, p.height, 0);

                return { x: x_s, y: y_s };
            } else {
                // handle and calculate the position for normal canvas
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
        // function for calculating value from coordinate canvas to value on normal canvas
        var y_m = this.p.map(y, this.y_axis.start, this.y_axis.end, this.p.height, 0);
        var x_m = this.p.map(x, this.x_axis.start, this.x_axis.end, 0, this.p.width);

        return ({ x: x_m, y: y_m });
    }

    getInvPos(x, y) {
        // opposite of getPos()
        var y_m = this.p.map(y, this.p.height, 0, this.y_axis.start, this.y_axis.end);
        var x_m = this.p.map(x, 0, this.p.width, this.x_axis.start, this.x_axis.end);

        return ({ x: x_m, y: y_m });
    }

    click() {}

    resize() {}
}