var backgroundColor, labelTextColor;
const createCanvas = (() => {
    const node = document.getElementById('widget-container')
    const hiddenInputs = []
    const heightToWidthRatio = 5 / 8

    const updateHiddenInputs = (output) => {
        for (var i = 0; i < hiddenInputs.length; i++) {
            document.getElementById(hiddenInputs[i]).value = output[i];
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

    let canv;
    var creationData = {
        quadrants: quadrants,
        x_axis: x_axis,
        y_axis: y_axis,
        showGrid: showGrid,
        snapToGrid: snapToGrid,
        axisNumbering: axisNumbering
    }

    // Define the p5 sketch methods
    const sketch = p => {
        p.setup = () => {
            var c = p.createCanvas(dims.w, dims.h)
            c.elt.onclick = () => {
                canv.click();
            }

            canv = new Coordinate_Canvas(creationData, p, updateHiddenInputs);
        }

        p.draw = () => {
            p.clear()
            canv.draw()
        }

        p.windowResized = () => {
            p.resizeCanvas(0, 0)

            dims = {
                w: node.clientWidth,
                h: getHeightOfCanvas()
            }

            p.resizeCanvas(dims.w, dims.h)

            canv.resize()
        }
    }

    // Create the canvas and run the sketch in the html node.
    new p5(sketch, node)
})()

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