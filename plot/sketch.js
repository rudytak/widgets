var backgroundColor, labelTextColor;
const createCummulativeFrequencyDiagram = (() => {
    const node = document.getElementById('widget-container')
    const hiddenInputs = ["plot-output"]
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
        input_points: input_points,
        input_function: input_functions
    }

    // Define the p5 sketch methods
    const sketch = p => {
        p.setup = () => {
            plt = new Plot(creationData, p, updateHiddenInputs);
            window.plt = plt;

            // Rows of buttons
            var buttonRow1 = document.createElement("div");
            var buttonRow2 = document.createElement("div");
            var buttonRow3 = document.createElement("div");
            node.appendChild(buttonRow1)
            node.appendChild(buttonRow2)
            node.appendChild(buttonRow3)

            // add all the buttons if interactive
            if (creationData.interactive) {
                var clrBtn = document.createElement("button");
                clrBtn.innerText = "Clear";
                clrBtn.type = "button";
                clrBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                clrBtn.style = "margin-bottom: 10px !important;"
                clrBtn.onclick = () => { plt.clear() };
                buttonRow1.appendChild(clrBtn)

                var pointBtn = document.createElement("button");
                pointBtn.innerText = "●";
                pointBtn.type = "button";
                pointBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                pointBtn.style = "margin-bottom: 10px !important;"
                pointBtn.onclick = () => { plt.addPoint() };
                buttonRow1.appendChild(pointBtn)

                var lineBtn = document.createElement("button");
                lineBtn.innerText = "─";
                lineBtn.type = "button";
                lineBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                lineBtn.style = "margin-bottom: 10px !important;"
                lineBtn.onclick = () => { plt.addLine("solid") };
                buttonRow1.appendChild(lineBtn)

                var vectorBtn = document.createElement("button");
                vectorBtn.innerText = "→";
                vectorBtn.type = "button";
                vectorBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                vectorBtn.style = "margin-bottom: 10px !important;"
                vectorBtn.onclick = () => { plt.addLine("vector") };
                buttonRow1.appendChild(vectorBtn)

                var linearFunctionBtn = document.createElement("button");
                linearFunctionBtn.innerText = "Linear";
                linearFunctionBtn.type = "button";
                linearFunctionBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                linearFunctionBtn.style = "margin-bottom: 10px !important;"
                linearFunctionBtn.onclick = () => { plt.addFunction(2) };
                buttonRow2.appendChild(linearFunctionBtn)

                var quadraticFunctionBtn = document.createElement("button");
                quadraticFunctionBtn.innerText = "Quadratic";
                quadraticFunctionBtn.type = "button";
                quadraticFunctionBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                quadraticFunctionBtn.style = "margin-bottom: 10px !important;"
                quadraticFunctionBtn.onclick = () => { plt.addFunction(3) };
                buttonRow2.appendChild(quadraticFunctionBtn)

                var cubicFunctionBtn = document.createElement("button");
                cubicFunctionBtn.innerText = "Cubic";
                cubicFunctionBtn.type = "button";
                cubicFunctionBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                cubicFunctionBtn.style = "margin-bottom: 10px !important;"
                cubicFunctionBtn.onclick = () => { plt.addFunction(4) };
                buttonRow2.appendChild(cubicFunctionBtn)

                var sinFunctionBtn = document.createElement("button");
                sinFunctionBtn.innerText = "Sinusodial";
                sinFunctionBtn.type = "button";
                sinFunctionBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                sinFunctionBtn.style = "margin-bottom: 10px !important;"
                sinFunctionBtn.onclick = () => { plt.addSin() };
                buttonRow2.appendChild(sinFunctionBtn)

                var tanFunctionBtn = document.createElement("button");
                tanFunctionBtn.innerText = "Tangentodial";
                tanFunctionBtn.type = "button";
                tanFunctionBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                tanFunctionBtn.style = "margin-bottom: 10px !important;"
                tanFunctionBtn.onclick = () => { plt.addTan() };
                buttonRow2.appendChild(tanFunctionBtn)

                var expFunctionBtn = document.createElement("button");
                expFunctionBtn.innerText = "Exponential";
                expFunctionBtn.type = "button";
                expFunctionBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                expFunctionBtn.style = "margin-bottom: 10px !important;"
                expFunctionBtn.onclick = () => { plt.addExp() };
                buttonRow2.appendChild(expFunctionBtn)

                var recipFunctionBtn = document.createElement("button");
                recipFunctionBtn.innerText = "Reciprocal";
                recipFunctionBtn.type = "button";
                recipFunctionBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                recipFunctionBtn.style = "margin-bottom: 10px !important;"
                recipFunctionBtn.onclick = () => { plt.addReci() };
                buttonRow2.appendChild(recipFunctionBtn)

                var tangentBtn = document.createElement("button");
                tangentBtn.innerText = "Tangent";
                tangentBtn.type = "button";
                tangentBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                tangentBtn.style = "margin-bottom: 10px !important;"
                tangentBtn.onclick = () => { plt.addTangent() };
                buttonRow3.appendChild(tangentBtn)

                var nrmlBtn = document.createElement("button");
                nrmlBtn.innerText = "Normal";
                nrmlBtn.type = "button";
                nrmlBtn.classList = "btn btn-outline-secondary w-100 w-sm-auto mb-8pt mb-sm-0 mr-sm-16pt";
                nrmlBtn.style = "margin-bottom: 10px !important;"
                nrmlBtn.onclick = () => { plt.addNormal() };
                buttonRow3.appendChild(nrmlBtn)
            }

            var c = p.createCanvas(dims.w, dims.h)
            c.elt.addEventListener("mousedown", () => {
                plt.click();
            })

            c.elt.addEventListener("mouseup", () => {
                plt.release();
            })

            c.elt.style["margin-top"] = "10px";
            p.cursor(p.HAND);
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
        input_points,
        input_function
    }, p, update) {
        // load in the inputs
        this.p = p;
        this.update = update;

        // create canvas
        this.canv = new Coordinate_Canvas(canvasData, p, () => {});

        this.hoverPoint = null;
        this.dragPoint = null;

        this.interactive = interactive;

        this.lines = input_lines;
        this.v1 = undefined;
        this.addLn = false;
        this.line_type;

        this.points = input_points;

        this.adding_tangent = false;
        this.adding_normal = false
        this.tangent = undefined;
        this.normal = undefined;

        this.functions = input_function;

        this.update(this.out());
    }

    draw() {
        //this.tangent = undefined;
        var p = this.p;
        // Draw canvas
        this.canv.draw();

        // Reset hover point
        this.hoverPoint = null;

        //handle dragging
        var s = this.canv.snap(p.mouseX, p.mouseY)
        var mouse = this.canv.getInvPos(s.x, s.y);
        if (this.dragPoint != null) {
            if (this.interactive) {
                // dragging pointr on a line
                if (this.dragPoint == 1) {
                    this.dragLine.x1 = mouse.x;
                    this.dragLine.y1 = mouse.y;
                } else if (this.dragPoint == 2) {
                    this.dragLine.x2 = mouse.x;
                    this.dragLine.y2 = mouse.y;
                } else {
                    // dragging an actual point
                    this.dragPoint.x = mouse.x;
                    this.dragPoint.y = mouse.y;
                }
                this.update(this.out());
            }
        }

        //create copy of functions
        var func = [...this.functions];
        var tanDist = 5;
        var normDist = 5;
        // add a function if we have tangent or the normal
        if (this.adding_tangent) {
            if (this.tangent) {
                func.unshift(this.tangent)
            }
        }
        if (this.adding_normal) {
            if (this.normal) {
                func.unshift(this.normal)
            }
        }
        //DRAW FUNCTIONS
        for (var f of func) {
            try {
                if (f.type == "polynomial" && f.points.length == 2 && f.points[0].x == f.points[1].x) {
                    // draw a verical line if the dx is 0
                    p.strokeWeight(2);
                    p.noFill();

                    var x_val = this.canv.getPos(f.points[0].x, 0).x;
                    p.line(x_val, 0, x_val, p.height)
                } else {
                    var coef;
                    // get fuction coefficients from type
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

                    // Prepare
                    p.strokeWeight(2);
                    p.noFill();
                    p.beginShape(p.LINE);
                    var lastVal;
                    var beg = true;
                    var value = 0;
                    // loop through many points and draw the function
                    for (var i = this.canv.x_axis.start - 0.05 * this.canv.x_axis.increment; i < this.canv.x_axis.end; i += this.canv.x_axis.increment / 25) {
                        // push the last value
                        lastVal = value;
                        value = 0;

                        // interpret the coefficients and calculate the values
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
                        // if function if reci or tan and the derivative is extremely high
                        if (Math.abs(lastVal - value) > p.height / 10 && (f.type == "tan" || f.type == "reci")) {
                            // end shape and start it again later
                            beg = false;
                            p.endShape();
                        } else {
                            // start the shape if it ended
                            if (!beg) {
                                p.beginShape(p.LINE);
                                beg = true;
                            }
                            // add the vertex for the shape
                            p.vertex(pos.x, pos.y);

                            //if we are adding a tangent and we are close
                            if (this.adding_tangent && p.dist(pos.x, pos.y, p.mouseX, p.mouseY) < tanDist) {
                                tanDist = p.dist(pos.x, pos.y, p.mouseX, p.mouseY);

                                if (!this.tangent ||
                                    !(this.tangent.points[0].x == f.points[0].x && // make sure that the tangent isnt snapping to itself
                                        this.tangent.points[0].y == f.points[0].y &&
                                        this.tangent.points[1].x == f.points[1].x &&
                                        this.tangent.points[1].y == f.points[1].y)) {

                                    // calculate the derivative at that point
                                    var dx = this.canv.x_axis.increment / 25;
                                    var dy = value - lastVal
                                        // create the tangent function
                                    this.tangent = {
                                        points: [{
                                            x: i - this.canv.x_axis.increment / 25,
                                            y: lastVal
                                        }, {
                                            x: i - this.canv.x_axis.increment / 25 + dx,
                                            y: lastVal + dy
                                        }],
                                        type: "polynomial"
                                    }
                                }
                            }
                            //if we are adding a normla and we are close
                            else if (this.adding_normal && p.dist(pos.x, pos.y, p.mouseX, p.mouseY) < normDist) {
                                if (!this.normal ||
                                    !(this.normal.points[0].x == f.points[0].x && // make sure that the normal isnt snapping to itself
                                        this.normal.points[0].y == f.points[0].y &&
                                        this.normal.points[1].x == f.points[1].x &&
                                        this.normal.points[1].y == f.points[1].y)) {

                                    normDist = p.dist(pos.x, pos.y, p.mouseX, p.mouseY);

                                    // calculate the derivative at that point
                                    var dx = this.canv.x_axis.increment / 25;
                                    var dy = value - lastVal

                                    // create the normal function
                                    this.normal = {
                                        points: [{
                                            x: i - this.canv.x_axis.increment / 25,
                                            y: lastVal
                                        }, {
                                            x: i - this.canv.x_axis.increment / 25 + dy,
                                            y: lastVal - dx
                                        }],
                                        type: "polynomial"
                                    }
                                }
                            }
                        }
                    }
                    p.endShape();
                }
            } catch (e) {
                try {
                    //if (p.frameCount % 100 == 0) console.log(e)

                    // if there is a problem, just draw a shape connecting the points withou calcualting the coefficitients
                    p.push();
                    p.strokeWeight(2);
                    p.stroke(255, 0, 0);
                    p.noFill();
                    p.beginShape(p.LINE);
                    // loop through all points
                    for (var poi of f.points) {
                        var pos = this.canv.getPos(poi.x, poi.y);
                        p.vertex(pos.x, pos.y);
                    }
                    p.endShape();
                    p.pop();
                } catch (error) {
                    this.adding_tangent = false;
                    this.adding_normal = false;
                }
            }

            try {
                if (this.interactive) {
                    // draw all the function point if interactive
                    for (var poi of f.points) {
                        p.push();
                        var pos = this.canv.getPos(poi.x, poi.y);

                        p.stroke(201, 45, 24)
                        p.strokeWeight(10);
                        // check for hover
                        if (p.dist(pos.x, pos.y, p.mouseX, p.mouseY) < 10 && this.hoverPoint == null && this.interactive) {
                            this.hoverPoint = f.points[f.points.indexOf(poi)];
                            p.strokeWeight(15);
                        }
                        p.point(pos.x, pos.y);
                        p.pop();
                    }
                }
            } catch (error) {
                this.adding_tangent = false;
                this.adding_normal = false;
            }
        }

        // DRAW LINES
        p.stroke(labelTextColor);
        p.fill(255, 0, 0, 64);
        p.strokeWeight(2);
        var lin = this.lines;
        /*
        if (this.v1) {
            lin = this.lines.concat([{
                x1: this.v1.x,
                y1: this.v1.y,
                x2: mouse.x,
                y2: mouse.y,
                type: this.line_type
            }])
        }*/

        // loop through all the points
        for (var l of lin) {
            // point positions
            var p1 = this.canv.getPos(l.x1, l.y1)
            var p2 = this.canv.getPos(l.x2, l.y2)

            p.push();
            p.stroke(201, 45, 24)
            p.strokeWeight(10);
            // check hover of fisrt point
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
            // check hover of second point
            if (p.dist(p2.x, p2.y, p.mouseX, p.mouseY) < 10 && this.hoverPoint == null && this.interactive) {
                this.hoverLine = l;
                this.hoverPoint = 2;
                p.strokeWeight(15);
            }
            if (this.interactive) p.point(p2.x, p2.y);
            p.pop();

            if (l.type == "dashed") {
                //get context
                const ctx = p.drawingContext;
                p.strokeWeight(3)
                    // set dashing on line
                ctx.setLineDash([20, 20]);

                p.line(p1.x, p1.y, p2.x, p2.y);

                ctx.setLineDash([10, 0]);
            } else if (l.type == "vector") {
                // draw an arrow for vectors
                this.drawArrow(p.createVector(p1.x, p1.y), p.createVector(p2.x - p1.x, p2.y - p1.y), labelTextColor)
            } else {
                // els, draw normal line
                p.line(p1.x, p1.y, p2.x, p2.y);
            }
        }

        //DRAW POINTS
        p.stroke(labelTextColor);
        // loop through all the points
        for (var poi of this.points) {
            p.push();
            p.stroke(201, 45, 24)
            p.strokeWeight(10);
            var pos = this.canv.getPos(poi.x, poi.y);
            // check for hover
            if (p.dist(pos.x, pos.y, p.mouseX, p.mouseY) < 10 && this.hoverPoint == null && this.interactive) {
                this.hoverLine = null;
                this.hoverPoint = poi;
                p.strokeWeight(15);
            }
            p.point(pos.x, pos.y);
            p.pop();
        }
    }

    click() {
        if (this.functions.length > 0) {
            // push the tangent if we are adding one
            if (this.adding_tangent) {
                this.adding_tangent = false;
                if (this.tangent) this.functions.push(this.tangent)
                this.update(this.out());
                return;
            }
            // push the normal if we are adding one
            if (this.adding_normal) {
                this.adding_normal = false;
                if (this.normal) this.functions.push(this.normal)
                this.update(this.out());
                return;
            }
        }

        var s = this.canv.snap(this.p.mouseX, this.p.mouseY)
        var m = this.canv.getInvPos(s.x, s.y);

        /*
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
        }
        // if we are adding a point
        else*/
        if (this.addPnt) {
            //push the point
            this.points.push(m)

            this.addPnt = false;
            this.update(this.out());
        } else {
            // set the dragged objects
            this.dragLine = this.hoverLine;
            this.dragPoint = this.hoverPoint;
        }
    }

    release() {
        this.dragPoint = null;
    }

    out() {
        // export
        return (
            JSON.stringify({
                points: this.points.map(x => {
                    x.x = Math.round(x.x * 1e6) / 1e6;
                    x.y = Math.round(x.y * 1e6) / 1e6;
                    return x
                }),
                lines: this.lines.map(x => {
                    x.x1 = Math.round(x.x1 * 1e6) / 1e6;
                    x.y1 = Math.round(x.y1 * 1e6) / 1e6;
                    x.x2 = Math.round(x.x2 * 1e6) / 1e6;
                    x.y2 = Math.round(x.y2 * 1e6) / 1e6;
                    return x
                }),
                functions: this.functions.map(f => {
                    try {
                        var coef;
                        var retVal = "";
                        // get fuction coefficients from type
                        switch (f.type) {
                            case "sin":
                                coef = fitSin(f.points);
                                retVal = `${Math.round(coef[0] * 1e6) / 1e6}\\sin(${Math.round(coef[1] * 1e6) / 1e6}(x+${Math.round(coef[2] * 1e6) / 1e6}))+${Math.round(coef[3] * 1e6) / 1e6}`
                                break;
                            case "tan":
                                coef = fitTan(f.points);
                                retVal = `${Math.round(coef[0] * 1e6) / 1e6}\\tan(${Math.round(coef[1] * 1e6) / 1e6}(x+${Math.round(coef[2] * 1e6) / 1e6}))+${Math.round(coef[3] * 1e6) / 1e6}`
                                break;
                            case "exp":
                                coef = fitExp(f.points);
                                retVal = `${Math.round(coef[0] * 1e6) / 1e6}^{x-${Math.round(coef[1] * 1e6) / 1e6}}`
                                break;
                            case "reci":
                                coef = fitReci(f.points);
                                retVal = `\\frac{${Math.round(coef[0] * 1e6) / 1e6}}{x+${Math.round(coef[1] * 1e6) / 1e6}} + ${Math.round(coef[2] * 1e6) / 1e6}`
                                break;
                            case "polynomial":
                                if (f.points.length == 2 && f.points[0].x == f.points[1].x) {
                                    retVal = `x=${Math.round(f.points[0].x * 1e6) / 1e6}`;
                                } else {
                                    coef = fitPoints(f.points);
                                    //coef.reverse();
                                    var maxPow = coef.length;
                                    for (var i = 1; i < maxPow; i++) {
                                        retVal += `${Math.round(coef[maxPow-i] * 1e6) / 1e6}x^{${maxPow-i}}+`
                                    }
                                    retVal += `${Math.round(coef[0] * 1e6) / 1e6}`
                                }
                                break;
                        }

                        return retVal.replaceAll("--", "+").replaceAll("+-", "-");
                    } catch (error) {
                        return "Invalid function";
                    }

                    return "Invalid function";
                })
            }))
    }

    // functions for adding normals and tangents
    addTangent() {
        this.adding_tangent = true;
        this.adding_normal = false;
    }

    addNormal() {
        this.adding_normal = true;
        this.adding_tangent = false;
    }

    addLine(lineType) {
        // add a line randomly
        this.lines.push({
            x1: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
            y1: this.p.random(Math.ceil(this.canv.y_axis.start), Math.floor(this.canv.y_axis.end)),
            x2: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
            y2: this.p.random(Math.ceil(this.canv.y_axis.start), Math.floor(this.canv.y_axis.end)),
            type: lineType
        })
        this.update(this.out());
    }

    // functions for adding differnet functions
    addPoint() {
        this.points.push({
            x: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
            y: this.p.random(Math.ceil(this.canv.y_axis.start), Math.floor(this.canv.y_axis.end))
        })
        this.update(this.out());
    }

    addFunction(points) {
        var pnt = []

        for (var i = 0; i < points; i++) {
            pnt.push({
                x: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
                y: this.p.random(Math.ceil(this.canv.y_axis.start), Math.floor(this.canv.y_axis.end))
            })
        }

        this.functions.push({
            points: pnt,
            type: "polynomial"
        })
        this.update(this.out());
    }

    addSin() {
        this.functions.push({
            points: [{
                x: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
                y: this.p.random(Math.ceil(this.canv.y_axis.start), Math.floor(this.canv.y_axis.end))
            }, {
                x: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
                y: this.p.random(Math.ceil(this.canv.y_axis.start), Math.floor(this.canv.y_axis.end))
            }],
            type: "sin"
        })
        this.update(this.out());
    }

    addTan() {
        this.functions.push({
            points: [{
                x: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
                y: this.p.random(Math.ceil(this.canv.y_axis.start), Math.floor(this.canv.y_axis.end))
            }, {
                x: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
                y: this.p.random(Math.ceil(this.canv.y_axis.start), Math.floor(this.canv.y_axis.end))
            }],
            type: "tan"
        })
        this.update(this.out());
    }

    addExp() {
        this.functions.push({
            points: [{
                x: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
                y: this.p.random(0, Math.floor(this.canv.y_axis.end))
            }],
            type: "exp"
        })
        this.update(this.out());
    }

    addReci() {
        this.functions.push({
            points: [{
                x: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
                y: this.p.random(Math.ceil(this.canv.y_axis.start), Math.floor(this.canv.y_axis.end))
            }, {
                x: this.p.random(Math.ceil(this.canv.x_axis.start), Math.floor(this.canv.x_axis.end)),
                y: this.p.random(Math.ceil(this.canv.y_axis.start), Math.floor(this.canv.y_axis.end))
            }],
            type: "reci"
        })
        this.update(this.out());
    }

    resize() {}

    clear() {
        this.points = [];
        this.lines = [];
        this.functions = [];
        this.update(this.out());
    }

    // https://p5js.org/reference/#/p5.Vector/magSq
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