# 🛠️ Neural Visualizer: Commands & Methods Cheat Sheet

## 1. Canvas Drawing Methods (The Pen)
These are the built-in JavaScript commands we use to actually draw on the screen.

*   `canvas.getContext('2d')`: Grabs the 2D drawing tools. 
*   `ctx.clearRect(x, y, width, height)`: Erases a rectangular area.
*   `ctx.beginPath()`: Starts a new drawing path.
*   `ctx.arc(x, y, radius, startAngle, endAngle)`: Draws a circle.
*   `ctx.moveTo(x, y)`: Lifts the pen and moves it to a new spot.
*   `ctx.lineTo(x, y)`: Drags the pen to a new spot, creating a line.
*   `ctx.stroke()`: Inks the lines you just traced.
*   `ctx.fill()`: Fills in the shape you just drew with color.

## 2. The Math & Logic (The Brains)
How we figure out where things go and if they should connect.

*   `Math.random()`: Generates a random decimal between 0 and 1.
*   `dx = x2 - x1` and `dy = y2 - y1`: Finds the difference between two points on the X and Y axis.
*   `Math.sqrt((dx * dx) + (dy * dy))`: The Pythagorean theorem to find the exact distance between two dots.

## 3. The Animation Loop (The Heartbeat)
*   `requestAnimationFrame(functionName)`: Tells the browser to run your animation function for the next frame.