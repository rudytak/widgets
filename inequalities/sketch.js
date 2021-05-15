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
            window.ineq = ineq;

            if (creationData.interactive) {
                var solidBtn = document.createElement("button");
                solidBtn.innerText = "Clear";
                solidBtn.type = "button";
                solidBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                solidBtn.onclick = () => { ineq.clear() };
                node.appendChild(solidBtn)

                var solidBtn = document.createElement("button");
                solidBtn.innerText = "Solid line";
                solidBtn.type = "button";
                solidBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                solidBtn.onclick = () => { ineq.addLine("solid") };
                node.appendChild(solidBtn)

                var dashedBtn = document.createElement("button");
                dashedBtn.innerText = "Dashed line";
                dashedBtn.type = "button";
                dashedBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                dashedBtn.onclick = () => { ineq.addLine("dashed") };
                node.appendChild(dashedBtn)
            }

            var c = p.createCanvas(dims.w, dims.h)
            c.elt.addEventListener("mousedown", () => {
                ineq.click();
            })

            c.elt.addEventListener("mouseup", () => {
                ineq.release();
            })

            c.elt.style["margin-top"] = "10px";
            p.cursor(p.HAND);
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
        // load in data
        this.p = p;
        this.update = update;

        // create canvas
        this.canv = new Coordinate_Canvas(canvasData, p, () => {});

        this.hoverPoint = null;
        this.dragPoint = null;

        this.interactive = interactive;

        this.lines = input_lines;
        this.v1 = undefined;
        this.add = false;
        this.line_type;
        this.line_direction;

        // init output
        this.update(this.out());
    }

    draw() {
        var p = this.p;
        // draw canvas
        this.canv.draw();
        // shaded areas colors
        var col = ["#00ACED", "#F26363", "#69B516", "#FF8F41"];

        // reset hover point
        this.hoverPoint = null;

        var mo = { x: p.mouseX, y: p.mouseY }
        var s = this.canv.snap(p.mouseX, p.mouseY)
        var mouse = this.canv.getInvPos(s.x, s.y);
        // check for point dragging
        if (this.dragPoint != null) {
            if (this.interactive) {
                // dragging one of the points on a line
                if (this.dragPoint == 1) {
                    this.dragLine.x1 = mouse.x;
                    this.dragLine.y1 = mouse.y;
                } else if (this.dragPoint == 2) {
                    this.dragLine.x2 = mouse.x;
                    this.dragLine.y2 = mouse.y;
                } else {
                    /*
                    this.dragLine.c_x = mouse.x;
                    this.dragLine.c_y = mouse.y;*/
                }
                this.update(this.out());
            }
        }

        p.stroke(labelTextColor);
        p.strokeWeight(2);
        var lin = this.lines;
        /*
        if (this.v1) {
            lin = this.lines.concat([{
                x1: this.v1.x,
                y1: this.v1.y,
                x2: mouse.x,
                y2: mouse.y,
                type: this.line_type,
                direction: this.line_direction
            }])
        }*/

        // loop through all the lines
        for (var l of lin) {
            p.fill(col[lin.indexOf(l) % col.length] + "40");
            // preparee pointpositions
            var p1 = this.canv.getPos(l.x1, l.y1);
            var p2 = this.canv.getPos(l.x2, l.y2);
            var p3 = this.canv.getPos(l.c_x, l.c_y);

            // calculate the function from points
            var dy = p1.y - p2.y;
            var dx = p1.x - p2.x;
            var m = dy / dx;
            var f = (x) => {
                return (m * x + p1.y - p1.x * m);
            }

            //Draw points if interactive
            if (this.interactive) {
                // pooint 1
                p.push();
                p.strokeWeight(10);
                p.stroke(201, 45, 24)
                if (p.dist(p1.x, p1.y, mo.x, mo.y) < 10 && this.hoverPoint == null && this.interactive) {
                    // check for hover
                    this.hoverLine = l;
                    this.hoverPoint = 1;
                    p.strokeWeight(15);
                }
                p.point(p1.x, p1.y);
                p.pop();

                // point 2
                p.push();
                p.strokeWeight(10);
                p.stroke(201, 45, 24)
                if (p.dist(p2.x, p2.y, mo.x, mo.y) < 10 && this.hoverPoint == null && this.interactive) {
                    // check for hover
                    this.hoverLine = l;
                    this.hoverPoint = 2;
                    p.strokeWeight(15);
                }
                p.point(p2.x, p2.y);
                p.pop();

                // Button
                p.push();
                p.strokeWeight(5);
                p.stroke(col[lin.indexOf(l) % col.length])
                if (p.dist((p2.x + p1.x) / 2, (p2.y + p1.y) / 2, mo.x, mo.y) < 20 && this.hoverPoint == null && this.interactive) {
                    // check for hover
                    this.hoverLine = l;
                    this.hoverPoint = -1;
                    p.strokeWeight(10);
                }
                if (dx == 0) {
                    p.translate((p2.x + p1.x) / 2, (p2.y + p1.y) / 2);
                    p.rotate(Math.abs(Math.atan(m)) * ((l.direction == "larger" || l.direction == "bigger") ? -1 : 1))
                } else {
                    p.translate((p2.x + p1.x) / 2, (p2.y + p1.y) / 2);
                    p.rotate(Math.atan(m) + ((l.direction == "larger" || l.direction == "bigger") ? Math.PI : 0))
                }
                p.line(0, -20, 0, 20);
                p.line(0, 20, -10, 10);
                p.line(0, 20, 10, 10);
                p.pop();

                /*
                // control point
                p.push();
                p.strokeWeight(10);
                p.stroke(201, 45, 24)
                if (p.dist(p3.x, p3.y, mo.x, mo.y) < 10 && this.hoverPoint == null && this.interactive) {
                    // check for hover
                    this.hoverLine = l;
                    this.hoverPoint = 3;
                    p.strokeWeight(15);
                }
                p.point(p3.x, p3.y);
                p.pop();*/
            }

            //Check the direction of the line depending on the control point
            /*
            function direction(x1, y1, x2, y2, x3, y3) {
                if (x1 - x2 == 0) {
                    // LINE IS VERTICAL
                    if (x3 < x1) {
                        return "smaller"
                    } else {
                        return "larger"
                    }
                }

                //calculate function from points
                var m = (y2 - y1) / (x2 - x1)
                var b = m * -x1 + y1

                var f = (x) => {
                    return m * x + b
                }

                if (y3 > f(x3)) {
                    //it's bigger
                    return "larger"
                } else if (y3 < f(x3)) {
                    //it's smaller
                    return "smaller"
                } else {
                    //it's on the line
                    return "smaller"
                }
            }*/

            // set the direction
            //l.direction = direction(l.x1, l.y1, l.x2, l.y2, l.c_x, l.c_y);

            if (l.type == "dashed") {
                // draw a dashed line
                const ctx = p.drawingContext;
                p.strokeWeight(3)
                    // set dashing
                ctx.setLineDash([20, 20]);

                if (dx == 0) {
                    // vertical
                    p.line(p1.x, 0, p1.x, p.height);
                } else {
                    //normal
                    p.line(0, f(0), p.width, f(p.width))
                }

                // stop dashing
                ctx.setLineDash([10, 0]);
            } else {
                if (dx == 0) {
                    // vertical
                    p.line(p1.x, 0, p1.x, p.height);
                } else {
                    // normal
                    p.line(0, f(0), p.width, f(p.width))
                }
            }

            p.push();
            p.noStroke();
            // draw the shading
            if (l.direction != undefined) {
                p.beginShape();
                if (dx == 0) {
                    // vertical
                    if (l.direction == "larger" || l.direction == "bigger") {
                        //larger
                        p.vertex(p1.x, 0)
                        p.vertex(p1.x, p.height)
                    } else {
                        //smaller
                        p.vertex(p1.x, 0)
                        p.vertex(p1.x, p.height)
                    }
                } else {
                    // normal
                    p.vertex(0, f(0))
                    p.vertex(p.width, f(p.width))
                }


                // finish drawing
                if (l.direction == "larger" || l.direction == "bigger") {
                    // for larger
                    p.vertex(p.width, p.height);
                    p.vertex(p.width, 0);
                    p.vertex(0, 0);
                    p.vertex(0, p.height);
                    if (dx == 0) p.vertex(0, 0); // extra vertex for vertical
                } else {
                    // for smaller
                    if (dx == 0) p.vertex(p.width, p.height); // extra vertex for vertical
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

        if (this.hoverLine) {
            if (this.hoverPoint == -1) {
                if (this.hoverLine.direction == "larger" || this.hoverLine.direction == "bigger") {
                    this.hoverLine.direction = "smaller";
                } else {
                    this.hoverLine.direction = "larger"
                }
            }
        }

        if (this.add) {
            /*
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
                        }*/
        } else {
            // set dragged point
            this.dragLine = this.hoverLine;
            this.dragPoint = this.hoverPoint;
        }
    }

    release() {
        // reset dragged point
        this.dragPoint = null;
    }

    out() {
        //export
        return [JSON.stringify(this.lines.map(x => {

            var dy = x.y1 - x.y2;
            var dx = x.x1 - x.x2;
            if (dx == 0) {
                return {
                    equation: `y${(x.direction == "larger" || x.direction == "bigger")?"\\gt":"\\lt"}${x.x1}`,
                    type: x.type
                };
            } else {
                var m = this.p.round(dy / dx, 6);
                var b = this.p.round(x.y1 - x.x1 * m, 6);

                return {
                    equation: `y${(x.direction == "larger" || x.direction == "bigger")?"\\gt":"\\lt"}${m}x+${b}`.replaceAll("--", "+").replaceAll("+-", "-"),
                    type: x.type
                };
            }
        }))];
    }

    addLine(lineType) {
        // add a randomised ine
        this.lines.push({
            x1: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
            y1: this.p.random(Math.ceil(this.canv.y_axis.start), Math.floor(this.canv.y_axis.end)),
            x2: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
            y2: this.p.random(Math.ceil(this.canv.y_axis.start), Math.floor(this.canv.y_axis.end)),
            c_x: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
            c_y: this.p.random(Math.ceil(this.canv.y_axis.start), Math.floor(this.canv.y_axis.end)),
            type: lineType,
            direction: this.p.random("larger", "smaller")
        })
        this.update(this.out());
    }

    clear() {
        // reset lines
        this.lines = []
        this.update(this.out());
    }

    resize() {}
}