
class Lama extends Moveable{

    constructor( atPosition, size) {
        super(atPosition.x, atPosition.y, "./src/Lama.png");
        console.log(atPosition);
        this.points = 0;
        this._size = size;
    }

    draw() {
    
        push();
        translate(this.pos.x * SIZE + this._size/2, this.pos.y * SIZE + this._size/2);
        noStroke();
        // flip the lama if he is moving left
        if(this.dir && (this.dir.x < 0 || this.flipped)){
            if(this.dir.x > 0){
                this.flipped = false;
            }else{
                scale(-1,1);
                this.flipped = true;
            }
        }

        
        image(this.img, 0, 0, this._size * 1.9, this._size * 1.9);
        fill("yellow");
        // include img
        // p5.ellipse(0, 0, this._size);

        pop();
        if (DEBUG) {
            fill(255, 0, 0);
            ellipse(this.pos.x*SIZE, this.pos.y*SIZE, this._size / 2, this._size / 2);
        }
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
        const power = LAMA_SPEED;
        if(keys.up){
            this.queuedir = createVector(0, -power);
        }
        if(keys.down){
            this.queuedir = createVector(0, power);
        }
        if(keys.left){
            this.queuedir = createVector(-power, 0);
        }
        if(keys.right){
            this.queuedir = createVector(power, 0);
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


