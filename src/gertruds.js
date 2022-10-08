// Timetable to switch between Scatter and Chase in lvl 1 of original Pacman:
/*

SCATTER/CHASE: 7" 20" 7" 20" 5" 20" 5" -

*/

class Gertrud extends Moveable {

    constructor(x, y, type) {
        super(x, y, `./src/Gertrud${type}.png`);
        this._size = SIZE;
        this.state = "idle"; // idle (only at the start of the game), escaping (escaping the home),  scatter, chase, frightened, eaten
        this.target = null; // the target tile (determined by the state and type of ghost)
        this.collided = true;
        this.scatterTarget = null;
        this.firstState = "escaping";
        this.targetColor = null;
        this.dir = createVector(1, 0);
    }


    start() {
        this.state = this.firstState;
    }

    scatter(){
        this.state = "scatter";
    }

    chase(){
        this.state = "chase";
    }

    flee(){
        this.state = "frightened";
    }
    
    eaten(){
        this.state = "eaten";
    }



    calculateTarget() {
        switch (this.state) {
            case "escaping":
                console.log("Still escpaing");
                if (HOME_TARGET) {
                    if (this.pos.dist(HOME_TARGET) < 0.5) {
                        this.state = "scatter";
                        return this.scatterTarget;
                    }
                    return HOME_TARGET;
                }
                case "scatter":
                    return this.scatterTarget;
                case "chase":
                    return this.chaseTarget();
                case "frightened":
                    return this.frightenedTarget();
                case "eaten":
                    return this.eatenTarget();
        }
    }

    chaseTarget(){
        return this.scatterTarget;
    }

    frightenedTarget(){
        return this.scatterTarget;
    }

    eatenTarget(){
        return HOME_TARGET;
    }

    getPossibleDirections() {
        let possibleDirections = [];
        for (let dir of [createVector(GERTRUD_SPEED, 0), createVector(-GERTRUD_SPEED, 0), createVector(0, GERTRUD_SPEED), createVector(0, -GERTRUD_SPEED)]) {

            if (this.checkForCollision(dir)) continue;
            if (this.dir.copy().mult(-1).equals(dir)) continue;
            possibleDirections.push(dir);
        }
        return possibleDirections;
    }


    move() {
        this.pos.add(this.dir);
    }

    draw() {

        if (this.state != "frigthened" && this.state != "eaten") {
            push();
            if (DEBUG) {
                fill(this.targetColor);
                circle(this.pos.x * SIZE, this.pos.y * SIZE, SIZE / 2);
            }
            translate(this.pos.x * SIZE + this._size / 2, this.pos.y * SIZE + this._size / 2);
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

            image(this.img, 0, 0, this._size * 1.9, this._size * 1.9);
            // include img
            // p5.ellipse(0, 0, this._size);

            pop();
            if (DEBUG && this.target && this.targetColor) {
                fill(this.targetColor);
                ellipse(this.target.x * SIZE, this.target.y * SIZE, 10, 10);
            }
        }
    }



    update() {
        if (this.state == "idle") return;
        /* General Logic:
        1. Check if the ghost is at a tile
        2. If yes, calculate the next target tile
            3. Get all possible directions to move to (no collisions, no 180° turns)
            4. Choose the direction with the shortest distance to the target tile
            5. Move in that direction*/
        if (this.isInGrid()) {
            this.target = this.calculateTarget();
            let possibleDirections = this.getPossibleDirections();
            // console.log(possibleDirections);
            // clearInterval(timeInterval);
            let shortestDistance = Infinity;
            let shortestDirection = null;
            for (let dir of possibleDirections) {
                let distance = this.target.dist(this.pos.copy().add(dir));
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    shortestDirection = dir;
                }
            }
            this.dir = shortestDirection;
            this.move();
        } else {
            this.move();
        }

    }

}

class Pinky extends Gertrud {
    constructor(x, y) {
        super(x, y, "2");
        this.scatterTarget = createVector(3, 0)
        this.targetColor = color("pink");
    }
}
class Blinky extends Gertrud {
    constructor(x, y) {
        super(x, y, "3");
        this.scatterTarget = createVector(GRID_WIDTH - 2, 0);
        this.targetColor = color("red");
    }

    chaseTarget(){
        return lama.pos;
    }
}
class Inky extends Gertrud {
    constructor(x, y) {
        super(x, y, "4");
        this.scatterTarget = createVector(GRID_WIDTH, GRID_HEIGHT - 1);
        this.targetColor = color("cyan");
    }
}
class Clyde extends Gertrud {
    constructor(x, y) {
        super(x, y, "1");
        this.scatterTarget = createVector(0, GRID_HEIGHT - 1);
        this.targetColor = color("orange");
    }
}