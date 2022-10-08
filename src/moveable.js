class Moveable extends Entity {

    constructor(x, y, img) {
        super(x, y);
        this.dir = null;
        this.lastpos = this.pos;
        this.img = loadImage(img);
        this.flipped = false;
        this.smoothness = LAMA_SMOOTHNESS;
        this.movementFraction = new Fraction(0,0);
        this.queuedir = createVector(0, 0);
        this.logicalPosition = this.pos;
        console.log(this.logicalPosition);
    }

    isInGrid() {
        return this.movementFraction.toFloat() == 1 || this.movementFraction.toFloat() == 0;
    }

    checkForCollision(dirtocheck = this.dir) {
        // check for collision with borders
        if (!dirtocheck) return;
        let x = this.logicalPosition.x + dirtocheck.x;
        let y = this.logicalPosition.y + dirtocheck.y;
        if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) {
            return false;
        }
        let objectToCheck = arrayMap[x][y];
        if (!objectToCheck) return false;
        if (objectToCheck && objectToCheck !== this && dirtocheck === this.dir) {
            console.log("COLL")
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


    move(){
        this.pos.add(this.dir.copy().mult(this.smoothness.toFloat()));
        this.movementFraction = this.movementFraction.add(this.smoothness);
        if (this.movementFraction.toFloat() >= 1) {
            // Normalize the Vectors
            // Get the nomralized Direction Vector
            if (this.pos.x > GRID_WIDTH) {
                this.logicalPosition.x = 0;

            }
            if (this.pos.x < 0) {
                this.logicalPosition.x = GRID_WIDTH;
            }
            let normalizedDir = this.dir.copy().normalize();
            this.logicalPosition = createVector(round(this.logicalPosition.x + normalizedDir.x), round(this.logicalPosition.y + normalizedDir.y));
            this.pos = this.logicalPosition.copy();

            this.movementFraction = new Fraction(0, 0);
        }

        
    }

    update() {
        // Check if the lama could move in a new direction
        if (this.isInGrid() && !this.checkForCollision(this.queuedir)) {
            this.dir = this.queuedir;
            // this.queuedir = createVector(0, 0);
        }

        if (!this.checkForCollision()) {
           this.move();
        }
    }
}

function customLerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}