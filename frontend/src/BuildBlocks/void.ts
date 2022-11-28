import Entity, { EntityInterface } from "../Entities/entity";
import { Vector } from 'p5';
import P5 from 'p5';
import { config, globals } from "../utils/singletons";

interface VoidInterface extends EntityInterface {
    size: number;
}

class Void extends Entity implements VoidInterface {
    size: number;
    constructor(atPosition:Vector) {
        super(atPosition.x, atPosition.y);
        this.size = config.gridSize;

    }

    drawDebug(p5: P5): void {
        
    }

    draw(p5: P5) {
        if (!globals.debug) return;
        p5.push();

        p5.translate(this.pos.x*config.gridSize, this.pos.y*config.gridSize);
        p5.noStroke();
        p5.fill(255, 0, 0, 64);
        p5.rect(0, 0, this.size, this.size);

        p5.pop();
    }
}

export default Void;