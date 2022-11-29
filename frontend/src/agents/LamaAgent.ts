import Moveable, { MoveableInterface } from "../Entities/moveable";
import { Vector } from 'p5';
import P5 from 'p5';
import { config, getImages, globals } from '../utils/singletons';
import { initCanvas } from "..";
import Lama from "../Entities/lama";
import { LamaInterface } from './../Entities/lama';
import { GameMove } from "../types/game";


class LamaAgent extends Lama {
    size: number;
    constructor( atPosition: Vector, size: number) {
        super(atPosition, size);
    }

    die(){
        initCanvas();
    }

    static createLamaAgent(lama: LamaInterface){
        const lamaAgent = new LamaAgent(lama.pos, lama.size);
        return lamaAgent;
    }
    
    getKeys(p5: P5) {
        return {
            up: false,
            down: false,
            left: false,
            right: false,
        };
    }

    
    listenForKeys(dir: GameMove) {
        const power = 1;
        switch(dir){
            case 'up':
                this.queuedir = new Vector(0, -power);
                break;
            case 'down':
                this.queuedir = new Vector(0, power);
                break;
            case 'left':
                this.queuedir = new Vector(-power, 0);
                break;
            case 'right':
                this.queuedir = new Vector(power, 0);
                break;
        }

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
    //             this.pos.x = width-config.gridSize;
    //         }
    //     }
    // }


   
}



export default LamaAgent;