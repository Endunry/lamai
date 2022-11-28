// Timetable to switch between Scatter and Chase in lvl 1 of original Pacman:
/*

SCATTER/CHASE: 7" 20" 7" 20" 5" 20" 5" -

*/

import P5, { Vector } from "p5";
import HALF_PI from "p5";
import { GERTRUD_SMOOTHNESS } from "..";
import Moveable, { MoveableInterface } from "./moveable";
import { config, getImages, globals } from '../utils/singletons';
import { Image } from 'p5';
import game from "../Game";

let FLEESTART: Date;

export type GertrudState = 'idle' | 'escaping' | 'scatter' | 'chase' | 'frightened' | 'eaten';

interface GertrudInterface extends MoveableInterface {
    state: GertrudState;
    target: Vector;
    scatterTarget: Vector;
    firstState: GertrudState;
    targetColor: string;
    queuedState: GertrudState;
    size: number;
    fleeImg: Image;
    eatenImg: Image;
    image: Image;
    chaseTarget: () => Vector;
    calculateTarget: () => Vector;
    queueState: (state: GertrudState) => void;
    scatter: () => void;
    chase: () => void;
    flee: () => void;
    eaten: () => void;
    frightenedTarget: () => Vector;
    eatenTarget: () => Vector;
    getPossibleDirections: () => Vector[];
}

class Gertrud extends Moveable implements GertrudInterface {
    state: GertrudState;
    target: Vector;
    scatterTarget: Vector;
    firstState: GertrudState;
    targetColor: string;
    queuedState: GertrudState;
    fleeImg: Image;
    eatenImg: Image;
    image: Image;
    size: number;
    constructor(x: number, y: number, type: "blinky" | "pinky" | "inky" | "clyde") {
        super(x, y);
        this.size = config.gridSize;
        this.fleeImg = getImages().frightened;
        this.eatenImg = getImages().eaten;
        this.state = "idle"; // idle (only at the start of the game.getInstance()), escaping (escaping the home),  scatter, chase, frightened, eaten
        this.target = null; // the target tile (determined by the state and type of ghost)
        this.image = getImages()[type] || getImages().clyde;
        this.scatterTarget = null;
        this.firstState = 'escaping';
        this.smoothness = GERTRUD_SMOOTHNESS;
        this.targetColor = null;
        this.queuedState = this.firstState;
        this.dir = new Vector(1, 0);
    }


    start() {
        this.state = this.firstState;
    }

    queueState(state: GertrudState) {
        this.queuedState = state;
    }

    scatter() {
        if (this.state == "frightened" || this.state == "eaten") {
            this.queuedState = "scatter";
        } else {
            this.state = "scatter";
        }
    }

    chase() {
        if (this.state == "frightened" || this.state == "eaten") {
            this.queuedState = "chase";
        } else {
            this.state = "chase";
        }
    }

    flee() {
        if (this.state != "eaten") {
            FLEESTART = new Date()
            this.queueState(this.state);
            this.state = "frightened";
            // Turn around 180deg
            this.dir = this.dir.copy().mult(-1);
        }
    }

    eaten() {
        this.state = "eaten";
    }



    calculateTarget(): Vector {
        switch (this.state) {

            case "escaping":
                if (game.getInstance().homeTarget) {
                    if (this.logicalPosition.dist(game.getInstance().homeTarget) < 0.5) {
                        this.state = "scatter";
                        return this.scatterTarget;
                    }
                    return game.getInstance().homeTarget;
                }
            case "scatter":
                return this.scatterTarget;
            case "chase":
                return this.chaseTarget();
            case "frightened":
                if (!FLEESTART) {
                    this.state = this.queuedState;
                    FLEESTART = null;
                    return this.calculateTarget();
                }
                let thisTime = new Date();
                let timeDiff = thisTime.getTime() - FLEESTART.getTime();
                let seconds = Math.floor(timeDiff / 1000);
                if (seconds > 10) {
                    this.state = this.queuedState;
                    FLEESTART = null;
                    return this.calculateTarget();
                }
                return this.frightenedTarget();
            case "eaten":
                if (game.getInstance().homeTarget) {
                    if (this.logicalPosition.dist(game.getInstance().homeTarget) < 0.5) {
                        this.state = this.queuedState;
                        return this.calculateTarget();
                    }
                    return game.getInstance().homeTarget;
                }
        }
    }

    chaseTarget() {
        return this.scatterTarget;
    }

    frightenedTarget() {
        return new Vector(0, 0);
    }

    eatenTarget() {
        return game.getInstance().homeTarget;
    }

    getPossibleDirections() {
        let possibleDirections = [];
        const s = 1;
        for (let dir of [new Vector(s, 0), new Vector(-s, 0), new Vector(0, s), new Vector(0, -s)]) {

            if (this.checkForCollision(dir)) continue;
            if (this.dir.copy().mult(-1).equals(dir)) continue;
            possibleDirections.push(dir);
        }
        return possibleDirections;
    }

    move() {
        super.move();
        // Check if we collide with game.getInstance().lama

        // do a rect collision check
        if (game.getInstance().lama.pos.x < this.pos.x + 1 && game.getInstance().lama.pos.x + 1 > this.pos.x && game.getInstance().lama.pos.y < this.pos.y + 1 && game.getInstance().lama.pos.y + 1 > this.pos.y) {
            // collision detected!
            if (this.state == "frightened") {
                this.eaten();
            } else if (this.state != "eaten") {
                game.getInstance().lama.die();
            }
        }
    }

    drawDebug(p5: P5): void {
        p5.fill(this.targetColor);
        p5.circle(this.pos.x * config.gridSize, this.pos.y * config.gridSize, config.gridSize / 2);
        p5.fill(this.targetColor);
        p5.circle(this.logicalPosition.x * config.gridSize, this.logicalPosition.y * config.gridSize, config.gridSize / 2);

        if(this.target && this.targetColor){
            p5.fill(this.targetColor);
            p5.ellipse(this.target.x * config.gridSize, this.target.y * config.gridSize, 10, 10);
        }
    }

    draw(p5: P5) {


        p5.push();
        p5.translate(this.pos.x * config.gridSize + this.size / 2, this.pos.y * config.gridSize + this.size / 2);
        p5.noStroke();
        // flip the game.getInstance().lama if he is moving left
        if (this.dir && (this.dir.x < 0 || this.flipped)) {
            if (this.dir.x > 0) {
                this.flipped = false;
            } else {
                p5.scale(-1, 1);
                this.flipped = true;
            }
        }
        if (this.state == "frightened") {
            p5.image(this.fleeImg, 0, 0, this.size * 1.6, this.size * 1.6);
        } else if (this.state == "eaten") {
            p5.image(this.eatenImg, 0, 0, this.size * 1.6, this.size * 1.6);
        } else {
            p5.image(this.image, 0, 0, this.size * 1.9, this.size * 1.9);
        }
        // include img
        // p5.ellipse(0, 0, this.size);

        p5.pop();

    }



    update() {
        if (this.state == "idle") return;
        /* General Logic:
        1. Check if the ghost is at a tile
        2. If yes, calculate the next target tile
            3. Get all possible directions to move to (no collisions, no 180° turns)
            4. Choose the direction with the shortest distance to the target tile
            5. Move in that direction*/
        if (this.isInGrid()) {
            this.target = this.calculateTarget();
            let possibleDirections = this.getPossibleDirections();
            if (this.state == "frightened") {
                let newDir = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
                this.dir = newDir || this.dir;
            } else {
                // clearInterval(timeInterval);
                let shortestDistance = Infinity;
                let shortestDirection = null;
                for (let dir of possibleDirections) {
                    let distance = this.target.dist(this.pos.copy().add(dir));
                    if (distance < shortestDistance) {
                        shortestDistance = distance;
                        shortestDirection = dir;
                    }
                }
                this.dir = shortestDirection;
            }
            this.move();
        } else {
            this.move();
        }

    }

}

export class Pinky extends Gertrud {
    constructor(x: number, y: number) {
        super(x, y, "pinky");
        this.scatterTarget = new Vector(3, 0)
        this.targetColor = "pink";
    }

    chaseTarget() {
        if (game.getInstance().lama.dir.heading() == -HALF_PI) {
            return new Vector(game.getInstance().lama.logicalPosition.x - 4, game.getInstance().lama.logicalPosition.y - 4);
        } else {
            return game.getInstance().lama.logicalPosition.copy().add(game.getInstance().lama.dir.copy().mult(4));
        }
    }
}

export class Blinky extends Gertrud {
    constructor(x: number, y: number) {
        super(x, y, "blinky");
        this.scatterTarget = new Vector(globals.dimensions.gridWidth - 2, 0);
        this.targetColor = "red";
    }

    chaseTarget() {
        return game.getInstance().lama.pos;
    }
}

export class Inky extends Gertrud {
    constructor(x: number, y: number) {
        super(x, y, "inky");
        this.scatterTarget = new Vector(globals.dimensions.gridWidth, globals.dimensions.gridHeight - 1);
        this.targetColor = "cyan";
    }

    chaseTarget() {
        return new Vector(2 * game.getInstance().lama.logicalPosition.x - game.getInstance().blinky.logicalPosition.x, 2 * game.getInstance().lama.logicalPosition.y - game.getInstance().blinky.logicalPosition.y);
    }
}

export class Clyde extends Gertrud {
    constructor(x: number, y: number) {
        super(x, y, "clyde");
        this.scatterTarget = new Vector(0, globals.dimensions.gridHeight - 1);
        this.targetColor = "orange";
    }

    chaseTarget() {
        if (game.getInstance().lama.logicalPosition.dist(this.logicalPosition) < 8) {
            return this.scatterTarget;
        } else {
            return game.getInstance().lama.logicalPosition;
        }
    }
}

export default Gertrud;