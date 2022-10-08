class Void extends Entity {

    constructor(atPosition) {
        super(atPosition.x, atPosition.y);
        this._size = SIZE;
    }

    draw() {
        if (!DEBUG) return;
        push();

        translate(this.pos.x*SIZE, this.pos.y*SIZE);
        noStroke();
        fill(255, 0, 0, 64);
        rect(0, 0, this._size, this._size);

        pop();
    }
}