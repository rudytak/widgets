var backgroundColor, labelTextColor;
const createVennDiagram = (() => {
    const node = document.getElementById('widget-container')
    const hiddenInputs = ["venn-diagram-segment-1", "venn-diagram-segment-2", "venn-diagram-segment-3", "venn-diagram-segment-4"]
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

    let venn;
    var creationData = { labels: labels, values: values, interactive: interactive, colors: colors, coloredSegments: coloredRegions };

    // Define the p5 sketch methods
    const sketch = p => {
        p.setup = () => {
            var c = p.createCanvas(dims.w, dims.h)
            c.elt.onclick = () => {
                venn.click();
            }

            venn = new VennDiagram(creationData, p, updateHiddenInputs);
        }

        p.draw = () => {
            p.clear()
            venn.draw()
        }

        p.windowResized = () => {
            p.resizeCanvas(0, 0)

            dims = {
                w: node.clientWidth,
                h: getHeightOfCanvas()
            }

            p.resizeCanvas(dims.w, dims.h)

            venn.resize()
        }
    }

    // Create the canvas and run the sketch in the html node.
    new p5(sketch, node)
})()

class VennDiagram {
    constructor({ labels, values, interactive, colors, coloredSegments }, p, update) {
        this.p = p;
        this.update = update;

        this.labels = [...labels];
        this.values = [...values];
        this.interactive = interactive;

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
        }

        this.colorStack = colors;
        this.colorID = 0;
        this.segmentColors = [undefined, undefined, undefined, undefined];

        for (var sc = 0; sc < coloredSegments.length; sc++) {
            if (coloredSegments[sc]) {
                this.segmentColors[sc] = this.colorStack[this.colorID];
                this.colorID++;
            }
        }

        this.update(this.out());
    }

    draw() {
        var p = this.p;
        var bg = backgroundColor;

        p.push();

        // Draw the fills
        if (this.interactive) {
            p.noStroke();

            if (this.segmentColors[3]) p.background(this.segmentColors[3]);
            else p.background(bg)

            // Fill of first circle
            if (this.segmentColors[0]) {
                p.fill(this.segmentColors[0]);
                p.ellipse(p.width / 4, p.height / 2, p.width / 3);
            } else {
                p.fill(bg);
                p.ellipse(p.width / 4, p.height / 2, p.width / 3);
            }

            // Fill of second circle
            if (this.segmentColors[1]) {
                p.fill(this.segmentColors[1]);
                p.ellipse(p.width / 2, p.height / 2, p.width / 3);
            } else {
                p.fill(bg);
                p.ellipse(p.width / 2, p.height / 2, p.width / 3);
            }

            //Draw the value 3 fill
            if (this.segmentColors[2]) {
                p.fill(this.segmentColors[2]);

                p.arc(p.width / 4, p.height / 2, p.width / 3, p.width / 3, -0.725, 0.725, p.OPEN);
                p.arc(p.width / 2, p.height / 2, p.width / 3, p.width / 3, -p.PI - 0.725, -p.PI + 0.725, p.OPEN);
            } else {
                p.fill(bg);
                p.arc(p.width / 4, p.height / 2, p.width / 3, p.width / 3, -0.725, 0.725, p.OPEN);
                p.arc(p.width / 2, p.height / 2, p.width / 3, p.width / 3, -p.PI - 0.725, -p.PI + 0.725, p.OPEN);
            }
        }

        p.stroke(0);
        p.strokeWeight(5 * p.width / 1000);
        p.noFill();

        // Draw circles
        p.ellipse(p.width / 4, p.height / 2, p.width / 3);
        p.ellipse(p.width / 2, p.height / 2, p.width / 3);

        p.fill(labelTextColor)
        p.noStroke();
        p.textSize(42 * p.width / 1000);
        p.textAlign(p.CENTER, p.CENTER);

        // Draw all the labels 
        // A for loop is unnecessary, because we have to set the position
        if (this.labels[0]) p.text(this.labels[0], p.width / 4, p.height / 3.25)
        if (this.labels[1]) p.text(this.labels[1], p.width / 2, p.height / 3.25)
        if (this.labels[2]) p.text(this.labels[2], p.width / 1.25, p.height / 3.25)

        // Draw all the values 
        // A for loop is unnecessary, because we have to set the position
        if (this.values[0]) {
            if (!this.values[0].type) p.text(this.values[0], p.width / 4, p.height / 2)
            else {
                p.text(this.values[0].numerator, p.width / 4, p.height / 2 - 32 * p.width / 1000);
                p.text(this.values[0].denominator, p.width / 4, p.height / 2 + 32 * p.width / 1000);

                p.push();
                p.stroke(labelTextColor);
                p.strokeWeight(2 * p.width / 1000);
                var wid = p.max(p.textWidth(this.values[0].numerator), p.textWidth(this.values[0].denominator));
                p.line(p.width / 4 - wid / 2, p.height / 2, p.width / 4 + wid / 2, p.height / 2);
                p.pop();
            }
        }
        if (this.values[1]) {
            if (!this.values[1].type) p.text(this.values[1], p.width / 2, p.height / 2)
            else {
                p.text(this.values[1].numerator, p.width / 2, p.height / 2 - 32 * p.width / 1000);
                p.text(this.values[1].denominator, p.width / 2, p.height / 2 + 32 * p.width / 1000);

                p.push();
                p.stroke(labelTextColor);
                p.strokeWeight(2 * p.width / 1000);
                var wid = p.max(p.textWidth(this.values[1].numerator), p.textWidth(this.values[1].denominator));
                p.line(p.width / 2 - wid / 2, p.height / 2, p.width / 2 + wid / 2, p.height / 2);
                p.pop();
            }
        }
        if (this.values[2]) {
            if (!this.values[2].type) p.text(this.values[2], 3 * p.width / 8, p.height / 2)
            else {
                p.text(this.values[2].numerator, 3 * p.width / 8, p.height / 2 - 32 * p.width / 1000);
                p.text(this.values[2].denominator, 3 * p.width / 8, p.height / 2 + 32 * p.width / 1000);

                p.push();
                p.stroke(labelTextColor);
                p.strokeWeight(2 * p.width / 1000);
                var wid = p.max(p.textWidth(this.values[2].numerator), p.textWidth(this.values[2].denominator));
                p.line(3 * p.width / 8 - wid / 2, p.height / 2, 3 * p.width / 8 + wid / 2, p.height / 2);
                p.pop();
            }
        }
        if (this.values[3]) {
            if (!this.values[3].type) p.text(this.values[3], p.width / 1.25, p.height / 2)
            else {
                p.text(this.values[3].numerator, p.width / 1.25, p.height / 2 - 32 * p.width / 1000);
                p.text(this.values[3].denominator, p.width / 1.25, p.height / 2 + 32 * p.width / 1000);

                p.push();
                p.stroke(labelTextColor);
                p.strokeWeight(2 * p.width / 1000);
                var wid = p.max(p.textWidth(this.values[3].numerator), p.textWidth(this.values[3].denominator));
                p.line(p.width / 1.25 - wid / 2, p.height / 2, p.width / 1.25 + wid / 2, p.height / 2);
                p.pop();
            }
        }

        /*
        if (this.interactive && this.colorID != this.colorStack.length) {
            p.stroke(0);
            p.strokeWeight(1);
            p.fill(this.colorStack[this.colorID]);

            p.ellipse(10, 10, 15, 15);
        }*/

        p.pop();
    }

    click() {
        if (this.interactive) {
            var p = this.p;

            var continueInStack = true;

            // In first circle
            var inCircle1 = (p.dist(p.mouseX, p.mouseY, p.width / 4, p.height / 2) < p.width / 6);
            var inCircle2 = (p.dist(p.mouseX, p.mouseY, p.width / 2, p.height / 2) < p.width / 6);

            if (inCircle1 && inCircle2) {
                if (!this.segmentColors[2]) this.segmentColors[2] = this.colorStack[this.colorID];
                else {
                    this.colorStack.push(this.segmentColors[2]);
                    this.segmentColors[2] = undefined;
                    continueInStack = false;
                }
            } else if (inCircle1) {
                if (!this.segmentColors[0]) this.segmentColors[0] = this.colorStack[this.colorID];
                else {
                    this.colorStack.push(this.segmentColors[0]);
                    this.segmentColors[0] = undefined;
                    continueInStack = false;
                }
            } else if (inCircle2) {
                if (!this.segmentColors[1]) this.segmentColors[1] = this.colorStack[this.colorID];
                else {
                    this.colorStack.push(this.segmentColors[1]);
                    this.segmentColors[1] = undefined;
                    continueInStack = false;
                }
            } else {
                if (!this.segmentColors[3]) this.segmentColors[3] = this.colorStack[this.colorID];
                else {
                    this.colorStack.push(this.segmentColors[3]);
                    this.segmentColors[3] = undefined;
                    continueInStack = false;
                }
            }

            if (continueInStack) this.colorID = p.constrain(this.colorID + 1, 0, this.colorStack.length);

            this.update(this.out());
        }
    }

    out() {
        return this.segmentColors.map((x) => !!x);
    }

    resize() {}
}