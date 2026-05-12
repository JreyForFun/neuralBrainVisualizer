const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// UI Elements
const dropScreen = document.getElementById('drop-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const fileInput = document.getElementById('data-input');
const nodeList = document.getElementById('node-list');
const nodeDetails = document.getElementById('node-details');

let neurons = [];
let mouse = { x: 0, y: 0 };

// --- 1. DRAG AND DROP LOGIC ---

// Highlight the box when a file is hovering over it
window.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropScreen.classList.add('dragover');
});

// Remove highlight if they drag away
window.addEventListener('dragleave', () => {
    dropScreen.classList.remove('dragover');
});

// Handle the file drop
window.addEventListener('drop', (e) => {
    e.preventDefault();
    dropScreen.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.json')) {
        const reader = new FileReader();
        
        // When the file is done reading, parse it
        reader.onload = (event) => {
            const data = JSON.parse(event.target.result);
            initializeMap(data);
        };
        reader.readAsText(file);
    } else {
        alert("Please drop a valid .json file.");
    }
});

// --- 2. DATA INITIALIZATION ---

function initializeMap(data) {
    // Hide drop screen, show dashboard
    dropScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');

    neurons = data; // Store the data
    
    // Populate the sidebar list
    nodeList.innerHTML = '';
    neurons.forEach(node => {
        let li = document.createElement('li');
        li.innerText = node.label;
        li.onclick = () => showDetails(node);
        nodeList.appendChild(li);
    });

    // Start the animation loop
    animate();
}

// Display node info in the right panel
function showDetails(node) {
    nodeDetails.innerHTML = `
        <p><strong>ID:</strong> ${node.id}</p>
        <p><strong>Name:</strong> ${node.label}</p>
        <p><strong>Group:</strong> ${node.group}</p>
        <p><strong>Coordinates:</strong> X:${node.x}, Y:${node.y}</p>
    `;
}

// --- 3. CANVAS DRAWING LOGIC ---

// Track mouse movement for interactivity
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function drawNeurons() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw synapses (lines) between close nodes
    for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
            let dx = neurons[i].x - neurons[j].x;
            let dy = neurons[i].y - neurons[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // If nodes are close enough, draw a line
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

    // Draw the actual nodes (dots)
    neurons.forEach(node => {
        // Check if mouse is hovering over a node
        let dx = mouse.x - node.x;
        let dy = mouse.y - node.y;
        let distToMouse = Math.sqrt(dx * dx + dy * dy);

        ctx.beginPath();
        ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);

        if (distToMouse < 15) {
            ctx.fillStyle = '#ff007b'; // Highlight color
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ff007b';

            // Auto-update the inspector panel if hovering
            showDetails(node);
        } else {
            ctx.fillStyle = '#00f2ff'; // Default color
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00f2ff';
        }
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow so it doesn't affect lines
    });
}

function animate() {
    drawNeurons();
    requestAnimationFrame(animate); // Loops the drawing function forever
}

// Keep canvas sized correctly if window is resized
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});