// Timetable to switch between Scatter and Chase in lvl 1 of original Pacman:
/*

SCATTER/CHASE: 7" 20" 7" 20" 5" 20" 5" -

*/

import p5, { Vector } from "p5";
import { SIZE, GERTRUD_SMOOTHNESS, DEBUG, GRID_WIDTH, GRID_HEIGHT, HOME_TARGET, lama, blinky } from ".";
import Moveable, { MoveableInterface } from "./moveable";

let FLEESTART: Date;

export type GertrudState = 'idle' | 'escaping' | 'scatter' | 'chase' | 'frightened' | 'eaten';

interface GertrudInterface extends MoveableInterface {
    state: GertrudState;
    target: p5.Vector;
    scatterTarget: p5.Vector;
    firstState: GertrudState;
    targetColor: p5.Color;
    queuedState: GertrudState;
    size: number;
    chaseTarget: () => p5.Vector;
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
    target: p5.Vector;
    scatterTarget: p5.Vector;
    firstState: GertrudState;
    targetColor: p5.Color;
    queuedState: GertrudState;
    size: number;
        constructor(x:number, y:number, type: any) {
            super(x, y);
            this.size = SIZE;
            // this.fleeImg = loadImage(`./src/assets/Gertrud5.png`);
            // this.eatenImg = loadImage(`./src/assets/Gertrud6.png`);
            this.state = "idle"; // idle (only at the start of the game), escaping (escaping the home),  scatter, chase, frightened, eaten
            this.target = null; // the target tile (determined by the state and type of ghost)
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

    queueState(state: GertrudState){
        this.queuedState = state;
    }

    scatter(){
        if (this.state == "frightened" || this.state == "eaten") {
            this.queuedState = "scatter";
        }else{
            this.state = "scatter";
        }
    }

    chase(){
        if (this.state == "frightened" || this.state == "eaten") {
            this.queuedState = "chase";
        } else {
            this.state = "chase";
        }
    }

    flee(){
        if(this.state != "eaten"){
            FLEESTART = new Date()
            this.state = "frightened";
            // Turn around 180deg
            this.dir = this.dir.copy().mult(-1);
        }
    }
    
    eaten(){
        this.state = "eaten";
    }



    calculateTarget() : Vector {
        switch (this.state) {

            case "escaping":
                if (HOME_TARGET) {
                    if (this.logicalPosition.dist(HOME_TARGET) < 0.5) {
                        this.state = "scatter";
                        return this.scatterTarget;
                    }
                    return HOME_TARGET;
                }
                case "scatter":
                    return this.scatterTarget;
                case "chase":
                    return this.chaseTarget();
                case "frightened":
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
                     if (HOME_TARGET) {
                         if (this.logicalPosition.dist(HOME_TARGET) < 0.5) {
                             this.state = this.queuedState;
                            return this.calculateTarget();
                         }
                         return HOME_TARGET;
                     }
        }
    }

    chaseTarget(){
        return this.scatterTarget;
    }

    frightenedTarget(){
        return new Vector(0,0);
    }

    eatenTarget(){
        return HOME_TARGET;
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
         // Check if we collide with lama

         // do a rect collision check
             if (lama.pos.x < this.pos.x + 1 && lama.pos.x + 1 > this.pos.x && lama.pos.y < this.pos.y + 1 && lama.pos.y + 1 > this.pos.y) {
                 // collision detected!
                 if (this.state == "frightened") {
                     this.eaten();
                 } else if (this.state != "eaten") {
                     lama.die();
                 }
             }
         }

    draw() {

        
            this.p5.push();
            if (DEBUG) {
                this.p5.fill(this.targetColor);
                this.p5.circle(this.pos.x * SIZE, this.pos.y * SIZE, SIZE / 2);
                this.p5.fill(this.targetColor);
                this.p5.circle(this.logicalPosition.x * SIZE, this.logicalPosition.y * SIZE, SIZE / 2);
            }
            this.p5.translate(this.pos.x * SIZE + this.size / 2, this.pos.y * SIZE + this.size / 2);
            this.p5.noStroke();
            // flip the lama if he is moving left
            if (this.dir && (this.dir.x < 0 || this.flipped)) {
                if (this.dir.x > 0) {
                    this.flipped = false;
                } else {
                    this.p5.scale(-1, 1);
                    this.flipped = true;
                }
            }
            if (this.state == "frightened") {
                // this.p5.image(this.fleeImg, 0, 0, this.size * 1.6, this.size * 1.6);
            } else if (this.state == "eaten") {
                // this.p5.image(this.eatenImg, 0, 0, this.size * 1.6, this.size * 1.6);
            }else{
                // this.p5.image(this.img, 0, 0, this.size * 1.9, this.size * 1.9);
            }
            // include img
            // p5.ellipse(0, 0, this.size);

            this.p5.pop();
            if (DEBUG && this.target && this.targetColor) {
                this.p5.fill(this.targetColor);
                this.p5.ellipse(this.target.x * SIZE, this.target.y * SIZE, 10, 10);
            }
        
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
            if(this.state == "frightened"){
                let newDir = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
                this.dir = newDir || this.dir;
            }else{
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
    constructor(x: number, y:number) {
        super(x, y, "2");
        this.scatterTarget = new Vector(3, 0)
        this.targetColor = this.p5.color("pink");
    }

    chaseTarget(){
        if(lama.dir.heading() == -this.p5.HALF_PI){
            return new Vector(lama.logicalPosition.x - 4, lama.logicalPosition.y - 4);
        } else{
            return lama.logicalPosition.copy().add(lama.dir.copy().mult(4));
        }
    }
}

export class Blinky extends Gertrud {
    constructor(x:number, y:number) {
        super(x, y, "3");
        this.scatterTarget = new Vector(GRID_WIDTH - 2, 0);
        this.targetColor = this.p5.color("red");
    }

    chaseTarget(){
        return lama.pos;
    }
}

export class Inky extends Gertrud {
    constructor(x: number, y: number) {
        super(x, y, "4");
        this.scatterTarget = new Vector(GRID_WIDTH, GRID_HEIGHT - 1);
        this.targetColor = this.p5.color("cyan");
    }

    chaseTarget(){
        return new Vector(2 * lama.logicalPosition.x - blinky.logicalPosition.x, 2 * lama.logicalPosition.y - blinky.logicalPosition.y);
    }
}

export class Clyde extends Gertrud {
    constructor(x:number, y:number) {
        super(x, y, "1");
        this.scatterTarget = new Vector(0, GRID_HEIGHT - 1);
        this.targetColor = this.p5.color("orange");
    }

    chaseTarget(){
        if(lama.logicalPosition.dist(this.logicalPosition) < 8){
            return this.scatterTarget;
        } else{
            return lama.logicalPosition;
        }
    }
}

export default Gertrud;