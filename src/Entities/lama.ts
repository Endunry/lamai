import Moveable, { MoveableInterface } from "./moveable";
import { Vector } from 'p5';
import P5 from 'p5';
import { config, getImages, globals } from '../utils/singletons';

export interface LamaInterface extends MoveableInterface{
    size: number;
    die: () => void;
    powerUp: () => void;
    listenForKeys: (p5: P5) => void;
}

class Lama extends Moveable implements LamaInterface {
    size: number;
    p5: P5;
    constructor( atPosition: Vector, size: number) {
        super(atPosition.x, atPosition.y);
        (atPosition);
        this.points = 0;
        this.size = size;
    }

    die(){
        // clearInterval(timeInterval);
        // initGame();
        alert("You died!");
    }

    draw(p5: P5) {
    
        p5.push();
        p5.translate(this.pos.x * config.dimensions.gridSize + this.size/2, this.pos.y * config.dimensions.gridSize + this.size/2);
        p5.noStroke();
        if(globals.debug){
            p5.noFill();
            p5.stroke("orange");
            p5.strokeWeight(3);
            p5.ellipse(0, 0, config.dimensions.gridSize*8*2, config.dimensions.gridSize*8*2);
            
        }
        p5.strokeWeight(1);
        // flip the lama if he is moving left
        if(this.dir && (this.dir.x < 0 || this.flipped)){
            if(this.dir.x > 0){
                this.flipped = false;
            }else{
                p5.scale(-1,1);
                this.flipped = true;
            }
        }

        
        p5.image(getImages().pacman, 0, 0, this.size * 1.9, this.size * 1.9);
        p5.fill("yellow");
        // include img
        // p5.ellipse(0, 0, this._size);

        p5.pop();
        if (globals.debug) {
            p5.fill(255, 0, 0);
            p5.ellipse(this.pos.x*config.dimensions.gridSize, this.pos.y*config.dimensions.gridSize, this.size / 2, this.size / 2);
            p5.fill(255, 255, 0);
            p5.ellipse(this.logicalPosition.x*config.dimensions.gridSize, this.logicalPosition.y*config.dimensions.gridSize, this.size / 2, this.size / 2);
        }
    }

    powerUp(){
        return;
    }

    getKeys(p5: P5) {
        return {
            up: p5.keyIsDown(p5.UP_ARROW),
            down: p5.keyIsDown(p5.DOWN_ARROW),
            left: p5.keyIsDown(p5.LEFT_ARROW),
            right: p5.keyIsDown(p5.RIGHT_ARROW),
            // stop: (this.dir.x === 0 && this.dir.y === 0)
        };
    }

    listenForKeys(p5: P5) {
        const keys = this.getKeys(p5);
        const power = 1;
        if(keys.up){
            this.queuedir = new Vector(0, -power);
        }
        if(keys.down){
            this.queuedir = new Vector(0, power);
        }
        if(keys.left){
            this.queuedir = new Vector(-power, 0);
        }
        if(keys.right){
            this.queuedir = new Vector(power, 0);
        }
        // if(keys.stop){
        //     this.queuedir = createVector(0, 0);
        // }

    }

   


    // update(){
    //     (this.queuedir?.x, this.queuedir?.y);
    //     this.lastpos = this.pos;
    //     if(!this.checkForCollision(this.queuedir)){
    //         this.dir = this.queuedir;
    //         // this.queuedir = createVector(0, 0);
    //     }
    //     if(!this.checkForCollision()){
    //         this.pos.add(this.dir);
    //         if(this.pos.x > width){
    //             this.pos.x = 0;
    //         }
    //         if(this.pos.x < 0){
    //             this.pos.x = width-config.dimensions.gridSize;
    //         }
    //     }
    // }


   
}



export default Lama;