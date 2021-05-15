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
            p.cursor(p.HAND);
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

        this.update(this.out());
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
                try {
                    if (this.hoverLine != null) {
                        this.hoverLine["x" + this.dragPoint] = m.x
                        this.hoverLine["y" + this.dragPoint] = m.y
                    } else if (this.hoverLine == null) {
                        this.dragPoint.x = m.x;
                        this.dragPoint.y = m.y;
                    }
                    this.update(this.out());
                } catch (error) {

                }
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

        var addedHL = false;
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
                addedHL = true;
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
                addedHL = true;
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

        if (!addedHL && this.dragPoint == null) {
            this.hoverLine = null;
        }
    }

    click() {
        // set the dragged point to be the same as the hovered point
        this.dragPoint = this.hoverPoint;
    }

    release() {
        this.dragPoint = null;
        this.hoverLine = null;
    }

    out() {
        // ouput the points of both shapes
        return [JSON.stringify(this.sB.points.map(p => {
            p.x = Math.round(p.x * 1e6) / 1e6;
            p.y = Math.round(p.y * 1e6) / 1e6;
            return p
        }))];
    }

    addSolid() {
        this.lines.push({
            x1: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
            y1: this.p.random(Math.ceil(this.canv.y_axis.start), Math.floor(this.canv.y_axis.end)),
            x2: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
            y2: this.p.random(Math.ceil(this.canv.y_axis.start), Math.floor(this.canv.y_axis.end)),
            type: "solid"
        })
    }

    addDashed() {
        this.lines.push({
            x1: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
            y1: this.p.random(Math.ceil(this.canv.y_axis.start), Math.floor(this.canv.y_axis.end)),
            x2: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
            y2: this.p.random(Math.ceil(this.canv.y_axis.start), Math.floor(this.canv.y_axis.end)),
            type: "dashed"
        })
    }

    resize() {}

    clear() {
        this.lines = []
        this.update(this.out());
    }
}