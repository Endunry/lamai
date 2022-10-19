import P5, { Vector } from "p5";
import { SIZE } from ".";
import Entity from "./entity";

class Door extends Entity{
    size: number;
    constructor(x:number,y:number){
        super(x,y);
        this.size = SIZE;
    }

    getLegalDirection(){
        // At the moment only y directions
        if(this.pos.y % 1 === 0){
            return new Vector(0,1);
        }else{
            return new Vector(0,-1);
        }
    }

    draw(p5: P5){
        p5.push();
        p5.translate(this.pos.x*SIZE, this.pos.y*SIZE);
        p5.noStroke();
        p5.fill("yellow");
        p5.rect(0, 0, this.size, this.size/2);
        p5.pop();
    }
}

export default Door;