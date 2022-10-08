class Door extends Entity{
    constructor(x,y){
        super(x,y);
        this._size = SIZE;
        (x,y)
    }

    getLegalDirection(){
        // At the moment only y directions
        if(this.pos.y % 1 === 0){
            return createVector(0,1);
        }else{
            return createVector(0,-1);
        }
    }

    draw(){
        push();
        translate(this.pos.x*SIZE, this.pos.y*SIZE);
        noStroke();
        fill("yellow");
        rect(0, 0, this._size, this._size/2);
        pop();
    }
}