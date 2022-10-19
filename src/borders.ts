
import P5, { Vector } from 'p5';
import HALF_PI from 'p5';
import { SIZE, BORDER_DRAWING, DEBUG } from '.';
import Entity, { EntityInterface } from './entity';



interface BorderInterface extends EntityInterface{
    size: number;
    _neighbors: Array<number>;
    _top: boolean;
    _bottom: boolean;
    _left: boolean;
    _right: boolean;
    _outer_tr: boolean;
    _outer_br: boolean;
    _outer_bl: boolean;
    _outer_tl: boolean;
    _inner_tr: boolean;
    _inner_br: boolean;
    _inner_bl: boolean;
    _inner_tl: boolean;
    _horizontal_left: boolean;
    _horizontal_right: boolean;
    _vertical_top: boolean;
    _vertical_bottom: boolean;
    _single: boolean;
    _tr: boolean;
    _br: boolean;
    _bl: boolean;
    _tl: boolean;
    _horizontal: boolean;
    _horizontal_top: boolean;
    _horizontal_bottom: boolean;
    _vertical: boolean;
    _vertical_right: boolean;
    _vertical_left: boolean;
    _void_top: boolean;
    _void_bottom: boolean;
    _void_right: boolean;
    _void_left: boolean;
    _void_outer_tr: boolean;
    _void_outer_br: boolean;
    _void_outer_bl: boolean;
    _void_outer_tl: boolean;
    _void_inner_tr: boolean;
    _void_inner_br: boolean;
    _void_inner_bl: boolean;
    _void_inner_tl: boolean;
    isSat(border: Array<number>, no_border: Array<number>, _void: boolean | undefined) : boolean;
    setNeighbors(neighbors: Array<number>) : void;
}

class Border extends Entity implements BorderInterface {
    size: number;
    _top: boolean = false;
    _bottom: boolean = false;
    _left: boolean = false;
    _right: boolean = false;
    _neighbors: Array<number> = [];
    _outer_tr: boolean;
    _outer_br: boolean;
    _outer_bl: boolean;
    _outer_tl: boolean;
    _inner_tr: boolean;
    _inner_br: boolean;
    _inner_bl: boolean;
    _inner_tl: boolean;
    _horizontal_left: boolean;
    _horizontal_right: boolean;
    _vertical_top: boolean;
    _vertical_bottom: boolean;
    _single: boolean;
    _tr: boolean;
    _br: boolean;
    _bl: boolean;
    _tl: boolean;
    _horizontal: boolean;
    _horizontal_top: boolean;
    _horizontal_bottom: boolean;
    _vertical: boolean;
    _vertical_right: boolean;
    _vertical_left: boolean;
    _void_top: boolean;
    _void_bottom: boolean;
    _void_right: boolean;
    _void_left: boolean;
    _void_outer_tr: boolean;
    _void_outer_br: boolean;
    _void_outer_bl: boolean;
    _void_outer_tl: boolean;
    _void_inner_tr: boolean;
    _void_inner_br: boolean;
    _void_inner_bl: boolean;
    _void_inner_tl: boolean;
    constructor(atPosition: Vector) {
        super(atPosition.x, atPosition.y);
        this.size = SIZE;
    }

    isSat(border: Array<number>, no_border: Array<number>, _void? : boolean) {
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
    setNeighbors(neighbors : Array<number>) {
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

            this._horizontal_left = this.isSat([3], [0, 1, 2]) || (this.isSat([1], [0, 2]) && this.isSat([], [3], true));
            this._horizontal_right = this.isSat([1], [0, 3, 2]) || (this.isSat([3], [0, 2]) && this.isSat([], [1], true));

            this._vertical_top = this.isSat([0], [1, 2, 3]) || (this.isSat([2], [1, 3]) && this.isSat([], [0], true));
            this._vertical_bottom = this.isSat([2], [1, 0, 3]) || (this.isSat([0], [1, 3]) && this.isSat([], [2], true));

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

    draw(p5: P5) {

        p5.push();

        p5.translate(this.pos.x * SIZE, this.pos.y * SIZE);
        if (DEBUG) {
            p5.noStroke();
            p5.fill(64, 64, 255, 64);
            p5.rect(0, 0, this.size, this.size);
        }
        p5.noFill();
        p5.strokeWeight(4);
        p5.stroke(64, 64, 255);

        let size = this.size;

        if (BORDER_DRAWING == 'SIMPLE') {
            let padding = size / 3;

            if (this._top) {
                p5.line(0, padding, size, padding);
            }
            if (this._bottom) {
                p5.line(0, size - padding, size, size - padding);
            }
            if (this._right) {
                p5.line(size - padding, 0, size - padding, size);
            }
            if (this._left) {
                p5.line(padding, 0, padding, size);
            }

            if (this._horizontal_left) {
                p5.line(0, padding, size / 2, padding);
                p5.line(0, size - padding, size / 2, size - padding);
                if (!this._horizontal_right) {
                    p5.arc(size / 2, size / 2, size - padding * 2, size - padding * 2, 3 * p5.HALF_PI, p5.HALF_PI)
                }
            }
            if (this._horizontal_right) {
                p5.line(size / 2, padding, size, padding);
                p5.line(size / 2, size - padding, size, size - padding);
                if (!this._horizontal_left) {
                    p5.arc(size / 2, size / 2, size - padding * 2, size - padding * 2, p5.HALF_PI, 3 * p5.HALF_PI)
                }
            }
            if (this._vertical_top) {
                p5.line(size - padding, 0, size - padding, size / 2);
                p5.line(padding, 0, padding, size / 2);
                if (!this._vertical_bottom) {
                    p5.arc(size / 2, size / 2, size - padding * 2, size - padding * 2, 0, 2 * p5.HALF_PI)
                }
            }
            if (this._vertical_bottom) {
                p5.line(size - padding, size / 2, size - padding, size);
                p5.line(padding, size / 2, padding, size);
                if (!this._vertical_top) {
                    p5.arc(size / 2, size / 2, size - padding * 2, size - padding * 2, 2 * p5.HALF_PI, 0)
                }
            }

            p5.noFill();

            if (this._outer_tr) {
                p5.arc(0, size, (size - padding) * 2, (size - padding) * 2, 3 * p5.HALF_PI, 0);
            }
            if (this._outer_br) {
                p5.arc(0, 0, (size - padding) * 2, (size - padding) * 2, 0, p5.HALF_PI);
            }
            if (this._outer_bl) {
                p5.arc(size, 0, (size - padding) * 2, (size - padding) * 2, p5.HALF_PI, 2 * p5.HALF_PI);
            }
            if (this._outer_tl) {
                p5.arc(size, size, (size - padding) * 2, (size - padding) * 2, 2 * p5.HALF_PI, 3 * p5.HALF_PI);
            }


            if (this._inner_tr) {
                p5.arc(size, 0, padding * 2, padding * 2, p5.HALF_PI, 2 * p5.HALF_PI);
            }
            if (this._inner_br) {
                p5.arc(size, size, padding * 2, padding * 2, 2 * p5.HALF_PI, 3 * p5.HALF_PI);
            }
            if (this._inner_bl) {
                p5.arc(0, size, padding * 2, padding * 2, 3 * p5.HALF_PI, 0);
            }
            if (this._inner_tl) {
                p5.arc(0, 0, padding * 2, padding * 2, 0, p5.HALF_PI);
            }

            if (this._single) {
                p5.arc(size / 2, size / 2, size - padding * 2, size - padding * 2, 0, p5.TWO_PI)
            }
        } else if (BORDER_DRAWING == 'ORIGINAL') {
            let padding = size / 2;
    
            if (this._horizontal_left) {
                p5.line(0, padding, size / 2, padding);
            }
            if (this._horizontal_right) {
                p5.line(size / 2, padding, size, padding);
            }
            if (this._vertical_top) {
                p5.line(size - padding, 0, size - padding, size / 2);
            }
            if (this._vertical_bottom) {
                p5.line(size - padding, size / 2, size - padding, size);
            }
    
            if (this._tr) {
                p5.arc(0, size, padding * 2, padding * 2, 3 * p5.HALF_PI, 0);
            }
            if (this._br) {
                p5.arc(0, 0, padding * 2, padding * 2, 0, p5.HALF_PI);
            }
            if (this._bl) {
                p5.arc(size, 0, padding * 2, padding * 2, p5.HALF_PI, 2 * p5.HALF_PI);
            }
            if (this._tl) {
                p5.arc(size, size, padding * 2, padding * 2, 2 * p5.HALF_PI, 3 * p5.HALF_PI);
            }
    
    
            padding = this.size / 3;
    
            if (this._single) {
                p5.arc(size / 2, size / 2, size - padding * 2, size - padding * 2, 0, p5.TWO_PI);
            }
    
    
            padding = 2;
    
            if (this._void_top || this._horizontal_top) {
                p5.line(0, padding, size, padding);
            }
            if (this._void_bottom || this._horizontal_bottom) {
                p5.line(0, size - padding, size, size - padding);
            }
            if (this._void_right || this._vertical_right) {
                p5.line(size - padding, 0, size - padding, size);
            }
            if (this._void_left || this._vertical_left) {
                p5.line(padding, 0, padding, size);
            }
    
            if (this._void_outer_tr) {
                p5.arc(0, size, (size - padding) * 2, (size - padding) * 2, 3 * p5.HALF_PI, 0);
            }
            if (this._void_outer_br) {
                p5.arc(0, 0, (size - padding) * 2, (size - padding) * 2, 0, p5.HALF_PI);
            }
            if (this._void_outer_bl) {
                p5.arc(size, 0, (size - padding) * 2, (size - padding) * 2, p5.HALF_PI, 2 * p5.HALF_PI);
            }
            if (this._void_outer_tl) {
                p5.arc(size, size, (size - padding) * 2, (size - padding) * 2, 2 * p5.HALF_PI, 3 * p5.HALF_PI);
            }
    
            if (this._void_inner_tr) {
                p5.arc(size, 0, padding * 2, padding * 2, p5.HALF_PI, 2 * p5.HALF_PI);
            }
            if (this._void_inner_br) {
                p5.arc(size, size, padding * 2, padding * 2, 2 * p5.HALF_PI, 3 * p5.HALF_PI);
            }
            if (this._void_inner_bl) {
                p5.arc(0, size, padding * 2, padding * 2, 3 * p5.HALF_PI, 0);
            }
            if (this._void_inner_tl) {
                p5.arc(0, 0, padding * 2, padding * 2, 0, p5.HALF_PI);
            }
        }
        p5.pop();
    }
}

export default Border;