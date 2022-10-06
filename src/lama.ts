import P5 from "p5";

export default class Lama {
    _p5: P5;
    _pos: P5.Vector;
    _size: number;
    dir: P5.Vector;

    constructor(p5: P5, atPosition: P5.Vector, size: number) {
        this._p5 = p5;
        this._pos = atPosition;
        this._size = size;
        this.dir = p5.createVector(0, 0);

    }

    draw() {
        const p5 = this._p5; 

        p5.push();

        p5.translate(this._pos);
        p5.noStroke();
        p5.fill("yellow");
        p5.ellipse(0, 0, this._size);

        p5.pop();
    }

    getKeys() {
        return {
            up: this._p5.keyIsDown(this._p5.UP_ARROW),
            down: this._p5.keyIsDown(this._p5.DOWN_ARROW),
            left: this._p5.keyIsDown(this._p5.LEFT_ARROW),
            right: this._p5.keyIsDown(this._p5.RIGHT_ARROW),
        };
    }

    updateDirection() {
        const keys = this.getKeys();
        if (keys.up) {
            this.dir.y = -1;
        } else if (keys.down) {
            this.dir.y = 1;
        } else {
            this.dir.y = 0;
        }

        if (keys.left) {
            this.dir.x = -1;
        } else if (keys.right) {
            this.dir.x = 1;
        } else {
            this.dir.x = 0;
        }
    }

    update(){
        this._pos.add(this.dir);
    }
}
