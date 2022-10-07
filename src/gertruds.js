class Gertrud extends Moveable{

    constructor(x, y, type, calculated = false){
        super(x, y, `./src/Gertrud${type}.png`, calculated);
        this._size = SIZE;
        this.alive = true;
        this.type = type;
    }


    draw() {

        if(this.alive){
        push();
        translate(this.pos.x + this._size / 2, this.pos.y + this._size / 2);
        noStroke();
        // flip the lama if he is moving left
        if (this.dir && (this.dir.x < 0 || this.flipped)) {
            if (this.dir.x > 0) {
                this.flipped = false;
            } else {
                scale(-1, 1);
                this.flipped = true;
            }
        }


        image(this.img, 0, 0, this._size, this._size);
        fill("yellow");
        // include img
        // p5.ellipse(0, 0, this._size);

        pop();
    }
    }

    update(){
        if(this.alive){
            let randomInt = Math.floor(Math.random() * 4);
            let power = this._size * GERTRUD_SPEED;
            switch(randomInt){
                case 0:
                    this.queuedir = createVector(0, -power);
                    break;
                case 1:
                    this.queuedir = createVector(0, power);
                    break;
                case 2:
                    this.queuedir = createVector(-power, 0);
                    break;
                case 3:
                    this.queuedir = createVector(power, 0);
                    break;
            }
            super.update();
        }
    }

}