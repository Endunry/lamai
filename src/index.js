
const SIZE = 30; // Size of a grid
const GRID_WIDTH = 28;
const GRID_HEIGHT = 35;
const WIDTH = GRID_WIDTH * SIZE;
const HEIGHT = GRID_HEIGHT * SIZE;

const DEBUG = true;

const BACKGROUND = 'black';
let BLINKY_START_POS;
const LAMA_SPEED = 0.1; // "How many grids will it move per cycle"
const TIMESECONDS = 0.01; // "In which frequency will the timeLoop function be called" (1000*TIMESECONDS)
const GERTRUD_SPEED = LAMA_SPEED;
let textx = 0;
let texty = 0;


let pinky, inky, clyde, blinky;
let lama;

let currentSelection = null;
let map = [];

let started = false;

let timeInterval;
window.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        if(!started){
            started = true;
            inky && inky.start();
            pinky && pinky.start();
            clyde && clyde.start();
            blinky && blinky.start();
        }
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
    pinky = new Pinky(mapData.pinky.x, mapData.pinky.y, true);
    inky = new Inky(mapData.inky.x, mapData.inky.y, true);
    clyde = new Clyde(mapData.clyde.x, mapData.clyde.y, true);
    blinky = new Blinky(mapData.blinky.x, mapData.blinky.y, true);
    BLINKY_START_POS = blinky.pos.copy();
    map = [];
    map = [...barriers, ...cookies, ...powerups];
    lama = lamaser;
    setup();
}

function setup() {
    determineBorderTypes()
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
    if(DEBUG){

        stroke(255);
        strokeWeight(1);
        for (let i = 0; i < GRID_WIDTH; i++) {
            line(i * SIZE, 0, i * SIZE, HEIGHT);
        }
        for (let i = 0; i < GRID_HEIGHT; i++) {
            line(0, i * SIZE, WIDTH, i * SIZE);
        }
    }

    lama && lama.draw();
    map && map.forEach((border) => border.draw());
    lama && lama.listenForKeys();
    lama && text(`Punkte: ${lama.points}`, textx, texty, WIDTH, SIZE + 5);
    inky && inky.draw();
    pinky && pinky.draw();
    clyde && clyde.draw();
    blinky && blinky.draw();


}

function getBorderNeighbors(borders, x, y) {
    let top = borders[x] ? borders[x][y - 1] : undefined
    let right = borders[x + 1] ? borders[x + 1][y] : undefined
    let bottom = borders[x] ? borders[x][y + 1] : undefined
    let left = borders[x - 1] ? borders[x - 1][y] : undefined
    let top_right = borders[x + 1] ? borders[x + 1][y - 1] : undefined
    let bottom_right = borders[x + 1] ? borders[x + 1][y + 1] : undefined
    let bottom_left = borders[x - 1] ? borders[x - 1][y + 1] : undefined
    let top_left = borders[x - 1] ? borders[x - 1][y - 1] : undefined
    return [top, right, bottom, left, top_right, bottom_right, bottom_left, top_left]
}

function determineBorderTypes() {
    let borders = []
    for (let x = 0; x < GRID_WIDTH; x++) {
        borders.push([])
        for (let y = 0; y < GRID_HEIGHT; y++) {
            borders[x][y] = undefined
        }
    }
    for (entity of map) {
        if (entity instanceof Border) {
            let x = entity.pos.x / SIZE
            let y = entity.pos.y / SIZE
            borders[x][y] = entity
        }
    }
    for (let x = 0; x < GRID_WIDTH; x++) {
        for (let y = 0; y < GRID_HEIGHT; y++) {
            if (borders[x][y]) {
                let neighbors = getBorderNeighbors(borders, x, y)
                borders[x][y].setNeighbors(neighbors)
            }
        }
    }
}

function timeLoop() {
    lama && lama.update();
    inky && inky.update();
    pinky && pinky.update();
    clyde && clyde.update();
    blinky && blinky.update();
}

function mousePressed() {
    let insertedItem;
    // Determine the x and y coords
    let x = Math.floor(mouseX / SIZE) * SIZE;
    let y = Math.floor(mouseY / SIZE) * SIZE;
    // Check if the coords are in the map
    if (x < 0 || x > WIDTH - SIZE || y < 0 || y > HEIGHT - SIZE) return;
    const isOverlapping = map.some((entity) => entity.pos.x === x && entity.pos.y === y) || lama.pos.x === x && lama.pos.y === y;
    if (!isOverlapping){

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
        case 'gertrud1':
            clyde = new Clyde(x, y, true);
            break;
        case 'gertrud2':
            inky = new Pinky(x, y, true);
            break;
        case 'gertrud3':
            pinky = new Blinky(x, y, true);
            break;
        case 'gertrud4':
            blinky = new Inky(x, y, true);
            break;
        case 'lama':
                lama = new Lama(createVector(x, y), SIZE, true);
            return;
        case 'delete':
            map = map.filter(
                (entity) => !(entity.pos.x === x && entity.pos.y === y),
            );
            break;
        default:
            return;
    }
    }

    if (!isOverlapping && insertedItem) {
        map.push(insertedItem);
    }
    determineBorderTypes()
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
    map = [];
    map = [...barriers, ...cookies, ...powerups];
    lama = lamaser;
    pinky = new Pinky(mapData.pinky.x, mapData.pinky.y, true);
    inky = new Inky(mapData.inky.x, mapData.inky.y, true);
    clyde = new Clyde(mapData.clyde.x, mapData.clyde.y, true);
    blinky = new Blinky(mapData.blinky.x, mapData.blinky.y, true);
    BLINKY_START_POS = createVector(mapData.blinky.x, mapData.blinky.y);
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
        barriers, cookies, powerups, lama: lamaser, pinky, inky, clyde, blinky
    }
    let mapDataString = JSON.stringify(mapData);
    document.getElementById("io").innerHTML = mapDataString;
        
}