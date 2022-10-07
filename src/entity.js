class Entity{
    constructor(x,y){
        this.pos = createVector(x,y);
    }

    onCollision(other){
        // console.log("Collision", other)
    }

    isColliding(pos, size, dir){
        return pos.x + dir.x < this.pos.x + size && pos.x + dir.x + size > this.pos.x && pos.y + dir.y < this.pos.y + size && pos.y + dir.y + size > this.pos.y;
    }

}

Entity.prototype.toJSON = function() {
    return {
        x: this.pos.x,
        y: this.pos.y
    }
}