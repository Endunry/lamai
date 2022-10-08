// Timetable to switch between Scatter and Chase in lvl 1 of original Pacman:
/*

SCATTER/CHASE: 7" 20" 7" 20" 5" 20" 5" -

*/

class Gertrud extends Moveable{

    constructor(x, y, type, calculated = false){
        super(x, y, `./src/Gertrud${type}.png`, calculated);
        this._size = SIZE;
        this.state = "idle"; // idle (only at the start of the game), escaping (escaping the home),  scatter, chase, frightened, eaten
        this.target = null; // the target tile (determined by the state and type of ghost)
        this.collided = true;
        this.scatterTarget = null;
        this.firstState = "escaping";
        this.targetColor = null;
        this.dir = createVector(SIZE, 0);
    }

    isInGrid(){
        return this.pos.x % SIZE == 0 && this.pos.y % SIZE == 0;
    }

    start(){
        this.state = this.firstState;
    }

    calculateTarget(){
        switch(this.state){
            case "escaping":
                if (BLINKY_START_POS){   
                    if(this.pos.dist(BLINKY_START_POS) < 10){
                        this.state = "scatter";
                        return this.scatterTarget;
                    }
                    return BLINKY_START_POS;
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

    getPossibleDirections(){
        let possibleDirections = [];
        for(let dir of [createVector(SIZE*GERTRUD_SPEED,0), createVector(-SIZE*GERTRUD_SPEED,0), createVector(0,SIZE*GERTRUD_SPEED), createVector(0,-SIZE*GERTRUD_SPEED)]){

            if(this.checkForCollision(dir)) continue;
            if(this.dir.copy().mult(-1).equals(dir)) continue;
                possibleDirections.push(dir);
        }
        return possibleDirections;
    }


    move(){
        this.pos.add(this.dir);
    }

    draw() {

        if(this.state != "frigthened" && this.state != "eaten"){
        push();
        if (DEBUG) {
            fill(this.targetColor);
            circle(this.pos.x, this.pos.y, SIZE / 2);
        }
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

        image(this.img, 0, 0, this._size * 1.9, this._size * 1.9);
        // include img
        // p5.ellipse(0, 0, this._size);
        
        pop();
        if(this.target && this.targetColor){
            fill(this.targetColor);
            ellipse(this.target.x, this.target.y, 10, 10);
        }
    }
    }



    update(){
        if(this.state == "idle") return;
        /* General Logic:
        1. Check if the ghost is at a tile
        2. If yes, calculate the next target tile
            3. Get all possible directions to move to (no collisions, no 180° turns)
            4. Choose the direction with the shortest distance to the target tile
            5. Move in that direction*/
        if(this.isInGrid()){

            this.target = this.calculateTarget();
            if(!(this instanceof Blinky)) (this.target);
            let possibleDirections = this.getPossibleDirections();
            let shortestDistance = Infinity;
            let shortestDirection = null;
            for(let dir of possibleDirections){
                let distance = this.target.dist(this.pos.copy().add(dir));
                if(distance < shortestDistance){
                    shortestDistance = distance;
                    shortestDirection = dir;
                }
            }
            this.dir = shortestDirection;
            this.move();
        }else{
            this.move();    
        }

    }

}

class Pinky extends Gertrud{
    constructor(x, y, calculated = false){
        super(x, y, "2", calculated);
        this.scatterTarget = createVector(3, 0)
        this.scatterTarget.mult(SIZE);
        this.targetColor = color("pink");
    }
}
class Blinky extends Gertrud{
    constructor(x, y, calculated = false){
        super(x, y, "3", calculated);
        (x,y);
        this.scatterTarget = createVector(GRID_WIDTH - 2, 0);
        this.scatterTarget.mult(SIZE);
        this.targetColor = color("red");
        this.firstState = "scatter"
    }
}
class Inky  extends Gertrud{
    constructor(x, y, calculated = false){
        super(x, y, "4", calculated);
        this.scatterTarget = createVector(GRID_WIDTH, GRID_HEIGHT - 1);
        this.scatterTarget.mult(SIZE);
        this.targetColor = color("cyan");
    }
}
class Clyde extends Gertrud{
    constructor(x, y, calculated = false){
        super(x, y, "1", calculated);
        this.scatterTarget = createVector(0, GRID_HEIGHT - 1);
        this.scatterTarget.mult(SIZE);
        this.targetColor = color("orange");
    }
}