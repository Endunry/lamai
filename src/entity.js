class Entity{
    constructor(x,y){
        this.pos = createVector(x,y);
    }

    onCollision(other){
        console.log("Collision", other)
    }
}