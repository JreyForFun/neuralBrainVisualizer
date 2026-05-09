# 🧠 Canvas & Math Mastery Guide

This document breaks down the core concepts required to build an interactive Spatial Data Visualizer from scratch.

---

# 1. The Canvas Coordinate System

Unlike standard math graphs where `(0,0)` is in the bottom-left, the HTML5 Canvas has its origin at the **top-left**.

- **X-Axis:** Moves left to right.  
  (Increasing `x` moves a dot to the right).

- **Y-Axis:** Moves top to bottom.  
  (Increasing `y` moves a dot *down*).

## DevDocs to Read

- `CanvasRenderingContext2D`

---

# 2. The Core Math: The Distance Formula

To know if two neurons should connect, we use the Pythagorean theorem:

$$
a^2 + b^2 = c^2
$$

In our code, we translate this to find the distance between:

- Node 1 → `(x₁, y₁)`
- Node 2 → `(x₂, y₂)`

## Step-by-Step Logic

### 1. Find Horizontal Gap (dx)

```javascript
let dx = node2.x - node1.x;
```

### 2. Find Vertical Gap (dy)

```javascript
let dy = node2.y - node1.y;
```

### 3. Square and Add

```javascript
(dx * dx) + (dy * dy)
```

### 4. Find the Root

Apply `Math.sqrt()` to get the actual pixel distance.

## The Golden Equation

```javascript
let distance = Math.sqrt((dx * dx) + (dy * dy));
```

## Mathematical Form

$$
d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}
$$

## DevDocs to Read

- `Math.sqrt()`

---

# 3. The "Alpha" Math (Dynamic Fading)

We want the lines (synapses) to look like they are glowing stronger when nodes get closer together.

To do this, we calculate a dynamic opacity (**Alpha**) based on the distance.

## The Logic

If our maximum connection distance is `200px`:

- Distance = `200px` → Opacity = `0` *(Invisible)*
- Distance = `100px` → Opacity = `0.5` *(Half visible)*
- Distance = `0px` → Opacity = `1` *(Solid)*

## The Formula

$$
Opacity = 1 - \left(\frac{CurrentDistance}{MaxDistance}\right)
$$

## JavaScript

```javascript
let maxDist = 200;

let opacity = 1 - (distance / maxDist);

ctx.strokeStyle = `rgba(0, 242, 255, ${opacity})`;
```

---

# 4. Normalization (Mapping Real Data to Screen Pixels)

When you upload a JSON file, the data might have coordinates like:

```json
{
  "x": 5000,
  "y": 12000
}
```

Your screen might only be `1920px` wide.

You must "squish" the data to fit the screen **without losing the relative layout**.

## The Formula

$$
NormalizedValue = \frac{Value - Min}{Max - Min} \times ScreenSize
$$

## Example

If the highest X value in your dataset is `10,000`, and your canvas is `1,000px` wide:

```javascript
let normalizedX = (node.dataX / 10000) * canvas.width;
```

---

# 5. The State Machine (Animation Loop)

Canvas has **no memory**.

If you draw a dot and move it, it leaves a trail.

You must manage the "state" every single frame (around 60 times per second).

## The Holy Trinity of Canvas Animation

### 1. Clear

Wipe the slate clean.

```javascript
ctx.clearRect(0, 0, canvas.width, canvas.height);
```

### 2. Update

Calculate new math.

- Move X and Y positions
- Check distances
- Update velocities
- Handle interactions

```javascript
updateNodePositions();
```

### 3. Draw

Put the ink on the screen.

```javascript
drawNodesAndLines();
```

---

# Full Animation Loop

```javascript
function animate() {

    // 1. Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Update
    updateNodePositions();

    // 3. Draw
    drawNodesAndLines();

    // Loop forever
    requestAnimationFrame(animate);
}
```

## DevDocs to Read

- `window.requestAnimationFrame()`
- `arc()`
- `moveTo()`
- `lineTo()`

---

# Final Advice

Take your time reading through the DevDocs while experimenting with:

- `ctx.arc()`
- `ctx.moveTo()`
- `ctx.lineTo()`
- `ctx.stroke()`
- `ctx.fill()`

The fastest way to master Canvas is to:

1. Draw simple shapes
2. Animate them
3. Connect them with math
4. Build systems from tiny experiments

That’s how every advanced visualization engine starts.