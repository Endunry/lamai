class Void extends Entity {

    constructor(atPosition, calculated = false) {
        super(atPosition.x, atPosition.y);
        if (!calculated) {
            this.pos = atPosition.mult(SIZE);
        }
        this._size = SIZE;
    }

    draw() {
        if (!DEBUG) return;
        push();

        translate(this.pos);
        noStroke();
        fill(255, 0, 0, 64);
        rect(0, 0, this._size, this._size);

        pop();
    }
}