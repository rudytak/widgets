var backgroundColor, labelTextColor;
const createCummulativeFrequencyDiagram = (() => {
    const node = document.getElementById('widget-container')
    const hiddenInputs = ["cummulative-frequency-diagram-points"]
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

    let CFD;
    var creationData = {
        canvasData: canvasData,
        points: pnts,
        interactive: interactive
    }

    // Define the p5 sketch methods
    const sketch = p => {
        p.setup = () => {
            // Add reset button
            if (interactive) {
                var clrBtn = document.createElement("button");
                clrBtn.innerText = "Reset";
                clrBtn.type = "button";
                clrBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                clrBtn.style = "margin-bottom: 10px !important;"
                clrBtn.onclick = () => { CFD.reset() };
                node.appendChild(clrBtn)
            }

            var c = p.createCanvas(dims.w, dims.h)
            c.elt.addEventListener("mousedown", () => {
                CFD.click();
            })

            c.elt.addEventListener("mouseup", () => {
                CFD.release();
            })

            c.elt.style["margin-top"] = "10px";
            p.cursor(p.HAND);

            CFD = new Cumm_Frq_Dia(creationData, p, updateHiddenInputs)
        }

        p.draw = () => {
            p.clear()
            CFD.draw()
        }

        p.windowResized = () => {
            p.resizeCanvas(0, 0)

            dims = {
                w: node.clientWidth,
                h: getHeightOfCanvas()
            }

            p.resizeCanvas(dims.w, dims.h)

            CFD.resize()
        }
    }

    // Create the canvas and run the sketch in the html node.
    new p5(sketch, node)
})()

class Cumm_Frq_Dia {
    constructor({
        points,
        canvasData,
        interactive
    }, p, update) {
        // load in all data
        this.p = p;
        this.update = update;

        // create canvas
        this.canv = new Coordinate_Canvas(canvasData, p, () => {});
        //this.canv.snapToGrid = false;
        this.oldpoints = Object.create(points)
        this.points = Object.create(points);

        this.hoverPoint = null;
        this.dragPoint = null;

        this.interactive = interactive;

        this.update(this.out());
    }

    draw() {
        var p = this.p;
        //draw the canvas
        this.canv.draw();

        // Reset hover point
        this.hoverPoint = null;

        // move dragged point
        if (this.dragPoint != null) {
            if (this.interactive) {
                var pos = this.canv.getPos();
                var sna = this.canv.snap(p.mouseX, p.mouseY);
                this.points[this.dragPoint] = this.canv.getInvPos(sna.x, sna.y);
                this.update(this.out());
            }
        }

        // prepare colors
        p.stroke(labelTextColor);
        p.strokeWeight(2);
        p.noFill();
        p.curveTightness(0.5);

        // begin drawing the shape
        p.beginShape();
        // draw the first vertex
        var pos = this.canv.getPos(this.points[0].x, this.points[0].y);
        p.curveVertex(pos.x, pos.y);

        for (var i = 0; i < this.points.length; i++) {
            // loop through all the points and draw them
            var pos = this.canv.getPos(this.points[i].x, this.points[i].y);
            p.curveVertex(pos.x, pos.y);

            if (this.interactive) {
                // if interactive, draw the points
                p.push();
                p.stroke(201, 45, 24)
                if (p.dist(pos.x, pos.y, p.mouseX, p.mouseY) < 10 && this.interactive) {
                    // expand them if they are hovered
                    p.strokeWeight(15);
                    this.hoverPoint = i;
                } else p.strokeWeight(10);

                p.point(pos.x, pos.y)
                p.pop();
            }
        }

        // draw the last point
        var pos = this.canv.getPos(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
        p.curveVertex(pos.x, pos.y);
        p.endShape();
    }

    click() {
        // set the dragged point to the hovered point
        this.dragPoint = this.hoverPoint;
    }

    release() {
        // reset the dragged point
        this.dragPoint = null;
    }

    out() {
        // return the rounded values
        return [JSON.stringify(this.points.map(x => {
            x.x = Math.round(x.x * 1e6) / 1e6;
            x.y = Math.round(x.y * 1e6) / 1e6;
            return x
        }))];
    }

    reset() {
        // set the points to teh starting 
        this.points = Object.create(this.oldpoints);
        this.update(this.out());
    }

    resize() {}
}