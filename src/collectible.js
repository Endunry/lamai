class Collectible extends Entity{
    constructor(x, y, width, height, color, calculated = false){
        super(x,y);
        if(!calculated){
            this.pos.mult(SIZE)
        }
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(){
        push();
        translate(this.pos.x, this.pos.y);
        fill(this.color);
        ellipse(SIZE/2, SIZE/2 , this.width, this.height);
        pop();
    }

    onCollision(other){
        map.splice(map.indexOf(this), 1);
    }
}

Collectible.prototype.toJSON = function(){
    return {
        x: this.pos.x,
        y: this.pos.y,
        width: this.width,
        height: this.height,
        color: this.color
    }
}

class Cookie extends Collectible{
    constructor(x, y, calculated = false){
        super(x, y,10, 10, "orange", calculated);
    }
}

class Power extends Collectible{
    constructor(x, y, calculated = false){
        super(x, y, 20,20 ,"purple", calculated);
    }
}