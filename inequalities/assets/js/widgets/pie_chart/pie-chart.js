const createPieChart = (() => {
    const node = document.getElementById('widget-container')
    const hiddenInputs = ["pie-chart-output-1", "pie-chart-output-2", "pie-chart-output-3", "pie-chart-output-4", "pie-chart-output-5"]
    const heightToWidthRatio = 5/8

    const getHeightOfCanvas = () => {
        const windowHeight = window.innerHeight|| document.documentElement.clientHeight|| 
		document.body.clientHeight
        const maxHeight = windowHeight * (5.5/10)

        let height = node.clientWidth * heightToWidthRatio

        if(height > maxHeight) {
            height = maxHeight
        } 

        return height
    }
    
    let dims = {
        w: node.clientWidth, 
        h: getHeightOfCanvas()
    }

    hiddenInputs.forEach(input => input.value = "null")

    const updateHiddenInputs = (output) => {
        output.forEach((segment, i) => document.getElementById(hiddenInputs[i]).value = `${segment.value}`)
    }

    let pieChart

    // Define the p5 sketch methods
    const sketch = p => {
        p.setup = () => {
            p.createCanvas(dims.w, dims.h)

            // Create the widget
            if(!(typeof pieColors === 'undefined') && pieColors !== null) {
                pieChart = new PieChart({segments, interactive, colors: pieColors}, p, updateHiddenInputs)
            } else {
                pieChart = new PieChart({segments, interactive}, p, updateHiddenInputs)
            }
        }

        p.draw = () => {
            p.clear()
            pieChart.draw()
        }

        p.windowResized = () => {
            p.resizeCanvas(0, 0)

            dims = {
                w: node.clientWidth, 
                h: getHeightOfCanvas()
            }

            p.resizeCanvas(dims.w, dims.h)

            pieChart.resize()
        }
    }

    // Create the canvas and run the sketch in the html node.
    new p5(sketch, node)
})()

class PieChart {
    /**
     * Instantiate a pie chart
     * @param inputs 
     * Inputs: 
     * - Segments: {label, value} (value >= 10 degrees)
     * - Interactive: can the angles be adjusted?
     * - Colors (optional): The colors for each corresponding segment
     * @param {p5} p The p5.js sketch object
     */
    constructor({segments, interactive, colors = ["#00ACED", "#F26363", "#69B516", "#FF8F41", "#A659FF"]}, p, updateHiddenInputs) {
        this.segments = [...segments]
        this.output = [...segments]

        this.colors = colors
        this.interactive = interactive
        this.p = p // Reference to the p5 sketch

        this.updateHiddenInputs = updateHiddenInputs

        // Check if the segments add up to 360 degrees
        const totalAngle = segments.map(segment => segment.value).reduce((acc, curr) => acc + curr, 0)
        if(totalAngle != 360) console.error("Error: The angles passed to the pie chart do not total to 360 degrees. The angles will be adjusted to make up 360 degrees.")

        // Set the center of the pie chart
        this.middle = this.p.createVector(this.p.width / 3, this.p.height / 2)

        // The diameter of the pie chart, 80% of the height of the sketch
        this.d = this.p.height * 0.8

        // The top left of the area where the keys/labels will be displayed
        this.keyStart = this.p.createVector(this.middle.x + this.d / 2 * 1.25, this.middle.y - this.d / 2)

        let lastAngle = 0

        // Create all of the points in the pie chart
        this.points = segments.map((segment, i) => {
            const point = new Point(
                interactive, 
                this.middle, 
                this.p.radians(lastAngle + segment.value), 
                this.d, 
                // The size of the draggable circles 
				17, 
                p, 
                (angle) => this.isBetweenNeighbors(i, angle), 
                () => this.otherPointIsDragging(i),
            )
            // Start the next segment at the end of this one
            lastAngle += segment.value
            return point
        })
    }

    resize() {
        // Set the center of the pie chart
        this.middle = this.p.createVector(this.p.width / 3, this.p.height / 2)

        // The diameter of the pie chart, 80% of the height of the sketch
        this.d = this.p.height * 0.8

        // The top left of the area where the keys/labels will be displayed
        this.keyStart = this.p.createVector(this.middle.x + this.d / 2 * 1.25, this.middle.y - this.d / 2)

        let lastAngle = 0

        // Create all of the points in the pie chart
        this.points = this.output.map((segment, i) => {
            const point = new Point(
                interactive, 
                this.middle, 
                this.p.radians(lastAngle + segment.value), 
                this.d, 
                12, 
                this.p, 
                (angle) => this.isBetweenNeighbors(i, angle), 
                () => this.otherPointIsDragging(i),
            )
            // Start the next segment at the end of this one
            lastAngle += segment.value
            return point
        })
    }

    getOutput() {
        return this.output
    }

    /**
     * @param {int} i The index of the given point 
     * @returns {boolean} Whether or not another point is actively being dragged
     */
    otherPointIsDragging(i) {
        return this.points.map(point => point.dragged).includes(true)
    }

    draw() {
        this.drawChart()

        // Reset the cursor to default
        this.p.cursor('default')

        // Draw all of the points as long as the widget is interactive
        if(this.interactive) this.points.forEach(point => point.draw())
    }

    drawChart() {
        const TEXT_SIZE = this.p.constrain((12/300) * this.p.height, 12, 24)

        // Responsively size the text
        this.p.textSize(TEXT_SIZE)

        this.p.noStroke()

        // Draw the segments of the pie chart
        for(let i = 0; i <= this.points.length; i++) {
            const currentAngle = this.points[i % this.points.length].angle
            const nextAngle = this.points[(i + 1) % this.points.length].angle

            this.p.fill(this.colors[(i + 1) % this.points.length])

            // Draw the current arc
            this.p.arc(
                this.middle.x,
                this.middle.y,
                this.d,
                this.d,
                currentAngle,
                nextAngle
            )
        }

        // How far along the radius of the circle to show the angles
        const lengthOfRadius = 0.6

        // Configure the drawing mode for text
        this.p.noStroke()
        this.p.fill(0)
        this.p.textAlign(this.p.CENTER, this.p.CENTER)

        // Draw the angles within the segments of the pie chart
        for(let i = 0; i <= this.points.length; i++) {
            const currentAngle = this.points[i % this.points.length].angle
            const nextAngle = this.points[(i + 1) % this.points.length].angle

            let angleDegrees, middleAngle

            // Find the current angle measure in degrees
            // and find the angle of the pie chart at which to show the angle measure
            if(currentAngle > nextAngle) {
                angleDegrees = this.p.round(this.p.abs(this.p.degrees(this.p.TWO_PI - currentAngle + nextAngle)))
                middleAngle = (this.p.TWO_PI + currentAngle + nextAngle) / 2
            } else {
                angleDegrees = this.p.round(this.p.abs(this.p.degrees(currentAngle - nextAngle)))
                middleAngle = (currentAngle + nextAngle) / 2
            }
            
            // Update the output of the pie chart
            this.output[(i + 1) % this.points.length].value = angleDegrees 

            // Update the hidden inputs with the outputs
            this.updateHiddenInputs(this.output)

            // Find the cartesian point (from polar coordinates) at which to show the angle measure
            const anglePoint = this.p.createVector(this.d / 2 * lengthOfRadius * this.p.cos(middleAngle), 
                                                   this.d / 2 * lengthOfRadius * this.p.sin(middleAngle)).add(this.middle)

            // Draw the angle measure to the screen
            this.p.text(angleDegrees + "°", anglePoint.x, anglePoint.y)
        }

        // Set the size of the colored circles
        const circleDiameter = this.p.textSize()

        // Determine the gaps between the labels and circles
        const xGap = circleDiameter / 3
        const yGap = this.p.textSize() * (3/4)

        this.p.noStroke()

        // The start y position for each line
        let startLine = this.keyStart.y + this.p.textSize() / 2

        // Draw the pie segment labels
        for(let i = 0; i < this.segments.length; i++) {
            // Draw the circle
            this.p.fill(this.colors[i])
            this.p.circle(this.keyStart.x - xGap, startLine - this.p.textSize() / 12, circleDiameter)

            // Style the text
            this.p.fill(0)

            const text = this.segments[i].label

            const xStart = this.keyStart.x + xGap

            // Draw the text
            if(xStart + this.p.textWidth(text) < this.p.width) {
                this.p.textAlign(this.p.LEFT, this.p.CENTER)

                this.p.text(text, xStart, startLine)

                startLine += this.p.textSize() + yGap
            } else { // Wrap the text if it overflows on the x axis
                const maxWidth = this.p.abs(this.p.width - xStart)
                const maxHeight = (this.p.textLeading()) * this.p.ceil(this.p.textWidth(text) / maxWidth) 

                // Draw a text box that wraps the text
                this.p.rectMode(this.p.CORNER)
                this.p.textAlign(this.p.LEFT, this.p.TOP)
                this.p.text(text, xStart, startLine - this.p.textSize() / 2, maxWidth, maxHeight)

                startLine += maxHeight + yGap
            }

        }
    }

    /**
     * For a given point, calculates if the desired new angle
     * is between its neighboring angles.
     * @param {int} i The index in `this.points` of the point
     * @param {Number} angle The desired angle, in radians
     * @returns {boolean} Is this new angle a valid angle to move to
     */
    isBetweenNeighbors(i, angle) {
        // The minimum angle allowed. This way the angle measure can always be shown
        const threshold = this.p.PI / 18 // 10 degrees

        const prevAngle = this.getAngleOfPoint(i - 1)
        const nextAngle = this.getAngleOfPoint(i + 1)

        // Track whether or not this is a valid angle to move to
        let isValid = false

        // Check if the angle is between the neighboring angles
        if(this.points.length > 2) {
            // Edge case for if the angle crosses 0/2pi
            if(nextAngle < prevAngle) {
                if(angle < nextAngle) isValid = true
                else if(angle > prevAngle) isValid = true
                else isValid = false
            } else {
                isValid = angle > prevAngle && angle < nextAngle
            }
        } else { // If there are only two angles, this is valid
            isValid = true
        }

        // Check if this angle is at least `threshold` away from the neighboring angles
        if(this.p.abs(angle - prevAngle) <= threshold || this.p.abs(angle - nextAngle) <= threshold) {
            isValid = false
        }

        let angleValue

        // Find the total angle of the previous segment
        if(prevAngle > angle) {
            angleValue = this.p.abs(this.p.TWO_PI - prevAngle + angle)
        } else {
            angleValue = this.p.abs(prevAngle - angle)
        }

        // Check if this will shrink the previous segment to less than `threshold`
        if(angleValue <= threshold) isValid = false

        return isValid
    }

    /**
     * @param {int} i The index of the given point
     * @returns {Number} The angle at the point 
     *                   (this accounts for looping backwards through the points)
     */
    getAngleOfPoint(i) {
        let _i = i
        if(_i < 0) _i = this.points.length - 1
        if(_i == this.points.length) _i = 0
        
        return this.points[_i].angle
    }
} 

class Point {
    constructor(interactive, middle, angle, diameter, r, p, isBetweenNeighbors, otherPointIsDragging) {
        this.interactive = interactive
        this.middle = middle
        this.angle = angle
        this.radius = diameter / 2 // Radius of the pie chart
        this.r = r // Radius of this circle
        this.p = p // Reference to the p5 sketch
        this.dragged = false
        this.isBetweenNeighbors = isBetweenNeighbors
        this.otherPointIsDragging = otherPointIsDragging
    }

    draw() {
        // Draw a black border around the points
        this.p.stroke(0)
        this.p.strokeWeight(1)

        // Get the position of the point relative to the center of the pie chart
        const cartesian = this.getCartesian().add(this.middle)

        // Check if this point is being pressed by the mouse
        this.pressed(cartesian)

        if(this.dragged) {
            // Darken the circle if it is being dragged
            this.p.fill(200)

            // Set the cursor to grab
            this.p.cursor('grab')

            const mouseAngle = this.getMouseAngle()

            // Set this point to the angle of the mouse if
            // that new angle is a valid one
            if(this.isBetweenNeighbors(mouseAngle)) this.angle = mouseAngle
        } else {
            this.p.fill(255)
        }

        // Draw the point
        this.p.circle(cartesian.x, cartesian.y, this.r)
    }

    pressed(cartesian) {
        const mousePosition = this.p.createVector(this.p.mouseX, this.p.mouseY)

        // Update the state of this point
        if(this.p.mouseIsPressed && mousePosition.dist(cartesian) <= this.r && !this.otherPointIsDragging()) {
            // Let this point be dragged if the mouse is pressed on this point
            // and no other points are actively being dragged
            this.dragged = true 
        } else if(this.dragged && this.p.mouseIsPressed){
            // Continue dragging if the mouse is pressed
            this.dragged = true
        } else {
            this.dragged = false

            if(mousePosition.dist(cartesian) <= this.r && !this.otherPointIsDragging()) {
                this.p.cursor('pointer')
            }
        }
    }

    /**
     * @returns {p5.Vector} The angle and radius (polar coordinates) of this point
     *                      converted to cartesian coordinates
     */
    getCartesian() {
        return this.p.createVector(this.radius * this.p.cos(this.angle), this.radius * this.p.sin(this.angle))
    }

    /**
     * @returns {Number} The mouse angle (radians) converted from the mouse position
     */
    getMouseAngle() {
        let angle = this.p.atan2(this.p.mouseY - this.middle.y, this.p.mouseX - this.middle.x)
        if(angle < 0) angle = this.p.TWO_PI - this.p.abs(angle)
        return angle
    }
}