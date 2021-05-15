var backgroundColor, labelTextColor;
const createCanvas = (() => {
    const node = document.getElementById('widget-container')
    const hiddenInputs = []
    const heightToWidthRatio = 6.5 / 8

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
        const maxHeight = windowHeight * (7 / 10)

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