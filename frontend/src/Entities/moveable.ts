import p5, { Image, Vector } from "p5";
import Entity, { EntityInterface } from "./entity";
import { LAMA_SMOOTHNESS } from '../index';
import Door from '../BuildBlocks/door';
import Fraction from "../utils/fraction";
import { config, globals } from "../utils/singletons";
import game from "../Game";

export interface MoveableInterface extends EntityInterface {
    dir: Vector | null;
    lastpos: Vector ;
    queuedir: Vector ;
    flipped: boolean ;
    smoothness: Fraction;
    movementFraction: Fraction;
    points: number;
    logicalPosition: Vector;
    update: () => void;
}   

class Moveable extends Entity implements MoveableInterface {

    dir: p5.Vector | null;
    lastpos: p5.Vector;
    queuedir: p5.Vector;
    flipped: boolean;
    smoothness: Fraction;
    movementFraction: Fraction;
    logicalPosition: p5.Vector;
    points: number;
    pos: p5.Vector;

    constructor(x: number, y:number) {
        super(x, y);
        this.dir = null;
        this.lastpos = this.pos;
        this.flipped = false;
        this.smoothness = LAMA_SMOOTHNESS;
        this.points = 0;
        this.movementFraction = new Fraction(0,0);
        this.queuedir = new Vector(0, 0);
        this.logicalPosition = this.pos;
    }

    
    isInGrid() {
        return this.movementFraction.toFloat() == 1 || this.movementFraction.toFloat() == 0;
    }

    checkForCollision(dirtocheck = this.dir) {
        // check for collision with borders
        if (!dirtocheck) return;
        let x = this.logicalPosition.x + dirtocheck.x;
        let y = this.logicalPosition.y + dirtocheck.y;
        if (x < 0 || x >= globals.dimensions.gridWidth || y < 0 || y >= globals.dimensions.gridHeight) {
            return false;
        }
        let objectToCheck = game.getInstance().map[x] && game.getInstance().map[x][y];
        if (!objectToCheck) return false;
        if (objectToCheck && objectToCheck !== this && dirtocheck === this.dir) {
            objectToCheck.onCollision(this);
        }
        switch (objectToCheck.constructor.name) {
            case "Border":
                return true;
            case "Door":
                return (objectToCheck as Door).getLegalDirection().heading() != dirtocheck.heading();
            case "Cookie":
                this.points++;
            default:
                return false;
        }
    }


    move(){
        if(!game.getInstance().started) return;
        if(!this.dir) return;
        this.pos.add(this.dir.copy().mult(this.smoothness.toFloat()));
        this.movementFraction = this.movementFraction.add(this.smoothness);
        if (this.movementFraction.toFloat() >= 1) {
            // Normalize the Vectors
            // Get the nomralized Direction Vector
            if (this.pos.x > globals.dimensions.gridWidth) {
                this.logicalPosition.x = 0;

            }
            if (this.pos.x < 0) {
                this.logicalPosition.x = globals.dimensions.gridWidth;
            }
            let normalizedDir = this.dir.copy().normalize();
            this.logicalPosition = new Vector(Math.round(this.logicalPosition.x + normalizedDir.x), Math.round(this.logicalPosition.y + normalizedDir.y));
            this.pos = this.logicalPosition.copy();
            this.movementFraction = new Fraction(0, 0);
        }

        
    }

    update() {
        // Check if the lama could move in a new direction
        if (this.isInGrid() && !this.checkForCollision(this.queuedir)) {
            this.dir = this.queuedir;
            // this.queuedir = createVector(0, 0);
        }

        if (!this.checkForCollision()) {
           this.move();
        }
    }
}

export default Moveable;