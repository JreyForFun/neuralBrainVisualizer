# Neural Map — `script.js` Comprehensive Learning Guide

> **How to use this guide:** Read each section slowly. Before moving to the next TODO,
> make sure you can answer the challenge question at the end of each one.
> Try modifying the code yourself — breaking things is how you learn.

---

## Table of Contents

1. [The Big Picture](#the-big-picture)
2. [TODO 1 — Canvas Setup](#todo-1--canvas-setup)
3. [TODO 2 — UI Element References](#todo-2--ui-element-references)
4. [TODO 3 — Drag & Drop Logic](#todo-3--drag--drop-logic)
5. [TODO 4 — Data Initialization](#todo-4--data-initialization)
6. [TODO 5 — Showing Node Details](#todo-5--showing-node-details)
7. [TODO 6 — Mouse Tracking](#todo-6--mouse-tracking)
8. [TODO 7 — Drawing the Canvas](#todo-7--drawing-the-canvas)
9. [TODO 8 — The Animation Loop](#todo-8--the-animation-loop)
10. [TODO 9 — Window Resize Handling](#todo-9--window-resize-handling)
11. [How It All Connects](#how-it-all-connects)
12. [What the JSON Data Should Look Like](#what-the-json-data-should-look-like)
13. [Common Mistakes & Debugging Tips](#common-mistakes--debugging-tips)
14. [Challenges to Extend the Project](#challenges-to-extend-the-project)

---

## The Big Picture

Before reading line by line, understand what this app *does*:

1. The user opens the page and sees a **drop zone**
2. They drag and drop a `.json` file onto it
3. The JSON contains **nodes** (objects with x, y coordinates and labels)
4. The app switches to a **dashboard** that shows:
   - A canvas with animated glowing dots (nodes) connected by lines (synapses)
   - A sidebar listing all node names
   - An inspector panel that shows a node's details on hover

Think of it like a neural network visualizer — dots are neurons, lines are connections.

```
[ Drop Screen ] --drop JSON--> [ Dashboard ]
                                    |
                            [ Canvas (dots + lines) ]
                            [ Sidebar (node list)   ]
                            [ Inspector (node info) ]
```

---

## TODO 1 — Canvas Setup

```js
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
```

### What is a `<canvas>`?

A `<canvas>` is an HTML element that acts like a blank whiteboard. By itself it
does nothing — you need JavaScript to draw on it.

### What is `ctx`?

`ctx` stands for **context**. It is the object that holds all the drawing tools
(methods and properties). You get it by calling `getContext('2d')`, which means
you want a 2D drawing context (as opposed to `'webgl'` for 3D).

Think of it this way:
- `canvas` = the whiteboard
- `ctx` = the marker in your hand

### Setting width and height

```js
canvas.width = window.innerWidth;   // full browser width in pixels
canvas.height = window.innerHeight; // full browser height in pixels
```

`window.innerWidth` and `window.innerHeight` are built-in browser properties
that give you the visible area of the browser window.

> **Important:** Setting width/height via JavaScript is NOT the same as CSS.
> CSS stretches the canvas visually. JS sets the actual pixel resolution.
> Always set dimensions in JS, not CSS, for a canvas that draws correctly.

### Key `ctx` drawing methods you'll see later

| Method / Property       | What it does                                      |
|-------------------------|---------------------------------------------------|
| `ctx.clearRect()`       | Erases a rectangle area (used to wipe the canvas) |
| `ctx.beginPath()`       | Starts a new drawing path                         |
| `ctx.moveTo(x, y)`      | Lifts the pen and moves to a point                |
| `ctx.lineTo(x, y)`      | Draws a line from current point to (x, y)         |
| `ctx.arc(x, y, r, ...`  | Draws a circle at (x,y) with radius r             |
| `ctx.stroke()`          | Renders the outline of the current path           |
| `ctx.fill()`            | Fills the current path with a color               |
| `ctx.strokeStyle`       | Color/style of outlines                           |
| `ctx.fillStyle`         | Color/style of fills                              |
| `ctx.shadowBlur`        | Blur amount of the glow effect                    |
| `ctx.shadowColor`       | Color of the glow effect                          |
| `ctx.lineWidth`         | Thickness of lines                                |

### Challenge

> Why is `ctx` declared with `const` even though you draw on it repeatedly?
> Does drawing change what `ctx` IS, or just what it DOES?

---

## TODO 2 — UI Element References

```js
const dropScreen    = document.getElementById('drop-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const fileInput     = document.getElementById('data-input');
const nodeList      = document.getElementById('node-list');
const nodeDetails   = document.getElementById('node-details');

let neurons = [];
let mouse = { x: 0, y: 0 };
```

### `document.getElementById()`

This grabs an HTML element using its `id` attribute. It returns the actual
DOM element object, which you can then manipulate with JavaScript.

```html
<!-- In HTML -->
<div id="drop-screen"> ... </div>

<!-- In JS -->
const dropScreen = document.getElementById('drop-screen');
// dropScreen is now a reference to that div
```

### The variables and what they hold

| Variable          | Type          | Purpose                                         |
|-------------------|---------------|-------------------------------------------------|
| `dropScreen`      | DOM Element   | The initial drop zone screen                    |
| `dashboardScreen` | DOM Element   | The main app screen shown after file load       |
| `fileInput`       | DOM Element   | A hidden `<input type="file">` (not used in DnD)|
| `nodeList`        | DOM Element   | The `<ul>` sidebar list of node names           |
| `nodeDetails`     | DOM Element   | The `<div>` inspector panel on the right        |
| `neurons`         | Array         | Stores ALL the node objects from the JSON       |
| `mouse`           | Object        | Tracks the cursor's current x and y position   |

### Why `let` for `neurons` and `mouse`?

`neurons` is declared with `let` because its value will be **replaced** when
data loads. `mouse` is `let` because its `x` and `y` values change constantly.

`const` variables cannot be reassigned. `let` ones can.

```js
// This would FAIL if neurons was const:
neurons = data; // reassigning the whole array
```

### Challenge

> `mouse` is initialized as `{ x: 0, y: 0 }`. Why does the code need to
> track the mouse position in a variable instead of reading it directly
> inside `drawNeurons()`?

---

## TODO 3 — Drag & Drop Logic

```js
window.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropScreen.classList.add('dragover');
});

window.addEventListener('dragleave', () => {
    dropScreen.classList.remove('dragover');
});

window.addEventListener('drop', (e) => {
    e.preventDefault();
    dropScreen.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = JSON.parse(event.target.result);
            initializeMap(data);
        };
        reader.readAsText(file);
    } else {
        alert("Please drop a valid .json file.");
    }
});
```

### `addEventListener(event, callback)`

This is how JavaScript listens for user actions.

- First argument: the event name (`'dragover'`, `'drop'`, `'click'`, etc.)
- Second argument: a **callback function** — code that runs when the event fires

```js
window.addEventListener('dragover', (e) => {
    // 'e' is the Event object — it carries info about what happened
});
```

### The three drag events

#### `dragover`

Fires **continuously** while a file is being dragged over the window.

```js
e.preventDefault();
```

This is **critical**. By default, browsers block file drops. Calling
`preventDefault()` on the `dragover` event tells the browser:
"I'm handling this myself, don't do the default thing."

Without this line, the `drop` event will never fire.

```js
dropScreen.classList.add('dragover');
```

`classList` is a DOM property that lets you add, remove, or toggle CSS classes.
Adding `'dragover'` applies a CSS rule (probably a glowing border) to give
visual feedback that a file is being hovered.

#### `dragleave`

Fires when the file is dragged back out of the window. Removes the visual
highlight by removing the `'dragover'` class.

#### `drop`

This is the main event. Here's what happens step by step:

```js
e.preventDefault();  // Again, prevent browser's default file-open behavior
dropScreen.classList.remove('dragover');  // Remove the highlight

const file = e.dataTransfer.files[0];
```

`e.dataTransfer.files` is a list (FileList) of all dropped files.
`[0]` gets the first one, since only one is expected.

```js
if (file && file.name.endsWith('.json')) {
```

Two checks:
1. `file` — did a file actually get dropped (not undefined)?
2. `file.name.endsWith('.json')` — is it a JSON file?

```js
const reader = new FileReader();
```

`FileReader` is a built-in Web API object that reads files from the user's
computer into memory. It works **asynchronously** — meaning it starts reading
and then calls a function when it's done.

```js
reader.onload = (event) => {
    const data = JSON.parse(event.target.result);
    initializeMap(data);
};
reader.readAsText(file);
```

- `reader.readAsText(file)` — starts reading the file as a text string
- `reader.onload` — runs AFTER reading is complete
- `event.target.result` — the file's text content as a string
- `JSON.parse(...)` — converts the JSON string into a real JavaScript object/array

The order of execution here is important:

```
reader.readAsText(file)  ← starts the async read
    ...time passes...
reader.onload fires      ← file is now in memory
    JSON.parse(...)      ← string becomes JS object
    initializeMap(data)  ← app starts
```

### Challenge

> What would happen if you called `initializeMap(data)` BEFORE `reader.readAsText(file)`
> instead of inside `reader.onload`? What would `data` be?

---

## TODO 4 — Data Initialization

```js
function initializeMap(data) {
    dropScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');

    neurons = data;

    nodeList.innerHTML = '';
    neurons.forEach(node => {
        let li = document.createElement('li');
        li.innerText = node.label;
        li.onclick = () => showDetails(node);
        nodeList.appendChild(li);
    });

    animate();
}
```

### Screen switching

```js
dropScreen.classList.add('hidden');       // hides the drop zone
dashboardScreen.classList.remove('hidden'); // shows the dashboard
```

This assumes there's a CSS class called `.hidden` that sets `display: none`.
Instead of creating/destroying elements, the app just shows/hides them using
CSS — a common and efficient pattern.

### Storing the data

```js
neurons = data;
```

The parsed JSON array gets stored in the global `neurons` variable so every
other function in the file can access it.

### Building the sidebar list dynamically

```js
nodeList.innerHTML = '';
```

Clears any existing content first (good practice in case `initializeMap` is
ever called more than once).

```js
neurons.forEach(node => {
    let li = document.createElement('li');
    li.innerText = node.label;
    li.onclick = () => showDetails(node);
    nodeList.appendChild(li);
});
```

`forEach` loops through every node object in the array.

For each one:
1. `document.createElement('li')` — creates a new `<li>` element in memory
2. `li.innerText = node.label` — sets its text to the node's label
3. `li.onclick = () => showDetails(node)` — attaches a click handler
4. `nodeList.appendChild(li)` — adds it to the `<ul>` in the actual page

> **Note on closures:** `li.onclick = () => showDetails(node)` — the arrow
> function "captures" the current `node` variable. Each `<li>` remembers its
> own node. This is called a **closure**.

### Kicking off the animation

```js
animate();
```

This is only called once here. After that, `animate` calls itself recursively
via `requestAnimationFrame`. You do NOT want to call `animate()` multiple
times, or you'll get multiple loops running simultaneously, causing visual bugs.

### Challenge

> What would happen if you removed `nodeList.innerHTML = '';` and called
> `initializeMap` twice with different data files?

---

## TODO 5 — Showing Node Details

```js
function showDetails(node) {
    nodeDetails.innerHTML = `
        <p><strong>ID:</strong> ${node.id}</p>
        <p><strong>Name:</strong> ${node.label}</p>
        <p><strong>Group:</strong> ${node.group}</p>
        <p><strong>Coordinates:</strong> X:${node.x}, Y:${node.y}</p>
    `;
}
```

### Template literals

The backtick `` ` `` syntax is a **template literal**. It allows:
- Multi-line strings (no `\n` needed)
- Embedded expressions using `${...}`

```js
const name = "Alice";
console.log(`Hello, ${name}!`); // "Hello, Alice!"
```

### `innerHTML` vs `innerText`

| Property      | What it does                                         |
|---------------|------------------------------------------------------|
| `innerText`   | Sets/gets plain text only. Ignores HTML tags.        |
| `innerHTML`   | Sets/gets raw HTML. Tags are parsed and rendered.    |

Here, `innerHTML` is used so that `<p>` and `<strong>` tags are actually
rendered as HTML, not displayed as raw text.

> **Security note:** Using `innerHTML` with user-supplied data can be
> dangerous (XSS attacks). Here it's safe because the data comes from a
> local JSON file, not from an external server or user input field.

### When is this function called?

Two places:
1. When a sidebar `<li>` is clicked → `li.onclick = () => showDetails(node)`
2. When the mouse hovers over a node on the canvas → inside `drawNeurons()`

### Challenge

> `node.group` is displayed but never used for anything else. How could you
> use it to color nodes differently based on which group they belong to?

---

## TODO 6 — Mouse Tracking

```js
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
```

### Why track mouse in a separate variable?

The canvas redraws ~60 times per second via `requestAnimationFrame`. Each
redraw reads `mouse.x` and `mouse.y` to check if the cursor is near a node.

`mousemove` fires independently, updating `mouse` whenever the cursor moves.
These two processes run at different speeds and independently — the mouse
object acts as a shared "mailbox" between them.

### `e.clientX` vs other position properties

| Property       | Relative to...                          |
|----------------|-----------------------------------------|
| `e.clientX/Y`  | The visible browser viewport            |
| `e.pageX/Y`    | The full page (including scrolled area) |
| `e.screenX/Y`  | The physical monitor screen             |

Since the canvas fills the viewport with no scrolling, `clientX/Y` is correct.

### Challenge

> The canvas nodes have fixed x, y positions loaded from the JSON.
> Those positions are in the same coordinate space as `clientX/Y`.
> What would break if you used `e.pageX` instead on a page that can scroll?

---

## TODO 7 — Drawing the Canvas

This is the heart of the app. It runs ~60 times per second.

```js
function drawNeurons() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ... draw lines ...
    // ... draw nodes ...
}
```

### Step 1 — Clear the canvas

```js
ctx.clearRect(0, 0, canvas.width, canvas.height);
```

Erases everything from the previous frame. Without this, every frame would
draw ON TOP of the previous one, leaving permanent trails.

Arguments: `clearRect(x, y, width, height)` — the rectangle to erase.
Starting at (0,0) and covering full width/height means the whole canvas.

---

### Step 2 — Draw the connection lines (synapses)

```js
for (let i = 0; i < neurons.length; i++) {
    for (let j = i + 1; j < neurons.length; j++) {
        let dx = neurons[i].x - neurons[j].x;
        let dy = neurons[i].y - neurons[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 250) {
            ctx.beginPath();
            ctx.moveTo(neurons[i].x, neurons[i].y);
            ctx.lineTo(neurons[j].x, neurons[j].y);
            ctx.strokeStyle = `rgba(0, 242, 255, ${1 - distance/250})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
}
```

#### The nested loop pattern

```
i=0: compare node[0] with node[1], node[2], node[3]...
i=1: compare node[1] with node[2], node[3]...
i=2: compare node[2] with node[3]...
```

Notice `j = i + 1`, not `j = 0`. This prevents:
- Comparing a node with itself (`i == j`)
- Drawing the same line twice (`0→1` and `1→0`)

This is called checking **unique pairs**.

#### Distance formula (Pythagorean theorem)

```js
let dx = neurons[i].x - neurons[j].x;  // horizontal difference
let dy = neurons[i].y - neurons[j].y;  // vertical difference
let distance = Math.sqrt(dx * dx + dy * dy);
```

This is the standard 2D distance formula: `d = √(Δx² + Δy²)`

Visually:
```
nodeA (x1, y1)
    |  \
    dy  \ distance (hypotenuse)
    |    \
nodeB (x2, y2) -- dx --
```

#### Fading line opacity

```js
ctx.strokeStyle = `rgba(0, 242, 255, ${1 - distance/250})`;
```

`rgba(r, g, b, alpha)` — the alpha (4th value) controls opacity (0=invisible, 1=solid).

- When `distance = 0`: alpha = `1 - 0/250 = 1.0` (fully opaque)
- When `distance = 125`: alpha = `1 - 125/250 = 0.5` (half transparent)
- When `distance = 250`: alpha = `1 - 250/250 = 0.0` (invisible)

The line fades naturally as nodes get further apart.

#### Drawing the line

```js
ctx.beginPath();           // start a new path
ctx.moveTo(x1, y1);        // move pen to node A (no line yet)
ctx.lineTo(x2, y2);        // draw line to node B
ctx.stroke();              // actually render it
```

You must call `beginPath()` before each new line, or the canvas will connect
all your lines into one continuous path.

---

### Step 3 — Draw the nodes (dots)

```js
neurons.forEach(node => {
    let dx = mouse.x - node.x;
    let dy = mouse.y - node.y;
    let distToMouse = Math.sqrt(dx * dx + dy * dy);

    ctx.beginPath();
    ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);

    if (distToMouse < 15) {
        ctx.fillStyle = '#ff007b';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff007b';
        showDetails(node);
    } else {
        ctx.fillStyle = '#00f2ff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f2ff';
    }

    ctx.fill();
    ctx.shadowBlur = 0;
});
```

#### Hover detection

The same distance formula checks if the mouse is within 15 pixels of a node.
If yes → highlight it pink and update the inspector panel.

#### `ctx.arc(x, y, radius, startAngle, endAngle)`

Draws a circle:
- `x, y` — center point
- `6` — radius in pixels
- `0` — start angle (0 = rightmost point of the circle)
- `Math.PI * 2` — end angle (full circle = 2π radians = 360°)

#### The glow effect

```js
ctx.shadowBlur = 20;
ctx.shadowColor = '#ff007b';
```

`shadowBlur` and `shadowColor` on the canvas context add a CSS-like glow
around anything drawn. This affects ALL subsequent draw calls on `ctx`.

#### Why `ctx.shadowBlur = 0` at the end?

```js
ctx.fill();
ctx.shadowBlur = 0; // ← THIS IS CRITICAL
```

Canvas state is **persistent**. If you set `shadowBlur = 20` and don't reset
it, every draw call after (including the connection lines in the next frame)
will also have that glow. Resetting to 0 after each node keeps the effect
isolated to just the dots.

This is a very common canvas bug for beginners — forgetting to reset state.

### Challenge

> The nodes are drawn AFTER the lines. What would happen visually if you
> drew the nodes FIRST and then the lines? Try mentally picturing it,
> then try it in code.

---

## TODO 8 — The Animation Loop

```js
function animate() {
    drawNeurons();
    requestAnimationFrame(animate);
}
```

### How `requestAnimationFrame` works

`requestAnimationFrame(callback)` tells the browser:
"Before you paint the next screen frame, call this function."

The browser calls your function ~60 times per second (synced to the
monitor refresh rate, usually 60Hz). This creates smooth animation.

### Why not use `setInterval`?

You could write:
```js
setInterval(drawNeurons, 16); // roughly 60fps
```

But `requestAnimationFrame` is better because:
- It **pauses automatically** when the tab is hidden (saves CPU/battery)
- It syncs with the **display refresh rate** (smoother, no tearing)
- It avoids **timing drift** that can happen with `setInterval`

### The recursive pattern

```
animate() called once by initializeMap()
  → drawNeurons()
  → requestAnimationFrame(animate)   ← schedules NEXT call
      → drawNeurons()
      → requestAnimationFrame(animate)
          → ... forever
```

`animate` never actually calls itself directly — `requestAnimationFrame`
schedules the next call. This is NOT infinite recursion; it's a managed loop.

### Challenge

> What would happen if `animate()` was called a second time while it was
> already running (for example, if the user dropped a second file)?
> How would you prevent that?

---

## TODO 9 — Window Resize Handling

```js
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
```

### Why this is needed

When the browser window is resized, the canvas does NOT automatically resize.
This event listener re-sets the canvas dimensions to match the new window size.

### A hidden side effect

**Resizing the canvas clears it entirely.** Setting `canvas.width` or
`canvas.height` resets the canvas to a blank state, even if you set it to
the same value. This is fine here because `animate()` is already looping and
will redraw everything on the very next frame (~16ms later).

### What this does NOT fix

The node positions (`node.x`, `node.y`) are fixed values from the JSON file.
They were designed for a specific screen size. If you resize the window
dramatically, nodes might cluster in one corner or fall outside the viewport.

A more advanced solution would **remap** node coordinates proportionally when
resizing. That's a good future challenge.

### Challenge

> How would you scale node positions when the window resizes?
> Think about the ratio: `newX = node.x * (newWidth / oldWidth)`.
> Where would you store `oldWidth` to calculate this?

---

## How It All Connects

Here is the complete flow from start to finish:

```
PAGE LOADS
│
├── Canvas is set up (width, height, ctx)
├── UI elements are grabbed from the DOM
├── Global variables initialized (neurons=[], mouse={x,y})
│
USER DRAGS A FILE
│
├── dragover fires  → add 'dragover' class (visual highlight)
├── dragleave fires → remove 'dragover' class
├── drop fires      → FileReader reads the file
│
FILE IS PARSED
│
└── initializeMap(data) is called
    ├── Swap screens (hide drop, show dashboard)
    ├── Store data in neurons[]
    ├── Build <li> elements for sidebar
    └── Call animate() → starts the loop
            │
            └── EVERY ~16ms:
                ├── clearRect() wipes the canvas
                ├── Nested loop draws fading lines between close nodes
                └── forEach draws each glowing dot
                    └── If mouse is within 15px → highlight + showDetails()

USER MOVES MOUSE
│
└── mousemove fires → updates mouse.x and mouse.y
    (read by drawNeurons on next frame)

USER CLICKS SIDEBAR ITEM
│
└── showDetails(node) → updates innerHTML of inspector panel
```

---

## What the JSON Data Should Look Like

The app expects an **array of node objects**. Each node needs:

```json
[
    {
        "id": 1,
        "label": "Alpha Node",
        "group": "A",
        "x": 300,
        "y": 200
    },
    {
        "id": 2,
        "label": "Beta Node",
        "group": "B",
        "x": 500,
        "y": 400
    },
    {
        "id": 3,
        "label": "Gamma Node",
        "group": "A",
        "x": 700,
        "y": 150
    }
]
```

| Field   | Type   | Used for                                      |
|---------|--------|-----------------------------------------------|
| `id`    | number | Displayed in the inspector panel              |
| `label` | string | Displayed in sidebar list and inspector panel |
| `group` | string | Displayed in inspector panel (not yet used for logic) |
| `x`     | number | Horizontal position on canvas                 |
| `y`     | number | Vertical position on canvas                   |

**Generate test data** by saving the above as `test-nodes.json` and dropping
it onto the app.

---

## Common Mistakes & Debugging Tips

### 1. Drop event doesn't fire
**Cause:** Missing `e.preventDefault()` in the `dragover` handler.
**Fix:** Make sure `dragover` calls `e.preventDefault()`.

### 2. Canvas is blank after dropping file
**Cause:** `animate()` was called before data loaded, OR `neurons` is empty.
**Fix:** `console.log(neurons)` right after `neurons = data` to verify the data.

### 3. Glow effect bleeds into the lines
**Cause:** Forgot to reset `ctx.shadowBlur = 0` after drawing nodes.
**Fix:** Always reset canvas state after using `shadowBlur` or `shadowColor`.

### 4. `JSON.parse` throws an error
**Cause:** The JSON file has a syntax error (missing comma, trailing comma, wrong quotes).
**Fix:** Validate JSON at [jsonlint.com](https://jsonlint.com) or in VS Code.

### 5. `Cannot read properties of null` error
**Cause:** `document.getElementById('some-id')` returned `null` — the ID
doesn't exist in the HTML, or the script runs before the DOM is loaded.
**Fix:** Make sure your `<script>` tag is at the BOTTOM of `<body>`, or use
`DOMContentLoaded` event.

### 6. Multiple animation loops running
**Cause:** `animate()` was called more than once.
**Symptom:** The app speeds up or stutters.
**Fix:** Use a flag variable:
```js
let isAnimating = false;
function animate() {
    drawNeurons();
    requestAnimationFrame(animate);
}
function startAnimation() {
    if (!isAnimating) {
        isAnimating = true;
        animate();
    }
}
```

---

## Challenges to Extend the Project

Work through these once you're comfortable with the base code.

### Beginner
- [ ] Change the default node color from cyan to a color of your choice
- [ ] Make the connection distance threshold a variable (e.g., `const LINK_DISTANCE = 250`) instead of a hardcoded number
- [ ] Make the hover detection radius (`15`) adjustable via a slider `<input>` on the page

### Intermediate
- [ ] Color each node differently based on its `group` property using a color map
- [ ] Add click-to-select on canvas nodes (not just hover), and highlight the selected node permanently
- [ ] Make nodes pulse (grow and shrink slowly) using `Math.sin(Date.now() / 500)` as the radius
- [ ] Show a node's label as text directly on the canvas when hovered

### Advanced
- [ ] Make nodes slowly drift/float by updating their `x` and `y` each frame with small velocity values
- [ ] Add a search input that highlights matching nodes in the sidebar AND on the canvas
- [ ] Remap node positions proportionally when the window is resized
- [ ] Allow users to drag individual nodes around on the canvas with mouse events

---

*Happy coding. Read slowly, experiment often, and break things on purpose.*
