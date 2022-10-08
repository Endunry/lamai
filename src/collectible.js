class Collectible extends Entity{
    constructor(x, y, width, height, color){
        super(x,y);
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(){
        push();
        translate(this.pos.x * SIZE, this.pos.y * SIZE);
        fill(this.color);
        ellipse(SIZE/2, SIZE/2 , this.width, this.height);
        pop();
    }

    onCollision(other){
        if(other.constructor.name == "Lama"){
            other.points++;
            arrayMap[this.pos.x][this.pos.y] = null;
        }
    }

    isColliding(pos, size, dir) {
        const actualPosition = createVector(this.pos.x + SIZE/2, this.pos.y + SIZE/2);
        const actualOtherPosition = createVector(pos.x + SIZE/2, pos.y + SIZE/2);
        const radius = this.width/2;
        const distance = actualPosition.dist(actualOtherPosition);
        return distance < radius+SIZE/2+LAMA_SPEED;
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