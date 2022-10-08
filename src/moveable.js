class Moveable extends Entity {

    constructor(x, y, img) {
        super(x, y);
        this.dir = null;
        this.lastpos = this.pos;
        this.img = loadImage(img);
        this.flipped = false;
        // this.queuedir = createVector(0,0);
    }

    isInGrid() {
        // Check if the position is on the grid
        let decimalX = this.pos.x - floor(this.pos.x);
        let decimalY = this.pos.y - floor(this.pos.y);
        let controlDecimal = 0.1*7 - floor(0.1*7);

        return (decimalX <= controlDecimal && decimalY <= controlDecimal);
        
    }

    checkForCollision(dirtocheck = this.dir) {
        // check for collision with borders
        if (!dirtocheck) return;
        let x = this.pos.x + dirtocheck.x;
        let y = this.pos.y + dirtocheck.y;
        if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) {
            return false;
        }
        let objectToCheck = arrayMap[floor(x)][floor(y)];
        if (!objectToCheck) return false;
        if (objectToCheck && objectToCheck !== this) {
            objectToCheck.onCollision(this);
        }
        switch (objectToCheck.constructor.name) {
            case "Border":
                return true;
            case "Door":
                return objectToCheck.getLegalDirection().heading() != dirtocheck.heading();
            case "Cookie":
                this.points++;
            default:
                return false;
        }
    }
    update() {
        this.lastpos = this.pos;
        console.log(this.isInGrid());
        // Check if the lama could move in a new direction
        if (this.isInGrid() && !this.checkForCollision(this.queuedir)) {
            this.dir = this.queuedir;
            // this.queuedir = createVector(0, 0);
        }
        if (!this.checkForCollision()) {
            this.pos.add(this.dir);
            if (this.pos.x > GRID_WIDTH) {
                this.pos.x = 0;
            }
            if (this.pos.x < 0) {
                this.pos.x = GRID_WIDTH;
            }
        }
    }
}