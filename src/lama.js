
class Lama extends Moveable{

    constructor( atPosition, size, calculated=false) {
        super(atPosition.x, atPosition.y, "./src/Lama.png", calculated);
        this.points = 0;
        this._size = size;
    }

    draw() {

        push();
        translate(this.pos.x + this._size/2, this.pos.y + this._size/2);
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

        
        image(this.img, 0, 0, this._size, this._size);
        fill("yellow");
        // include img
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
        const power = this._size * LAMA_SPEED;
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
    //     console.log(this.queuedir?.x, this.queuedir?.y);
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


