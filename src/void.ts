import Entity, { EntityInterface } from "./entity";
import { Vector } from 'p5';
import { DEBUG, SIZE } from './index';
import P5 from 'p5';

interface VoidInterface extends EntityInterface {
    size: number;
}

class Void extends Entity implements VoidInterface {
    size: number;
    constructor(atPosition:Vector) {
        super(atPosition.x, atPosition.y);
        this.size = SIZE;

    }

    draw(p5: P5) {
        if (!DEBUG) return;
        p5.push();

        p5.translate(this.pos.x*SIZE, this.pos.y*SIZE);
        p5.noStroke();
        p5.fill(255, 0, 0, 64);
        p5.rect(0, 0, this.size, this.size);

        p5.pop();
    }
}

export default Void;