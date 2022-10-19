import { Vector } from "p5";
import P5 from "p5";
import Gertrud, { Blinky, Clyde, Inky, Pinky } from "./Entities/gertruds";
import Lama, { LamaInterface } from "./Entities/lama";
import Door from "./BuildBlocks/door";
import Entity, { EntityInterface } from './Entities/entity';
import mapdatainit from "./utils/savestate";
import Void from "./BuildBlocks/void";
import Border from "./BuildBlocks/borders";
import { Cookie, Power } from "./Entities/collectible";
import Fraction from "./utils/fraction";
import { config, globals, setImages } from "./utils/singletons";

import LamaImg from './assets/lama.png';
import BlinkyImg from './assets/Gertrud_Blinky.png';
import ClydeImg from './assets/Gertrud_Clyde.png';
import InkyImg from './assets/Gertrud_Inky.png';
import PinkyImg from './assets/Gertrud_Pinky.png';
import FrightenedImg from './assets/Gertrud_Frightened.png';
import EatenImg from './assets/Gertrud_Eaten.png';

export const WIDTH = config.dimensions.gridWidth * config.dimensions.gridSize;
export const HEIGHT = config.dimensions.gridHeight * config.dimensions.gridSize;
export let CANVAS_OBJ: P5.Renderer | null;


export let HOME_TARGET: Vector = null;
const BACKGROUND = 'black';
// "How many grids will it move per cycle"

// Somehow let the movement be 11 Blocks per second for the normal gameplay

/* Table for Speed values of pacman and the ghosts
draw(p5)
Pacman:
    Norm: 80%
    Fright: 90%
Ghosts:
    Norm: 75%
    Fright: 50%
*/

const LAMA_SPEED = 10 // How many grids / second
const GERTRUD_SPEED = 8;

export const LAMA_SMOOTHNESS = new Fraction(1, LAMA_SPEED);
console.log(LAMA_SMOOTHNESS)
export const GERTRUD_SMOOTHNESS = new Fraction(1,  GERTRUD_SPEED);
let textx = 0;
let texty = 0;


export let pinky: Blinky, inky: Inky, clyde: Clyde, blinky: Blinky;
export let lama: LamaInterface;

let START_TIME: Date;

let currentSelection: string | null = null;
export let gameMap: (Entity | undefined)[][] = new Array(config.dimensions.gridWidth).fill(0).map(() => new Array(config.dimensions.gridHeight));

document.getElementById("debugMode").setAttribute("checked", config.init.debug+"");
document.getElementById("debugMode").addEventListener("change", () => {
    globals.debug = !globals.debug;
    console.log(globals.debug);
});


window.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        if (!globals.started) {
            globals.started = true;
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
    globals.started = false;
    let mapDataString = mapdatainit;
    let mapData = mapDataString;

    mapData.voids.forEach((_void) => gameMap[_void.x][_void.y] = new Void(new Vector(_void.x, _void.y)));
    mapData.barriers.forEach((barrier) => gameMap[barrier.x][barrier.y] = new Border(new Vector(barrier.x, barrier.y)));
    mapData.cookies.forEach((cookie) => gameMap[cookie.x][cookie.y] = new Cookie(cookie.x, cookie.y));
    mapData.powerups.forEach((powerup) => gameMap[powerup.x][powerup.y] = new Power(powerup.x, powerup.y));
    mapData.doors.forEach((door) => gameMap[Math.floor(door.x)][Math.floor(door.y)] = new Door(door.x, door.y));
    // let spawner = mapData.spawner;
    lama = new Lama(new Vector(mapData.lama.x, mapData.lama.y), config.dimensions.gridSize);
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

type ClickEvent = MouseEvent & { target: HTMLCanvasElement };

const sketch = (p5: P5) => {

    p5.mousePressed = (event?: ClickEvent ) => {
        if(!event) return;
        let insertedItem;

        // Determine the x and y coords
        let rect = document.querySelector('#app canvas').getBoundingClientRect();
        let x = Math.floor((event.clientX - rect.left) / config.dimensions.gridSize);
        let y = Math.floor((event.clientY - rect.top) / config.dimensions.gridSize);

        if(x < 0 || x >= config.dimensions.gridWidth || y < 0 || y >= config.dimensions.gridHeight) return;
        let halfX = Math.floor((event.clientX - rect.left) / (config.dimensions.gridSize / 2));
        let halfY = Math.floor((event.clientY - rect.top) / (config.dimensions.gridSize / 2));
        // Check if the coords are in the map
        if (x < 0 || x > config.dimensions.gridWidth || y < 0 || y > config.dimensions.gridHeight) return;
        const isOverlapping = (gameMap[x] && gameMap[x][y] != null);

        switch (currentSelection) {
            case 'void':
                insertedItem = new Void(new Vector(x, y));
                break;
            case 'border':
                insertedItem = new Border(new Vector(x, y));
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
                lama = new Lama(new Vector(halfX / 2, halfY / 2), config.dimensions.gridSize);
                return;
            case 'homeTarget':
                HOME_TARGET = new Vector(x, halfY / 2);
                return;
            case 'homeWall':
                insertedItem = new Door(x, halfY / 2);
            case 'delete':
                gameMap[x][y] = null;
                break;
            default:
                return;
        }
        // }

        if (!isOverlapping && insertedItem) {
            gameMap[x][y] = insertedItem;
        }
        determineBorderTypes();
    }

    p5.mouseDragged = p5.mousePressed;

    p5.setup = () => {

        // Load the images
        p5.frameRate(60);
        setImages({
            pacman: p5.loadImage(LamaImg),
            blinky: p5.loadImage(BlinkyImg),
            inky: p5.loadImage(InkyImg),
            pinky: p5.loadImage(PinkyImg),
            clyde: p5.loadImage(ClydeImg),
            frightened: p5.loadImage(FrightenedImg),
            eaten: p5.loadImage(EatenImg),
        })

        globals.started = false;
        let mapDataString = mapdatainit;
        let mapData = mapDataString;

        mapData.voids.forEach((_void) => gameMap[_void.x][_void.y] = new Void(new Vector(_void.x, _void.y)));
        mapData.barriers.forEach((barrier) => gameMap[barrier.x][barrier.y] = new Border(new Vector(barrier.x, barrier.y)));
        mapData.cookies.forEach((cookie) => gameMap[cookie.x][cookie.y] = new Cookie(cookie.x, cookie.y));
        mapData.powerups.forEach((powerup) => gameMap[powerup.x][powerup.y] = new Power(powerup.x, powerup.y));
        mapData.doors.forEach((door) => gameMap[Math.floor(door.x)][Math.floor(door.y)] = new Door(door.x, door.y));
        // let spawner = mapData.spawner;
        lama = new Lama(new Vector(mapData.lama.x, mapData.lama.y), config.dimensions.gridSize);
        pinky = new Pinky(mapData.pinky.x, mapData.pinky.y,);
        inky = new Inky(mapData.inky.x, mapData.inky.y,);
        clyde = new Clyde(mapData.clyde.x, mapData.clyde.y,);
        blinky = new Blinky(mapData.blinky.x, mapData.blinky.y,);
        if (mapData.home) {
            HOME_TARGET = new Vector(mapData.home.x, mapData.home.y);
        }
        CANVAS_OBJ = p5.createCanvas(WIDTH, HEIGHT);
        CANVAS_OBJ.parent('app');
        determineBorderTypes()
        p5.imageMode(p5.CENTER);
        textx = 0;
        texty = 0;
        p5.textSize(20);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.background(BACKGROUND);
        // lama = new Lama(createVector(1, 1), config.dimensions.gridSize);
    }

    p5.draw = () => {
        p5.background(BACKGROUND);
        if (globals.debug) {
            p5.stroke(255);
            p5.strokeWeight(1);
            for (let i = 0; i < config.dimensions.gridWidth; i++) {
                p5.line(i * config.dimensions.gridSize, 0, i * config.dimensions.gridSize, HEIGHT);
            }
            for (let i = 0; i < config.dimensions.gridHeight; i++) {
                p5.line(0, i * config.dimensions.gridSize, WIDTH, i * config.dimensions.gridSize);
            }
            // Draw fps
            p5.fill(255);
            p5.text(`FPS: ${p5.frameRate().toFixed(0)}`, 100, 10);
            HOME_TARGET && p5.ellipse(HOME_TARGET.x * config.dimensions.gridSize, HOME_TARGET.y * config.dimensions.gridSize, 10, 10);
        }

        if(globals.started) {
        lama && lama.update();
        inky && inky.update();
        pinky && pinky.update();
        clyde && clyde.update();
        blinky && blinky.update();
        START_TIME && checkTimeTable([inky, pinky, clyde, blinky]);
        }

        lama && lama.draw(p5);
        gameMap && gameMap.forEach(col => col && col.forEach(item => item && item.draw(p5)));
        lama && lama.listenForKeys(p5);
        lama && p5.text(`Punkte: ${lama.points}`, textx, texty, WIDTH, config.dimensions.gridSize + 5);
        inky && inky.draw(p5);
        pinky && pinky.draw(p5);
        clyde && clyde.draw(p5);
        blinky && blinky.draw(p5);

    }

}


function getBorder(borders: Array<Array<Entity>>, x: number, y: number): number {
    if (x >= 0 && x < config.dimensions.gridWidth && y >= 0 && y < config.dimensions.gridHeight) {
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
    for (let x = 0; x < config.dimensions.gridWidth; x++) {
        for (let y = 0; y < config.dimensions.gridHeight; y++) {
            if (gameMap[x][y] instanceof Border) {
                let neighbors = getBorderNeighbors(gameMap, x, y);
                (gameMap[x][y] as Border).setNeighbors(neighbors);
            }
        }
    }
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



    
    
// TODO: Wieder alles einfügen hier mit click events und so dies das you know
export function toolbarclick(target: HTMLElement) {
    currentSelection = target.id;
    let eClone = target.cloneNode(true) as Element;
    eClone.id = 'currentSelection';
    document.getElementById('currentSelection').replaceWith(eClone);
}


export function activateEditing(button: HTMLButtonElement) {
    button.setAttribute('disabled', 'disabled');
    document.getElementById('toolbar').classList.remove("disabled");
    document.getElementById('saveBtn').removeAttribute('disabled');
}

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
//     let lamaser = new Lama(createVector(mapData.lama.x, mapData.lama.y), config.dimensions.gridSize);
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
export function saveMap(button: HTMLButtonElement) {
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
    gameMap.forEach((col) => {
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
