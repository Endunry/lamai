import game from "./Game";
import { Vector } from "p5";
import P5 from "p5";
import { Blinky, Clyde, Inky, Pinky } from "./Entities/gertruds";
import Lama, { LamaInterface } from "./Entities/lama";
import Door from "./BuildBlocks/door";
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
import mapEditor from './Editor';

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



let currentSelection: string | null = null;

document.getElementById("debugMode").setAttribute("checked", config.init.debug+"");
document.getElementById("debugMode").addEventListener("change", () => {
    globals.debug = !globals.debug;
    console.log(globals.debug);
});


window.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        if (!game.started) {
            game.start();
        }
        e.preventDefault();
    }
}, false);



const sketch = (p5: P5) => {

    p5.mousePressed = mapEditor.mouseListener;

    p5.mouseDragged = mapEditor.mouseListener;

    p5.setup = () => {
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

        
        CANVAS_OBJ = p5.createCanvas(WIDTH, HEIGHT);
        CANVAS_OBJ.parent('app');
        p5.imageMode(p5.CENTER);
        p5.textSize(20);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.background(BACKGROUND);
        // lama = new Lama(createVector(1, 1), config.dimensions.gridSize);
        game.init();
    }

    p5.draw = () => {
        p5.background(BACKGROUND);
        
        game.draw(p5);

        if(game.started) {
            game.update();
        }

    }

}



new P5(sketch);
