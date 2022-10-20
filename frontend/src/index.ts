import game from "./Game";
import { Vector } from "p5";
import P5 from "p5";
import Fraction from "./utils/fraction";
import { config, globals, setImages } from "./utils/singletons";

import LamaImg from './assets/lama.png';
import BlinkyImg from './assets/Gertrud_Blinky.png';
import ClydeImg from './assets/Gertrud_Clyde.png';
import InkyImg from './assets/Gertrud_Inky.png';
import PinkyImg from './assets/Gertrud_Pinky.png';
import FrightenedImg from './assets/Gertrud_Frightened.png';
import EatenImg from './assets/Gertrud_Eaten.png';
import mapEditor, { ClickEvent } from './Editor';

export const WIDTH = config.dimensions.gridWidth * config.dimensions.gridSize;
export const HEIGHT = config.dimensions.gridHeight * config.dimensions.gridSize;
export let CANVAS_OBJ: P5.Renderer | null;


export let HOME_TARGET: Vector = null;
const BACKGROUND = 'black';

const LAMA_SPEED = 10 // How many grids / second
const GERTRUD_SPEED = 10;

export const LAMA_SMOOTHNESS = new Fraction(1, LAMA_SPEED);
console.log(LAMA_SMOOTHNESS)
export const GERTRUD_SMOOTHNESS = new Fraction(1,  GERTRUD_SPEED);

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

    p5.mousePressed = e=> mapEditor.mouseListener(e as ClickEvent);

    p5.mouseDragged = e=> mapEditor.mouseListener(e as ClickEvent);

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
