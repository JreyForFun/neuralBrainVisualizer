# 📝 Project Roadmap: Neural Brain Visualizer

## Phase 1: Setup the Board
- [ ] Create `index.html`, `style.css`, and `script.js`.
- [ ] Link the CSS and JS files to the HTML.
- [ ] Make the canvas fill the entire screen using CSS and JS window measurements.

## Phase 2: Drawing the First Nodes
- [ ] Get the 2D context working in JS.
- [ ] Draw a single static circle (neuron) in the middle of the screen.
- [ ] Create a `Neuron` class/object that has an `x`, `y`, `size`, `speedX`, and `speedY`.

## Phase 3: Making it Move
- [ ] Create an `animate()` loop using `requestAnimationFrame`.
- [ ] Inside the loop, clear the canvas every frame.
- [ ] Update the `x` and `y` of your neuron using its speed, and redraw it.
- [ ] Make the neuron bounce off the edges of the screen.

## Phase 4: The Network Math
- [ ] Generate an array of 50-100 neurons instead of just one.
- [ ] Write a nested loop to check the distance between every single neuron.
- [ ] If the distance between two neurons is less than 150px, draw a line between them.

## Phase 5: The "Tool" Upgrade (Data Injection)
- [ ] Build the HTML/CSS for the UI overlay (Sidebar, Toolbar).
- [ ] Build the Drag-and-Drop file zone.
- [ ] Write the JS `FileReader` code to grab data from a dropped `.json` file.
- [ ] Wipe the random neurons and replace them with the coordinates from the JSON file.