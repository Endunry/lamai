
const SIZE = 30; // Size of a grid
const GRID_WIDTH = 21;
const GRID_HEIGHT = 27;
const WIDTH = GRID_WIDTH * SIZE;
const HEIGHT = GRID_HEIGHT * SIZE;

const BACKGROUND = 'black';
const TIMESECONDS = 0.3;

let textx = 0;
let texty = 0;

let lama;
let currentSelection = null;
let map = [];

let timeInterval;
window.addEventListener("keydown", function (e) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

window.onload = function () {
    let mapDataString = mapdatainit;
    let mapData = mapDataString;
    let barriers = JSON.parse(`[${mapData.barriers}]`).map((barrier) => new Border(createVector(barrier.x, barrier.y), true));
    let cookies = JSON.parse(`[${mapData.cookies}]`).map((cookie) => new Cookie(cookie.x, cookie.y, true));
    let powerups = JSON.parse(`[${mapData.powerups}]`).map((powerup) => new Power(powerup.x, powerup.y, true));
    // let spawner = mapData.spawner;
    let lamaser = new Lama(createVector(mapData.lama.x, mapData.lama.y), SIZE, true);
    console.log(barriers);
    map = [];
    map = [...barriers, ...cookies, ...powerups];
    lama = lamaser;
    setup();


}

function setup() {

    const canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent('app');
     imageMode(CENTER);

    textx = 0;
    texty = 0;
    textSize(20);
    textAlign(CENTER, CENTER);
    background(BACKGROUND);
    timeInterval && clearInterval(timeInterval);
    timeInterval = setInterval(timeLoop, TIMESECONDS * 1000);
    // lama = new Lama(createVector(1, 1), SIZE);
}

function draw() {
    background(BACKGROUND);
    lama && lama.draw();
    map && map.forEach((border) => border.draw());
    lama && lama.listenForKeys();
    lama && text(`Punkte: ${lama.points}`, textx, texty, WIDTH, SIZE + 5);
    fill('blue');
    // console.log(Date.now() - STARTTIME);
}

function timeLoop() {
    lama && lama.update();
}

function mousePressed() {
    let insertedItem;
    // Determine the x and y coords
    let x = Math.floor(mouseX / SIZE) * SIZE;
    let y = Math.floor(mouseY / SIZE) * SIZE;
    // Check if the coords are in the map
    
    if (x < 0 || x > WIDTH - SIZE || y < 0 || y > HEIGHT - SIZE) return;
    const isOverlapping = map.some((entity) => entity.pos.x === x && entity.pos.y === y) || lama.pos.x === x && lama.pos.y === y;
    switch (currentSelection) {
        case 'border':
            insertedItem = new Border(createVector(x, y),  true);
            break;
        case 'cookie':
            insertedItem = new Cookie(x, y, true);
            break;
        case 'powerup':
            insertedItem = new Power(x, y, true);
            break;
        case 'spawner':
            // insertedItem = new Spawner(x, y);
            break;
        case 'lama':
            if(!isOverlapping){
                lama = new Lama(createVector(x, y), SIZE, true);
            }
            return;
        case 'delete':
            map = map.filter(
                (entity) => !(entity.pos.x === x && entity.pos.y === y),
            );
            return;
        default:
            return;
    }
    if (isOverlapping) return;
    if (insertedItem) {
        map.push(insertedItem);
    }
}

function mouseDragged(event) {
    mousePressed();
}

function toolbarclick(target) {
    currentSelection = target.id;
    let eClone = target.cloneNode(true);
    eClone.id = 'currentSelection';
    document.getElementById('currentSelection').replaceWith(eClone);
}


function activateEditing(button){
    button.setAttribute('disabled', 'disabled');
    document.getElementById('toolbar').classList.remove("disabled");
    document.getElementById('saveBtn').removeAttribute('disabled');

}

function loadMap(){
    let mapDataString = prompt("Mapdaten eingeben");
    if(mapDataString === null){
        return;
    }
    let mapData = JSON.parse(mapDataString);
    let barriers = JSON.parse(`[${mapData.barriers}]`).map((barrier) => new Border(createVector(barrier.x, barrier.y), true));
    let cookies = JSON.parse(`[${mapData.cookies}]`).map((cookie) => new Cookie(cookie.x, cookie.y, true));
    let powerups = JSON.parse(`[${mapData.powerups}]`).map((powerup) => new Power(powerup.x, powerup.y, true));
    // let spawner = mapData.spawner;
    let lamaser = new Lama(createVector(mapData.lama.x, mapData.lama.y), SIZE, true);
    console.log(barriers);
    map = [];
    map = [...barriers, ...cookies, ...powerups];
    lama = lamaser;
    setup();
}

function saveMap(button){
    button.setAttribute('disabled', 'disabled');
    document.getElementById('toolbar').classList.add("disabled");
    document.getElementById('editBtn').removeAttribute('disabled');
    currentSelection = null;
    let emptyNode = document.createElement('span');
    emptyNode.id = 'currentSelection';
    document.getElementById('currentSelection').replaceWith(emptyNode);
    let barriers = [];
    let cookies = [];
    let powerups = [];
    let spawner = null;
    let lamaser = {x: lama.pos.x, y: lama.pos.y};
    map.forEach((entity) => {
        if(entity instanceof Border){
            barriers.push(JSON.stringify(entity));
        }else if(entity instanceof Cookie){
            cookies.push(JSON.stringify(entity));
        }else if(entity instanceof Power){
            powerups.push(JSON.stringify(entity));
        }
        // else if(entity instanceof Spawner){
        //     spawner = entity;
        // }
    }); 
    
    let mapData = {
        barriers, cookies, powerups, spawner, lama: lamaser
    }
    let mapDataString = JSON.stringify(mapData);
    document.getElementById("io").innerHTML = mapDataString;
        
}