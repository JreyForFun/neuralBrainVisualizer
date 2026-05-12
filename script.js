

const canvas = document.getElementById('neural-visual');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const initializerGroup = document.getElementById('initializer-group');
const dashboardScreen = document.getElementById('dashboard-screen');
const dataInput = document.getElementById('data-input');
const brainNodes = document.getElementById('brain-nodes');
const nodeDetails = document.getElementById('node-details');

let neurons = [];
let mouse = {x:0, y:0 }


window.addEventListener('dragover', (e) => {
    e.preventDefault();
    initializerGroup.classList.add('dragover');
});

window.addEventListener('dragleave', () => {
    initializerGroup.classList.remove('dragover');
})

window.addEventListener('drop', (e) => {
    e.preventDefault();
    initializerGroup.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if(file && file.name.endsWith('.json')){
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = JSON.parse(event.target.result);
            initializeMap(data);
        }
        reader.readAsText(file)
    }
    else {
        alert("Please drop a valid .json file data.");
    }
})

function initializeMap(data) {
    initializerGroup.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');

    neurons = data;

    brainNodes.insertAdjacentHTML('beforeend', neurons.forEach(bnode => {
        let li = document.createElement('li');
        li.innerText = bnode.label;
        li.onclick = () => showDetails(bnode);
        brainNodes.appendChild(li);
    }));
    

    animate();
}


function showDetails(node) {
    nodeDetails.innerHTML = `
    <p><strong>ID:</strong> ${node.id}</p>
    <p><strong>Name:</strong> ${node.label}</p>
    <p><strong>Group:</strong> ${node.group}</p>
    <p><strong>Coordinates:</strong> X:${node.x}, Y:${node.y}</p>
    `;
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});


function drawNeurons(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < neurons.length; i++){
        for(let j = i + 1; j < neurons.length; j++){
            let dx = neurons[i].x - neurons[j].x
            let dy = neurons[i].y - neurons[j].j
            let distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < 250){
                ctx.beginPath();
                ctx.moveTo(neurons[i].x, neurons[j].y);
                ctx.lineTo(neurons[i].y, neurons[j].y);
                ctx.strokeStyle = `rgba(0, 242, 255, ${1 - distance/250}`
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    neurons.forEach(node => {
        let dx = mouse.x - node.x;
        let dy = mouse.y - node.y;
        let distToMouse = Math.sqrt(dx * dx + dy * dy);

        ctx.beginPath();
        ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);

        if(distToMouse < 15) {
            ctx.fillStyle = '#ff007b';
            ctx.shadowBlur = 20;
            ctx.shadowColor = `#ff007b`;

            showDetails(node);
        } else {
            ctx.fillStyle = `#00f2ff`;
            ctx.shadowBlur = 10;
            ctx.shadowCOlor = `#00f2ff`;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
    })
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
