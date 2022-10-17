class Border extends Entity {

    constructor(atPosition) {
        super(atPosition.x, atPosition.y);
        this._size = SIZE;
    }

    isSat(border, no_border, _void) {
        for (let i of border) {
            if (this._neighbors[i] != 1) {
                return false;
            }
        }
        if (_void == undefined) {
            for (let i of  no_border) {
                if (this._neighbors[i] == 1) {
                    return false;
                }
            }
        } else if (_void) {
            for (let i of  no_border) {
                if (this._neighbors[i] != -1) {
                    return false;
                }
            }
        } else {
            for (let i of  no_border) {
                if (this._neighbors[i] != 0) {
                    return false;
                }
            }
        }
        return true;
    }

    //   7  0  4
    //   3     1
    //   6  2  5
    setNeighbors(neighbors) {
        this._neighbors = neighbors;

        if (BORDER_DRAWING == 'SIMPLE') {
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

            this._horizontal = this.isSat([1], [0, 3, 2]) || this.isSat([3], [0, 1, 2])
            this._vertical = this.isSat([0], [1, 2, 3]) || this.isSat([2], [1, 0, 3])

            this._single = this.isSat([], [0, 1, 2, 3])
        } else if (BORDER_DRAWING == 'ORIGINAL') {
            this._tr = this.isSat([3, 2],[6], false) || this.isSat([2, 3],[0, 1], false);
            this._br = this.isSat([0, 3],[7], false) || this.isSat([0, 3],[1, 2], false);
            this._bl = this.isSat([0, 1],[4], false) || this.isSat([0, 1],[2, 3], false);
            this._tl = this.isSat([1, 2],[5], false) || this.isSat([1, 2],[3, 0], false);
    
            this._horizontal = this.isSat([1], [0, 3, 2]) || this.isSat([3], [0, 1, 2]) || this.isSat([3, 1], [0], false) || this.isSat([3, 1], [2], false);
            this._horizontal_top = this._horizontal && this.isSat([], [0], true);
            this._horizontal_bottom = this._horizontal && this.isSat([], [2], true);
            if (this._horizontal_top && this._horizontal_bottom) this._horizontal = false;
            this._horizontal_left = this._horizontal && (this.isSat([3], []) || this.isSat([], [3], true));
            this._horizontal_right = this._horizontal && (this.isSat([1], []) || this.isSat([], [1], true));
    
            this._vertical = this.isSat([0], [1, 2, 3]) || this.isSat([2], [1, 0, 3]) || this.isSat([0, 2], [1], false) || this.isSat([0, 2], [3], false);
            this._vertical_right = this._vertical && this.isSat([], [1], true);
            this._vertical_left = this._vertical && this.isSat([], [3], true);
            if (this._vertical_right && this._vertical_left) this._vertical = false;
            this._vertical_top = this._vertical && (this.isSat([0], []) || this.isSat([], [0], true));
            this._vertical_bottom = this._vertical && (this.isSat([2], []) || this.isSat([], [2], true));
    
            this._single = this.isSat([], [0, 1, 2, 3]);
    
            this._void_top = this.isSat([3, 1], [0], true);
            this._void_bottom = this.isSat([3, 1], [2], true);
            this._void_right = this.isSat([0, 2], [1], true);
            this._void_left = this.isSat([0, 2], [3], true);
    
            this._void_outer_tr = this.isSat([2, 3],[0, 1], true);
            this._void_outer_br = this.isSat([0, 3],[1, 2], true);
            this._void_outer_bl = this.isSat([0, 1],[2, 3], true);
            this._void_outer_tl = this.isSat([1, 2],[3, 0], true);
    
            this._void_inner_tr = this.isSat([0, 1],[4], true);
            this._void_inner_br = this.isSat([1, 2],[5], true);
            this._void_inner_bl = this.isSat([3, 2],[6], true);
            this._void_inner_tl = this.isSat([0, 3],[7], true);
        }
    }

    draw() {

        push();

        translate(this.pos.x * SIZE, this.pos.y * SIZE);
        if (DEBUG) {
            noStroke();
            fill(64, 64, 255, 64);
            rect(0, 0, this._size, this._size);
        }
        noFill();
        strokeWeight(4);
        stroke(64, 64, 255);

        let size = this._size;

        if (BORDER_DRAWING == 'SIMPLE') {
            let padding = size / 3;

            if (this._top || this._horizontal) {
                line(0, padding, size, padding);
            }
            if (this._bottom || this._horizontal) {
                line(0, size - padding, size, size - padding);
            }
            if (this._right || this._vertical) {
                line(size - padding, 0, size - padding, size);
            }
            if (this._left || this._vertical) {
                line(padding, 0, padding, size);
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

            if (this._single) {
                arc(size / 2, size / 2, size - padding * 2, size - padding * 2, 0, TWO_PI)
            }
        } else if (BORDER_DRAWING == 'ORIGINAL') {
            let padding = size / 2;
    
            if (this._horizontal_left) {
                line(0, padding, size / 2, padding);
            }
            if (this._horizontal_right) {
                line(size / 2, padding, size, padding);
            }
            if (this._vertical_top) {
                line(size - padding, 0, size - padding, size / 2);
            }
            if (this._vertical_bottom) {
                line(size - padding, size / 2, size - padding, size);
            }
    
            if (this._tr) {
                arc(0, size, padding * 2, padding * 2, 3 * HALF_PI, 0);
            }
            if (this._br) {
                arc(0, 0, padding * 2, padding * 2, 0, HALF_PI);
            }
            if (this._bl) {
                arc(size, 0, padding * 2, padding * 2, HALF_PI, 2 * HALF_PI);
            }
            if (this._tl) {
                arc(size, size, padding * 2, padding * 2, 2 * HALF_PI, 3 * HALF_PI);
            }
    
    
            padding = this._size / 3;
    
            if (this._single) {
                arc(size / 2, size / 2, size - padding * 2, size - padding * 2, 0, TWO_PI);
            }
    
    
            padding = 2;
    
            if (this._void_top || this._horizontal_top) {
                line(0, padding, size, padding);
            }
            if (this._void_bottom || this._horizontal_bottom) {
                line(0, size - padding, size, size - padding);
            }
            if (this._void_right || this._vertical_right) {
                line(size - padding, 0, size - padding, size);
            }
            if (this._void_left || this._vertical_left) {
                line(padding, 0, padding, size);
            }
    
            if (this._void_outer_tr) {
                arc(0, size, (size - padding) * 2, (size - padding) * 2, 3 * HALF_PI, 0);
            }
            if (this._void_outer_br) {
                arc(0, 0, (size - padding) * 2, (size - padding) * 2, 0, HALF_PI);
            }
            if (this._void_outer_bl) {
                arc(size, 0, (size - padding) * 2, (size - padding) * 2, HALF_PI, 2 * HALF_PI);
            }
            if (this._void_outer_tl) {
                arc(size, size, (size - padding) * 2, (size - padding) * 2, 2 * HALF_PI, 3 * HALF_PI);
            }
    
            if (this._void_inner_tr) {
                arc(size, 0, padding * 2, padding * 2, HALF_PI, 2 * HALF_PI);
            }
            if (this._void_inner_br) {
                arc(size, size, padding * 2, padding * 2, 2 * HALF_PI, 3 * HALF_PI);
            }
            if (this._void_inner_bl) {
                arc(0, size, padding * 2, padding * 2, 3 * HALF_PI, 0);
            }
            if (this._void_inner_tl) {
                arc(0, 0, padding * 2, padding * 2, 0, HALF_PI);
            }
        }
        pop();
    }
}