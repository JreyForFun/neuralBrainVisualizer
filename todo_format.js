// =============================================================
// NEURAL MAP — script.js
// This is YOUR coding exercise. Each TODO tells you what to write
// and gives a hint. Type the code yourself below each TODO.
// Do not copy-paste. That's how you actually learn.
// =============================================================


// -------------------------------------------------------------
// TODO 1 — Get the canvas element and its drawing context
//
// WHAT:  Grab the <canvas id="neural-canvas"> element from HTML.
//        Then get its 2D drawing context (your "pen").
//        Then set its width and height to fill the whole window.
//
// HOW:   document.getElementById('neural-canvas')
//        canvas.getContext('2d')
//        window.innerWidth / window.innerHeight
// -------------------------------------------------------------

// your code here


// -------------------------------------------------------------
// TODO 2 — Grab the UI elements and declare global variables
//
// WHAT:  Get references to these elements by their id:
//          'drop-screen', 'dashboard-screen', 'data-input',
//          'node-list', 'node-details'
//        Then declare:
//          neurons → an empty array (will hold node data)
//          mouse   → an object with x: 0 and y: 0
//
// WHY:   neurons uses 'let' because it gets reassigned later.
//        mouse uses 'let' because x and y update constantly.
// -------------------------------------------------------------

// your code here

// -------------------------------------------------------------
// TODO 3 — Listen for a file being dragged over the window
//
// WHAT:  Add a 'dragover' event listener on the window.
//        Inside it, call e.preventDefault() — this is required
//        or the browser will block the drop.
//        Then add the class 'dragover' to dropScreen.
//
// HOW:   window.addEventListener('dragover', (e) => { ... })
//        e.preventDefault()
//        element.classList.add('classname')
// -------------------------------------------------------------

// your code here


// -------------------------------------------------------------
// TODO 4 — Remove the highlight when the file leaves
//
// WHAT:  Add a 'dragleave' event listener on the window.
//        Inside it, remove the class 'dragover' from dropScreen.
// -------------------------------------------------------------

// your code here

// -------------------------------------------------------------
// TODO 5 — Handle the actual file drop
//
// WHAT:  Add a 'drop' event listener on the window.
//        1. Call e.preventDefault()
//        2. Remove 'dragover' class from dropScreen
//        3. Get the dropped file: e.dataTransfer.files[0]
//        4. Check if it exists AND ends with '.json'
//           - If yes: use FileReader to read it as text,
//             then in onload: JSON.parse the result and
//             call initializeMap() with the parsed data
//           - If no: alert the user to drop a .json file
//
// HOW:   new FileReader()
//        reader.onload = (event) => { ... }
//        event.target.result  ← the raw text of the file
//        JSON.parse(text)     ← turns it into a JS object
//        reader.readAsText(file)  ← starts the read
//
// NOTE:  Set onload BEFORE calling readAsText.
//        readAsText is async — it finishes later, then triggers onload.
// -------------------------------------------------------------

// your code here


// -------------------------------------------------------------
// TODO 6 — Write the initializeMap function
//
// WHAT:  This runs once after the file is loaded. It should:
//        1. Add class 'hidden' to dropScreen
//        2. Remove class 'hidden' from dashboardScreen
//        3. Store the data in the neurons variable
//        4. Clear nodeList with innerHTML = ''
//        5. Loop through neurons with forEach, and for each node:
//             - Create a <li> element
//             - Set its innerText to node.label
//             - Set its onclick to call showDetails(node)
//             - Append it to nodeList
//        6. Call animate() — only call this once!
//
// HOW:   document.createElement('li')
//        element.appendChild(child)
//        li.onclick = () => showDetails(node)
// -------------------------------------------------------------




// -------------------------------------------------------------
// TODO 7 — Write the showDetails function
//
// WHAT:  Takes a node object and displays its info in nodeDetails.
//        Set nodeDetails.innerHTML to an HTML string showing:
//          node.id, node.label, node.group, node.x, node.y
//
// HOW:   Use a template literal (backticks) with ${} to embed values.
//        Use <p> and <strong> tags to structure the output.
// -------------------------------------------------------------




// -------------------------------------------------------------
// TODO 8 — Track the mouse position
//
// WHAT:  Add a 'mousemove' event listener on the window.
//        Update mouse.x and mouse.y using e.clientX and e.clientY.
//
// WHY:   drawNeurons() reads mouse.x/y every frame to check if
//        the cursor is near a node. This keeps it up to date.
// -------------------------------------------------------------

// your code here

// -------------------------------------------------------------
// TODO 9 — Write the drawNeurons function
//
// WHAT:  This is the main drawing function. It runs ~60x per second.
//        Do these steps in order:
//
//   STEP A — Clear the canvas each frame
//     ctx.clearRect(0, 0, canvas.width, canvas.height)


//   STEP B — Draw lines between close nodes

//     Loop through every unique pair (i, j) where j starts at i+1.
//     For each pair, calculate distance using:
//       dx = neurons[i].x - neurons[j].x
//       dy = neurons[i].y - neurons[j].y
//       distance = Math.sqrt(dx*dx + dy*dy)
//     If distance < 250, draw a line:
//       ctx.beginPath()
//       ctx.moveTo(x1, y1)
//       ctx.lineTo(x2, y2)
//       ctx.strokeStyle = `rgba(0, 242, 255, ${1 - distance/250})`
//       ctx.lineWidth = 1
//       ctx.stroke()
//
//   STEP C — Draw each node as a glowing dot
//     Use forEach on neurons. For each node:
//       Calculate distToMouse the same way (mouse.x - node.x, etc.)
//       ctx.beginPath()
//       ctx.arc(node.x, node.y, 6, 0, Math.PI * 2)
//       If distToMouse < 15:
//         fillStyle = '#ff007b', shadowBlur = 20, shadowColor = '#ff007b'
//         call showDetails(node)
//       Else:
//         fillStyle = '#00f2ff', shadowBlur = 10, shadowColor = '#00f2ff'
//       ctx.fill()
//       ctx.shadowBlur = 0  ← MUST reset or glow bleeds into next draws
//
// NOTE:  Draw lines BEFORE dots so dots appear on top.
// -------------------------------------------------------------

function drawNeurons() {
    // your code here
}


// -------------------------------------------------------------
// TODO 10 — Write the animate function
//
// WHAT:  Call drawNeurons(), then schedule the next frame using
//        requestAnimationFrame(animate).
//
// WHY:   requestAnimationFrame runs your function ~60x per second,
//        synced to the screen refresh. Better than setInterval because
//        it pauses when the tab is hidden.
//
// NOTE:  animate() never truly calls itself — rAF just schedules it.
// -------------------------------------------------------------

function animate() {
    // your code here
}


// -------------------------------------------------------------
// TODO 11 — Handle window resize
//
// WHAT:  Add a 'resize' event listener on the window.
//        Inside it, reset canvas.width and canvas.height
//        to window.innerWidth and window.innerHeight.
//
// WHY:   The canvas does not resize automatically. Also note:
//        setting canvas.width always clears it — but animate()
//        will redraw everything on the next frame anyway.
// -------------------------------------------------------------

// your code here
