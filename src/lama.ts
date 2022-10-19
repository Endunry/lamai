import Moveable, { MoveableInterface } from "./moveable";
import { Vector } from 'p5';
import { getP5 } from "./singletons";
import { DEBUG, SIZE } from ".";
import P5 from 'p5';

export interface LamaInterface extends MoveableInterface{
    size: number;
    die: () => void;
    powerUp: () => void;
    listenForKeys: () => void;
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

    draw() {
    
        this.p5.push();
        this.p5.translate(this.pos.x * SIZE + this.size/2, this.pos.y * SIZE + this.size/2);
        this.p5.noStroke();
        if(DEBUG){
            this.p5.noFill();
            this.p5.stroke("orange");
            this.p5.strokeWeight(3);
            this.p5.ellipse(0, 0, SIZE*8*2, SIZE*8*2);
            
        }
        this.p5.strokeWeight(1);
        // flip the lama if he is moving left
        if(this.dir && (this.dir.x < 0 || this.flipped)){
            if(this.dir.x > 0){
                this.flipped = false;
            }else{
                this.p5.scale(-1,1);
                this.flipped = true;
            }
        }

        
        // p5.image(this.img, 0, 0, this.size * 1.9, this.size * 1.9);
        this.p5.fill("yellow");
        // include img
        // p5.ellipse(0, 0, this._size);

        this.p5.pop();
        if (DEBUG) {
            this.p5.fill(255, 0, 0);
            this.p5.ellipse(this.pos.x*SIZE, this.pos.y*SIZE, this.size / 2, this.size / 2);
            this.p5.fill(255, 255, 0);
            this.p5.ellipse(this.logicalPosition.x*SIZE, this.logicalPosition.y*SIZE, this.size / 2, this.size / 2);
        }
    }

    powerUp(){
        return;
    }

    getKeys() {
        return {
            up: this.p5.keyIsDown(this.p5.UP_ARROW),
            down: this.p5.keyIsDown(this.p5.DOWN_ARROW),
            left: this.p5.keyIsDown(this.p5.LEFT_ARROW),
            right: this.p5.keyIsDown(this.p5.RIGHT_ARROW),
            // stop: (this.dir.x === 0 && this.dir.y === 0)
        };
    }

    listenForKeys() {
        const keys = this.getKeys();
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
    //             this.pos.x = width-SIZE;
    //         }
    //     }
    // }


   
}



export default Lama;