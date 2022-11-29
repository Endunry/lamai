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

export let WIDTH = 0;
export let HEIGHT = 0;
export let CANVAS_OBJ: P5.Renderer | null;

export let p5Sketch: P5 | null = null;
export const PORT = 1234;

export let HOME_TARGET: Vector = null;
const BACKGROUND = 'black';

const LAMA_SPEED = 10 // How many grids / second
const GERTRUD_SPEED = 10;

export const LAMA_SMOOTHNESS = new Fraction(1, LAMA_SPEED);
export const GERTRUD_SMOOTHNESS = new Fraction(1,  GERTRUD_SPEED);

document.getElementById("debugMode").setAttribute("checked", !config.init.debug+"");
document.getElementById("debugMode").addEventListener("change", () => {
    globals.debug = !globals.debug;
    console.log(globals.debug);
});

window.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        if (!globals.game.getInstance().started) {
            globals.game.getInstance().start();
            if(globals.agent){
                startLogic();
            }
        }
        e.preventDefault();
    }
}, false);


export function initCanvas() {

    // fetch the dimensions
    let req = new XMLHttpRequest();
    req.open('GET', `http://localhost:${PORT}/getDimensions/${globals.mapId}`, false);
    req.send(null);
    let dimensions = JSON.parse(req.responseText);
    globals.dimensions = dimensions;

    WIDTH = globals.dimensions.gridWidth * config.gridSize;
    HEIGHT = globals.dimensions.gridHeight * config.gridSize;

    const sketch = (p5: P5) => {

        if(p5Sketch) {
            p5Sketch.remove();
            p5Sketch = null;
        }

        p5.mousePressed = e => mapEditor.mouseListener(e as ClickEvent);

        p5.mouseDragged = e => mapEditor.mouseListener(e as ClickEvent);

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


            globals.game.createInstance();
            globals.game.getInstance().init();
        }

        p5.draw = async () => {
            p5.background(BACKGROUND);
            globals.game.getInstance().draw(p5);
            
            if(!(globals.agent)){
                if (globals.game.getInstance().started) {
                    await globals.game.getInstance().update();
                }
            
            }

        }

    }

    p5Sketch = new P5(sketch);

}


async function startLogic(){

    while(true){
        await globals.game.getInstance().update();
        if(globals.game.getInstance().readyForRestart){
            break;
        }
    }

    initCanvas();

}



initCanvas();