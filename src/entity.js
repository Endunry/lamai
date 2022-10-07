class Entity{
    constructor(x,y){
        this.pos = createVector(x,y);
    }

    onCollision(other){
        // console.log("Collision", other)
    }


}

Entity.prototype.toJSON = function() {
    return {
        x: this.pos.x,
        y: this.pos.y
    }
}