
class Lama {

    constructor( atPosition, size) {
        this.pos = atPosition.mult(size);
        this.lastpos = this.pos;
        this._size = size;
        this.queuedir = null;
        this.dir = createVector(0, 0);
        this.img = loadImage("./src/Lama.png");
    }

    resetQueue(){
        this.queuedir = null;
    }

    draw() {

        push();

        translate(this.pos);
        noStroke();

        fill("yellow");
        // include img
        image(this.img, 0, 0, this._size, this._size);
        // p5.ellipse(0, 0, this._size);

        pop();
    }

    getKeys() {
        return {
            up: keyIsDown(UP_ARROW),
            down: keyIsDown(DOWN_ARROW),
            left: keyIsDown(LEFT_ARROW),
            right: keyIsDown(RIGHT_ARROW),
            // stop: (this.dir.x === 0 && this.dir.y === 0)
        };
    }

    listenForKeys() {
        const keys = this.getKeys();
        if(keys.up){
            this.queuedir = createVector(0, -this._size);
        }
        if(keys.down){
            this.queuedir = createVector(0, this._size);
        }
        if(keys.left){
            this.queuedir = createVector(-this._size, 0);
        }
        if(keys.right){
            this.queuedir = createVector(this._size, 0);
        }
        // if(keys.stop){
        //     this.queuedir = createVector(0, 0);
        // }

    }


    update(){
        this.lastpos = this.pos;
        if(!this.checkForCollision(this.queuedir)){
            this.dir = this.queuedir;
            // this.queuedir = createVector(0, 0);
        }
        if(!this.checkForCollision()){
            this.pos.add(this.dir);
        }
    }

    checkForCollision(dirtocheck = this.dir){
        // check for collision with borders
        return borders.some(border => {
            return border.pos.x === this.pos.x + dirtocheck.x && border.pos.y === this.pos.y + dirtocheck.y
        });

    }
}


class Border {
    
        constructor( atPosition, size, calculated=false) {
            this.pos = atPosition;
            if(!calculated){
                this.pos = atPosition.mult(size);
            }
            this._size = size;
        }
    
        draw() {
    
            push();
    
            translate(this.pos);
            noStroke();
    
            fill("red");
            rect(0, 0, this._size, this._size);
            pop();
        }
}