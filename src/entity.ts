import P5, { Vector } from "p5";
import { getP5 } from "./singletons";

export interface EntityInterface {
    pos: Vector;
    updateP5(): void;
    toJSON(): any;
    onCollision(other: Entity): void;
    isColliding(pos:Vector, size:number, dir:Vector): boolean;
    draw(): void;
    p5: P5;
}

class Entity implements EntityInterface {
    pos: Vector;
    p5: P5;
    constructor(x: number, y: number){
        this.pos = new Vector(x,y);
        this.p5 = getP5();
    }

    draw(){

    }  
    updateP5(){
        this.p5 = getP5();
    }

    onCollision(other:Entity){
        // ("Collision", other)
    }

    isColliding(pos: Vector, size: number, dir: Vector){
        return pos.x + dir.x < this.pos.x + size && pos.x + dir.x + size > this.pos.x && pos.y + dir.y < this.pos.y + size && pos.y + dir.y + size > this.pos.y;
    }

    toJSON(){
        return {
            x: this.pos.x,
            y: this.pos.y
        }
    }

}

export default Entity;