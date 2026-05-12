

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
    const nodeList = document.getElementById('node-list');
    nodeList.innerHTML = '';
    neurons.forEach(bnode => {
        let li = document.createElement('li');
        li.innerText = bnode.label;
        li.onclick = () => showDetails(bnode);
        nodeList.appendChild(li);
    });
    

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
            let dy = neurons[i].y - neurons[j].y
            let distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < 250){
                ctx.beginPath();
                ctx.moveTo(neurons[i].x, neurons[i].y);
                ctx.lineTo(neurons[j].x, neurons[j].y);
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
            ctx.fillStyle = '#6b8393';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#6b8393';

            showDetails(node);
        } else {
            ctx.fillStyle = '#00f2ff';
            ctx.shadowBlur = 10;
            ctx.shadowCColor = '#00f2ff';
        }
        ctx.fill();
        ctx.shadowBlur = 0;
    });
}


function animate() {
    drawNeurons();
    requestAnimationFrame(animate);
}


window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});