class Border extends Entity {

    constructor(atPosition, calculated = false) {
        super(atPosition.x, atPosition.y);
        if (!calculated) {
            this.pos = atPosition.mult(SIZE);
        }
        this._size = SIZE;
        this._padding = SIZE / 3
    }

    isSat(border, no_border) {
        for (let i of border) {
            if (!this._neighbors[i]) {
                return false
            }
        }
        for (let i of  no_border) {
            if (this._neighbors[i]) {
                return false
            }
        }
        return true
    }

    //   7  0  4
    //   3     1
    //   6  2  5
    setNeighbors(neighbors) {
        this._neighbors = neighbors

        this._top = this.isSat([3, 1], [0])
        this._bottom = this.isSat([3, 1], [2])
        this._right = this.isSat([0, 2], [1])
        this._left = this.isSat([0, 2], [3])

        this._outer_tr = this.isSat([2, 3],[0, 1])
        this._outer_br = this.isSat([0, 3],[1, 2])
        this._outer_bl = this.isSat([0, 1],[2, 3])
        this._outer_tl = this.isSat([1, 2],[3, 0])

        this._inner_tr = this.isSat([0, 1],[4])
        this._inner_br = this.isSat([1, 2],[5])
        this._inner_bl = this.isSat([3, 2],[6])
        this._inner_tl = this.isSat([0, 3],[7])
    }

    draw() {

        push();

        translate(this.pos);
        // fill("gray");
        // rect(0, 0, this._size, this._size);
        strokeWeight(4);
        stroke(64, 64, 255)

        let padding = this._padding
        let size = this._size

        if (this._top) {
            line(0, padding, size, padding)
        }
        if (this._bottom) {
            line(0, size - padding, size, size - padding)
        }
        if (this._right) {
            line(size - padding, 0, size - padding, size)
        }
        if (this._left) {
            line(padding, 0, padding, size)
        }
        
        noFill();

        if (this._outer_tr) {
            arc(0, size, (size - padding) * 2, (size - padding) * 2, 3 * HALF_PI, 0);
        }
        if (this._outer_br) {
            arc(0, 0, (size - padding) * 2, (size - padding) * 2, 0, HALF_PI);
        }
        if (this._outer_bl) {
            arc(size, 0, (size - padding) * 2, (size - padding) * 2, HALF_PI, 2 * HALF_PI);
        }
        if (this._outer_tl) {
            arc(size, size, (size - padding) * 2, (size - padding) * 2, 2 * HALF_PI, 3 * HALF_PI);
        }

        if (this._inner_tr) {
            arc(size, 0, padding * 2, padding * 2, HALF_PI, 2 * HALF_PI);
        }
        if (this._inner_br) {
            arc(size, size, padding * 2, padding * 2, 2 * HALF_PI, 3 * HALF_PI);
        }
        if (this._inner_bl) {
            arc(0, size, padding * 2, padding * 2, 3 * HALF_PI, 0);
        }
        if (this._inner_tl) {
            arc(0, 0, padding * 2, padding * 2, 0, HALF_PI);
        }


        // if (this._neighbors) {
        //     if (!this._neighbors[0]) { // top
        //         line(this._padding, this._padding, this._size - this._padding, this._padding)
        //     }
        //     if (!this._neighbors[1]) { // right
        //         line(this._size - this._padding, this._padding, this._size - this._padding, this._size - this._padding)
        //     }
        //     if (!this._neighbors[2]) { // bottom
        //         line(this._padding, this._size - this._padding, this._size - this._padding, this._size - this._padding)
        //     }
        //     if (!this._neighbors[3]) { // left
        //         line(this._padding, this._padding, this._padding, this._size - this._padding)
        //     }
        // }

        pop();
    }
}