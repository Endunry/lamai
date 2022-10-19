import P5, { Color, Vector } from "p5";
import { SIZE, LAMA_SMOOTHNESS, arrayMap, lama, pinky, inky, clyde, blinky } from ".";
import Entity, { EntityInterface } from "./entity";
import Lama, { LamaInterface } from "./lama";

interface CollectibleInterface extends EntityInterface {
    width: number;
    height: number;
    color: string;
}

class Collectible extends Entity implements CollectibleInterface {
    width: number;
    height: number;
    color: string;
    constructor(x:number, y:number, width:number, height:number, color: string){
        super(x,y);
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(p5: P5){
        p5.push();
        p5.translate(this.pos.x * SIZE, this.pos.y * SIZE);
        p5.fill(this.color);
        p5.ellipse(SIZE/2, SIZE/2 , this.width, this.height);
        p5.pop();
    }



    isColliding(pos: Vector, size: number, dir: Vector) {
        const actualPosition = new Vector(this.pos.x + SIZE/2, this.pos.y + SIZE/2);
        const actualOtherPosition = new Vector(pos.x + SIZE/2, pos.y + SIZE/2);
        const radius = this.width/2;
        const distance = actualPosition.dist(actualOtherPosition);
        return distance < radius+SIZE/2+LAMA_SMOOTHNESS.toFloat();
    }
}

Collectible.prototype.toJSON = function(){
    return {
        x: this.pos.x,
        y: this.pos.y,
        width: this.width,
        height: this.height,
        color: this.color
    }
}

export class Cookie extends Collectible{
    constructor(x: number, y:number){
        super(x, y,10, 10, "orange" );
    }

        onCollision(other: EntityInterface) {
            if (other.constructor.name == "Lama") {
                (other as LamaInterface).points++;
                arrayMap[this.pos.x][this.pos.y] = null;
            }
        }
}

export class Power extends Collectible{
    constructor(x:number, y:number){
        super(x, y, 20,20 ,"purple");
    }

        onCollision(other: EntityInterface) {
            if (other.constructor.name == "Lama") {
                (other as LamaInterface).points+= 50;
                arrayMap[this.pos.x][this.pos.y] = null;
                lama.powerUp();
                pinky && pinky.flee()
                inky && inky.flee()
                clyde && clyde.flee()
                blinky && blinky.flee()
            }
        }
}

export default Collectible;