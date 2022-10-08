const SIZE = 30; // Size of a grid
const GRID_WIDTH = 28;
const GRID_HEIGHT = 35;
const WIDTH = GRID_WIDTH * SIZE;
const HEIGHT = GRID_HEIGHT * SIZE;

const DEBUG = true;
let HOME_TARGET = null;
const BACKGROUND = 'black';
const LAMA_SPEED = 1; // "How many grids will it move per cycle"
const TIMESECONDS = 0.1; // "In which frequency will the timeLoop function be called" (1000*TIMESECONDS)
const GERTRUD_SPEED = LAMA_SPEED;
let textx = 0;
let texty = 0;


let pinky, inky, clyde, blinky;
let lama;

let START_TIME;

let currentSelection = null;
let arrayMap = new Array(GRID_WIDTH).fill(0).map(() => new Array(GRID_HEIGHT));
console.log(arrayMap)
let started = false;

let timeInterval;
window.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        if (!started) {
            started = true;
            inky && inky.start();
            pinky && pinky.start();
            clyde && clyde.start();
            blinky && blinky.start();
            START_TIME = new Date();
        }
        e.preventDefault();
    }
}, false);

window.onload = function () {
    let mapDataString = mapdatainit;
    let mapData = mapDataString;

    mapData.voids.forEach((_void) => arrayMap[_void.x][_void.y] = new Void(createVector(_void.x, _void.y)));
    mapData.barriers.forEach((barrier) => arrayMap[barrier.x][barrier.y] = new Border(createVector(barrier.x, barrier.y)));
    mapData.cookies.forEach((cookie) => arrayMap[cookie.x][cookie.y] = new Cookie(cookie.x, cookie.y));
    mapData.powerups.forEach((powerup) => arrayMap[powerup.x][powerup.y] = new Power(powerup.x, powerup.y));
    mapData.doors.forEach((door) => arrayMap[floor(door.x)][floor(door.y)] = new Door(door.x, door.y));
    // let spawner = mapData.spawner;
    lama = new Lama(createVector(mapData.lama.x, mapData.lama.y), SIZE);
    pinky = new Pinky(mapData.pinky.x, mapData.pinky.y, );
    inky = new Inky(mapData.inky.x, mapData.inky.y, );
    clyde = new Clyde(mapData.clyde.x, mapData.clyde.y, );
    blinky = new Blinky(mapData.blinky.x, mapData.blinky.y, );
    if (mapData.home) {
        HOME_TARGET = createVector(mapData.home.x, mapData.home.y);
    }

    setup();
}

function setup() {
    determineBorderTypes()
    const canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent('app');
    imageMode(CENTER);
    console.log(arrayMap);
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
    if (DEBUG) {
        stroke(255);
        strokeWeight(1);
        for (let i = 0; i < GRID_WIDTH; i++) {
            line(i * SIZE, 0, i * SIZE, HEIGHT);
        }
        for (let i = 0; i < GRID_HEIGHT; i++) {
            line(0, i * SIZE, WIDTH, i * SIZE);
        }
        // Draw fps
        fill(255);
        text(`FPS: ${frameRate().toFixed(0)}`, 100, 10);
        HOME_TARGET && ellipse(HOME_TARGET.x * SIZE, HOME_TARGET.y * SIZE, 10, 10);
    }

    lama && lama.draw();
    arrayMap && arrayMap.forEach(col => col && col.forEach(item => item && item.draw()));
    lama && lama.listenForKeys();
    lama && text(`Punkte: ${lama.points}`, textx, texty, WIDTH, SIZE + 5);
    inky && inky.draw();
    pinky && pinky.draw();
    clyde && clyde.draw();
    blinky && blinky.draw();
}

function getBorder(borders, x, y) {
    if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
        if (borders[x][y] instanceof Border) {
            return 1;
        } else if (borders[x][y] instanceof Void) {
            return -1;
        }
        return 0;
    }
    return -1;
}

function getBorderNeighbors(borders, x, y) {
    let top = getBorder(borders, x, y - 1);
    let right = getBorder(borders, x + 1, y);
    let bottom = getBorder(borders, x, y + 1);
    let left = getBorder(borders, x - 1, y);
    let top_right = getBorder(borders, x + 1, y - 1);
    let bottom_right = getBorder(borders, x + 1, y + 1);
    let bottom_left = getBorder(borders, x - 1, y + 1);
    let top_left = getBorder(borders, x - 1, y - 1);
    return [top, right, bottom, left, top_right, bottom_right, bottom_left, top_left];
}

function determineBorderTypes() {
    for (let x = 0; x < GRID_WIDTH; x++) {
        for (let y = 0; y < GRID_HEIGHT; y++) {
            if (arrayMap[x][y] instanceof Border) {
                let neighbors = getBorderNeighbors(arrayMap, x, y);
                arrayMap[x][y].setNeighbors(neighbors);
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

    START_TIME && checkTimeTable([inky, pinky, clyde, blinky]);
}

function checkTimeTable(ghosts) {
    /* Timetable to switch between Scatter and Chase in lvl 1 of original Pacman:
    SCATTER/CHASE: 7" 20" 7" 20" 5" 20" 5" -
    */
    let time = new Date();
    let timeDiff = time - START_TIME;
    let seconds = Math.floor(timeDiff / 1000);
    console.log(seconds);
    if (seconds >= 84) {
        ghosts.forEach(ghost => ghost.chase());
        return;
    }
    if (seconds >= 7 && seconds < 27) {
        ghosts.forEach(ghost => ghost.chase());
    } else if (seconds >= 27 && seconds < 54) {
        ghosts.forEach(ghost => ghost.scatter());
    } else if (seconds >= 54 && seconds < 59) {
        ghosts.forEach(ghost => ghost.chase());
    } else if (seconds >= 59 && seconds < 84) {
        ghosts.forEach(ghost => ghost.scatter());
    }


}

function mousePressed() {
    let insertedItem;
    // Determine the x and y coords
    let x = Math.floor(mouseX / SIZE);
    let y = Math.floor(mouseY / SIZE);
    let halfY = Math.floor(mouseY / (SIZE / 2));
    let halfX = Math.floor(mouseX / (SIZE / 2));
    // Check if the coords are in the map
    if (x < 0 || x > GRID_WIDTH || y < 0 || y > GRID_HEIGHT) return;
    const isOverlapping = (arrayMap[x] && arrayMap[x][y] != null);

    switch (currentSelection) {
        case 'void':
            insertedItem = new Void(createVector(x, y));
            break;
        case 'border':
            insertedItem = new Border(createVector(x, y));
            break;
        case 'cookie':
            insertedItem = new Cookie(x, y);
            break;
        case 'powerup':
            insertedItem = new Power(x, y);
            break;
        case 'gertrud1':
            clyde = new Clyde(halfX / 2, halfY / 2);
            break;
        case 'gertrud2':
            inky = new Pinky(halfX / 2, halfY / 2);
            break;
        case 'gertrud3':
            pinky = new Blinky(halfX / 2, halfY / 2);
            break;
        case 'gertrud4':
            blinky = new Inky(halfX / 2, halfY / 2);
            break;
        case 'lama':
            lama = new Lama(createVector(halfX / 2, halfY / 2), SIZE);
            return;
        case 'homeTarget':
            HOME_TARGET = createVector(x, halfY / 2);
            return;
        case 'homeWall':
            insertedItem = new Door(x, halfY / 2);
        case 'delete':
            arrayMap[x][y] = null;
            break;
        default:
            return;
    }
    // }

    if (!isOverlapping && insertedItem) {
        arrayMap[x][y] = insertedItem;
    }
    determineBorderTypes();
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


function activateEditing(button) {
    button.setAttribute('disabled', 'disabled');
    document.getElementById('toolbar').classList.remove("disabled");
    document.getElementById('saveBtn').removeAttribute('disabled');

}

function loadMap() {
    let mapDataString = prompt("Mapdaten eingeben");
    if (mapDataString === null) {
        return;
    }
    let mapData = JSON.parse(mapDataString);
    let voids = JSON.parse(`[${mapData.voids}]`).map((_void) => new Void(createVector(_void.x, _void.y)));
    let barriers = JSON.parse(`[${mapData.barriers}]`).map((barrier) => new Border(createVector(barrier.x, barrier.y)));
    let cookies = JSON.parse(`[${mapData.cookies}]`).map((cookie) => new Cookie(cookie.x, cookie.y));
    let powerups = JSON.parse(`[${mapData.powerups}]`).map((powerup) => new Power(powerup.x, powerup.y));
    // let spawner = mapData.spawner;
    let lamaser = new Lama(createVector(mapData.lama.x, mapData.lama.y), SIZE);
    map = [];
    map = [...voids, ...barriers, ...cookies, ...powerups];
    lama = lamaser;
    pinky = new Pinky(mapData.pinky.x, mapData.pinky.y);
    inky = new Inky(mapData.inky.x, mapData.inky.y);
    clyde = new Clyde(mapData.clyde.x, mapData.clyde.y);
    blinky = new Blinky(mapData.blinky.x, mapData.blinky.y);
    BLINKY_START_POS = createVector(mapData.blinky.x, mapData.blinky.y);
    setup();
}

function saveMap(button) {
    button.setAttribute('disabled', 'disabled');
    document.getElementById('toolbar').classList.add("disabled");
    document.getElementById('editBtn').removeAttribute('disabled');
    currentSelection = null;
    let emptyNode = document.createElement('span');
    emptyNode.id = 'currentSelection';
    document.getElementById('currentSelection').replaceWith(emptyNode);
    let voids = [];
    let barriers = [];
    let cookies = [];
    let powerups = [];
    let doors = [];
    let lamaser = {
        x: lama.pos.x,
        y: lama.pos.y
    };
    arrayMap.forEach((col) => {
        col.forEach((entity) => {

            if (entity instanceof Void) {
                voids.push({
                    x: entity.pos.x,
                    y: entity.pos.y
                });
            } else if (entity instanceof Border) {
                barriers.push({
                    x: entity.pos.x,
                    y: entity.pos.y
                });
            } else if (entity instanceof Cookie) {
                cookies.push({
                    x: entity.pos.x,
                    y: entity.pos.y
                });
            } else if (entity instanceof Power) {
                powerups.push({
                    x: entity.pos.x,
                    y: entity.pos.y
                });
            } else if (entity instanceof Door) {
                doors.push({
                    x: entity.pos.x,
                    y: entity.pos.y
                });
            }
        });
    });

    let mapData = {
        voids,
        barriers,
        cookies,
        powerups,
        lama: lamaser,
        pinky,
        inky,
        clyde,
        blinky,
        home: {
            x: HOME_TARGET.x,
            y: HOME_TARGET.y
        },
        doors
    }
    let mapDataString = JSON.stringify(mapData);
    document.getElementById("io").innerHTML = mapDataString;

}