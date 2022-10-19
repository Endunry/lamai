import { Vector } from "p5";
import P5 from "p5";
import Gertrud, { Blinky, Clyde, Inky, Pinky } from "./gertruds";
import Lama, { LamaInterface } from "./lama";
import Door from "./door";
import Entity, { EntityInterface } from './entity';
import mapdatainit from "./savestate";
import Void from "./void";
import Border from "./borders";
import { Cookie, Power } from "./collectible";
import Fraction from "./fraction";
import { setImages } from "./singletons";

import LamaImg from './assets/lama.png';
import BlinkyImg from './assets/Gertrud_Blinky.png';
import ClydeImg from './assets/Gertrud_Clyde.png';
import InkyImg from './assets/Gertrud_Inky.png';
import PinkyImg from './assets/Gertrud_Pinky.png';
import FrightenedImg from './assets/Gertrud_Frightened.png';
import EatenImg from './assets/Gertrud_Eaten.png';

export const SIZE = 30; // Size of a grid
export const GRID_WIDTH = 28;
export const GRID_HEIGHT = 35;
export const WIDTH = GRID_WIDTH * SIZE;
export const HEIGHT = GRID_HEIGHT * SIZE;


export let BORDER_DRAWING = 'ORIGINAL';  // SIMPLE or ORIGINAL 
export const DEBUG = true;
export let HOME_TARGET: Vector = null;
const BACKGROUND = 'black';
// "How many grids will it move per cycle"

// Somehow let the movement be 11 Blocks per second for the normal gameplay

/* Table for Speed values of pacman and the ghosts

Pacman:
    Norm: 80%
    Fright: 90%
Ghosts:
    Norm: 75%
    Fright: 50%
*/

const TIMESECONDS = 50; // "In which frequency will the timeLoop function be called" (1000 / TIMESECONDS)
const LAMA_SPEED = 10 // How many grids / second
const GERTRUD_SPEED = 8;

export const LAMA_SMOOTHNESS = new Fraction(1, TIMESECONDS / LAMA_SPEED);
console.log(LAMA_SMOOTHNESS)
export const GERTRUD_SMOOTHNESS = new Fraction(1, TIMESECONDS / GERTRUD_SPEED);
let textx = 0;
let texty = 0;


export let pinky: Blinky, inky: Inky, clyde: Clyde, blinky: Blinky;
export let lama: LamaInterface;

let START_TIME: Date;

let currentSelection: string | null = null;
export let arrayMap: (Entity | undefined)[][] = new Array(GRID_WIDTH).fill(0).map(() => new Array(GRID_HEIGHT));
let started = false;

let timeInterval: NodeJS.Timer;
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

function initGame() {
    started = false;
    let mapDataString = mapdatainit;
    let mapData = mapDataString;

    mapData.voids.forEach((_void) => arrayMap[_void.x][_void.y] = new Void(new Vector(_void.x, _void.y)));
    mapData.barriers.forEach((barrier) => arrayMap[barrier.x][barrier.y] = new Border(new Vector(barrier.x, barrier.y)));
    mapData.cookies.forEach((cookie) => arrayMap[cookie.x][cookie.y] = new Cookie(cookie.x, cookie.y));
    mapData.powerups.forEach((powerup) => arrayMap[powerup.x][powerup.y] = new Power(powerup.x, powerup.y));
    mapData.doors.forEach((door) => arrayMap[Math.floor(door.x)][Math.floor(door.y)] = new Door(door.x, door.y));
    // let spawner = mapData.spawner;
    lama = new Lama(new Vector(mapData.lama.x, mapData.lama.y), SIZE);
    pinky = new Pinky(mapData.pinky.x, mapData.pinky.y,);
    inky = new Inky(mapData.inky.x, mapData.inky.y,);
    clyde = new Clyde(mapData.clyde.x, mapData.clyde.y,);
    blinky = new Blinky(mapData.blinky.x, mapData.blinky.y,);
    if (mapData.home) {
        HOME_TARGET = new Vector(mapData.home.x, mapData.home.y);
    }


    // TODO: HIER IWI SETUP UND SO
    // setup();
}

window.onload = function () {
    initGame();
}

const sketch = (p5: P5) => {
    // p5.mousePressed = (event?: MouseEvent) => {
    //     if(!event) return;
    //     let insertedItem;
    //     // Determine the x and y coords
    //     let x = Math.floor(event.mouseX / SIZE);
    //     let y = Math.floor(event.mouseY / SIZE);
    //     let halfY = Math.floor(event.mouseY / (SIZE / 2));
    //     let halfX = Math.floor(event.mouseX / (SIZE / 2));
    //     // Check if the coords are in the map
    //     if (x < 0 || x > GRID_WIDTH || y < 0 || y > GRID_HEIGHT) return;
    //     const isOverlapping = (arrayMap[x] && arrayMap[x][y] != null);

    //     switch (currentSelection) {
    //         case 'void':
    //             insertedItem = new Void(createVector(x, y));
    //             break;
    //         case 'border':
    //             insertedItem = new Border(createVector(x, y));
    //             break;
    //         case 'cookie':
    //             insertedItem = new Cookie(x, y);
    //             break;
    //         case 'powerup':
    //             insertedItem = new Power(x, y);
    //             break;
    //         case 'gertrud1':
    //             clyde = new Clyde(halfX / 2, halfY / 2);
    //             break;
    //         case 'gertrud2':
    //             inky = new Pinky(halfX / 2, halfY / 2);
    //             break;
    //         case 'gertrud3':
    //             pinky = new Blinky(halfX / 2, halfY / 2);
    //             break;
    //         case 'gertrud4':
    //             blinky = new Inky(halfX / 2, halfY / 2);
    //             break;
    //         case 'lama':
    //             lama = new Lama(createVector(halfX / 2, halfY / 2), SIZE);
    //             return;
    //         case 'homeTarget':
    //             HOME_TARGET = createVector(x, halfY / 2);
    //             return;
    //         case 'homeWall':
    //             insertedItem = new Door(x, halfY / 2);
    //         case 'delete':
    //             arrayMap[x][y] = null;
    //             break;
    //         default:
    //             return;
    //     }
    //     // }

    //     if (!isOverlapping && insertedItem) {
    //         arrayMap[x][y] = insertedItem;
    //     }
    //     determineBorderTypes();
    // }


    p5.setup = () => {

        // Load the images
        setImages({
            pacman: p5.loadImage(LamaImg),
            blinky: p5.loadImage(BlinkyImg),
            inky: p5.loadImage(InkyImg),
            pinky: p5.loadImage(PinkyImg),
            clyde: p5.loadImage(ClydeImg),
            frightened: p5.loadImage(FrightenedImg),
            eaten: p5.loadImage(EatenImg),
        })

        started = false;
        let mapDataString = mapdatainit;
        let mapData = mapDataString;

        mapData.voids.forEach((_void) => arrayMap[_void.x][_void.y] = new Void(new Vector(_void.x, _void.y)));
        mapData.barriers.forEach((barrier) => arrayMap[barrier.x][barrier.y] = new Border(new Vector(barrier.x, barrier.y)));
        mapData.cookies.forEach((cookie) => arrayMap[cookie.x][cookie.y] = new Cookie(cookie.x, cookie.y));
        mapData.powerups.forEach((powerup) => arrayMap[powerup.x][powerup.y] = new Power(powerup.x, powerup.y));
        mapData.doors.forEach((door) => arrayMap[Math.floor(door.x)][Math.floor(door.y)] = new Door(door.x, door.y));
        // let spawner = mapData.spawner;
        lama = new Lama(new Vector(mapData.lama.x, mapData.lama.y), SIZE);
        pinky = new Pinky(mapData.pinky.x, mapData.pinky.y,);
        inky = new Inky(mapData.inky.x, mapData.inky.y,);
        clyde = new Clyde(mapData.clyde.x, mapData.clyde.y,);
        blinky = new Blinky(mapData.blinky.x, mapData.blinky.y,);
        if (mapData.home) {
            HOME_TARGET = new Vector(mapData.home.x, mapData.home.y);
        }
        const canvas = p5.createCanvas(WIDTH, HEIGHT);
        canvas.parent('app');
        determineBorderTypes()
        p5.imageMode(p5.CENTER);
        textx = 0;
        texty = 0;
        p5.textSize(20);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.background(BACKGROUND);
        timeInterval && clearInterval(timeInterval);
        timeInterval = setInterval(timeLoop, 1000 / TIMESECONDS);
        // lama = new Lama(createVector(1, 1), SIZE);
    }

    p5.draw = () => {
        p5.background(BACKGROUND);
        if (DEBUG) {
            p5.stroke(255);
            p5.strokeWeight(1);
            for (let i = 0; i < GRID_WIDTH; i++) {
                p5.line(i * SIZE, 0, i * SIZE, HEIGHT);
            }
            for (let i = 0; i < GRID_HEIGHT; i++) {
                p5.line(0, i * SIZE, WIDTH, i * SIZE);
            }
            // Draw fps
            p5.fill(255);
            p5.text(`FPS: ${p5.frameRate().toFixed(0)}`, 100, 10);
            HOME_TARGET && p5.ellipse(HOME_TARGET.x * SIZE, HOME_TARGET.y * SIZE, 10, 10);
        }

        lama && lama.draw(p5);
        arrayMap && arrayMap.forEach(col => col && col.forEach(item => item && item.draw(p5)));
        lama && lama.listenForKeys(p5);
        lama && p5.text(`Punkte: ${lama.points}`, textx, texty, WIDTH, SIZE + 5);
        inky && inky.draw(p5);
        pinky && pinky.draw(p5);
        clyde && clyde.draw(p5);
        blinky && blinky.draw(p5);
    }

}


function getBorder(borders: Array<Array<Entity>>, x: number, y: number): number {
    if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
        if (borders[x][y] instanceof Border) {
            return 1;
        } else if (borders[x][y] instanceof Void || borders[x][y] instanceof Door) {
            return -1;
        }
        return 0;
    }
    return -1;
}

function getBorderNeighbors(borders: Array<Array<Entity>>, x: number, y: number) {
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
                (arrayMap[x][y] as Border).setNeighbors(neighbors);
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

function checkTimeTable(ghosts: Array<Gertrud>) {
    /* Timetable to switch between Scatter and Chase in lvl 1 of original Pacman:
    SCATTER/CHASE: 7" 20" 7" 20" 5" 20" 5" -
    */
    let time = new Date();
    let timeDiff = time.getTime() - START_TIME.getTime();
    let seconds = Math.floor(timeDiff / 1000);
    (seconds);
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

// function mouseDragged(event) {
//     mousePressed();
// }
// TODO: Wieder alles einfügen hier mit click events und so dies das you know
// function toolbarclick(target: MouseEvent["target"]) {
//     currentSelection = target.id;
//     let eClone = target.cloneNode(true);
//     eClone.id = 'currentSelection';
//     document.getElementById('currentSelection').replaceWith(eClone);
// }


// function activateEditing(button) {
//     button.setAttribute('disabled', 'disabled');
//     document.getElementById('toolbar').classList.remove("disabled");
//     document.getElementById('saveBtn').removeAttribute('disabled');

// }

// function loadMap() {
//     let mapDataString = prompt("Mapdaten eingeben");
//     if (mapDataString === null) {
//         return;
//     }
//     let mapData = JSON.parse(mapDataString);
//     let voids = JSON.parse(`[${mapData.voids}]`).map((_void) => new Void(createVector(_void.x, _void.y)));
//     let barriers = JSON.parse(`[${mapData.barriers}]`).map((barrier) => new Border(createVector(barrier.x, barrier.y)));
//     let cookies = JSON.parse(`[${mapData.cookies}]`).map((cookie) => new Cookie(cookie.x, cookie.y));
//     let powerups = JSON.parse(`[${mapData.powerups}]`).map((powerup) => new Power(powerup.x, powerup.y));
//     // let spawner = mapData.spawner;
//     let lamaser = new Lama(createVector(mapData.lama.x, mapData.lama.y), SIZE);
//     map = [];
//     map = [...voids, ...barriers, ...cookies, ...powerups];
//     lama = lamaser;
//     pinky = new Pinky(mapData.pinky.x, mapData.pinky.y);
//     inky = new Inky(mapData.inky.x, mapData.inky.y);
//     clyde = new Clyde(mapData.clyde.x, mapData.clyde.y);
//     blinky = new Blinky(mapData.blinky.x, mapData.blinky.y);
//     BLINKY_START_POS = createVector(mapData.blinky.x, mapData.blinky.y);
//     setup();
// }
type printType = {x: any, y: any}[];
function saveMap(button: HTMLButtonElement) {
    button.setAttribute('disabled', 'disabled');
    document.getElementById('toolbar').classList.add("disabled");
    document.getElementById('editBtn').removeAttribute('disabled');
    currentSelection = null;
    let emptyNode = document.createElement('span');
    emptyNode.id = 'currentSelection';
    document.getElementById('currentSelection').replaceWith(emptyNode);
    let voids: printType  = [];
    let barriers: printType = [];
    let cookies: printType = [];
    let powerups: printType = [];
    let doors: printType = [];
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

new P5(sketch);
