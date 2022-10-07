class Moveable extends Entity{
 
    constructor(x, y,img,  calculated = false){
        super(x,y);
        if(!calculated){
            this.pos.mult(SIZE)
        }
        this.dir = null;
        this.lastpos = this.pos;
        this.img = loadImage(img);
        this.flipped = false;
        // this.queuedir = createVector(0,0);
    }

     checkForCollision(dirtocheck = this.dir) {
         // check for collision with borders
         if (!dirtocheck) return;
         return map.some(entity => {
             if (entity.isColliding(this.pos, this._size, dirtocheck)) {
                 entity.onCollision(this);
                 switch (entity.constructor.name) {
                     case "Border":
                         return true;
                     case "Cookie":
                         this.points++;
                         console.log(this.points)
                         return false;
                 }
             }
         });

     }
    update() {
        console.log(this.queuedir?.x, this.queuedir?.y);
        this.lastpos = this.pos;
        if (!this.checkForCollision(this.queuedir)) {
            this.dir = this.queuedir;
            // this.queuedir = createVector(0, 0);
        }
        if (!this.checkForCollision()) {
            this.pos.add(this.dir);
            if (this.pos.x > width) {
                this.pos.x = 0;
            }
            if (this.pos.x < 0) {
                this.pos.x = width - SIZE;
            }
        }
    }
}