import P5 from 'p5';

import Lama from './lama';

const WIDTH = 1000;
const HEIGHT = 500;

const BACKGROUND = "black";


let lama : Lama; 


const sketch = (p5: P5) => {

    p5.setup = () => {
        const canvas = p5.createCanvas(WIDTH, HEIGHT);
        canvas.parent("app");
        p5.background(BACKGROUND);
        lama = new Lama(p5, p5.createVector(100, 100), 50);
    };

    p5.draw = () => {
        p5.background(BACKGROUND);
        lama.draw();
        lama.updateDirection();
        lama.update();

    };
};


new P5(sketch);