import P5, { Vector } from "p5";

export interface EntityInterface {
    pos: Vector;
    toJSON(): any;
    onCollision(other: Entity): void;
    isColliding(pos:Vector, size:number, dir:Vector): boolean;
    draw(p5: P5): void;
}

class Entity implements EntityInterface {
    pos: Vector;
    constructor(x: number, y: number){
        this.pos = new Vector(x,y);
    }

    draw(p5: P5){

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