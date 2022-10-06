const WIDTH = 1000;
const HEIGHT = 700;
const SIZE = 50;

const BACKGROUND = "black";
const TIMESECONDS = 0.35;

let lama; 
let map = [];
let borders = [];

function keyPressed(){
    if(lama){
        lama.resetQueue();
    }
}


function setup(){    
    const canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent("app");
    background(BACKGROUND);
    for(let y = 0; y <= HEIGHT; y+=SIZE){
        for(let x = 0; x <= WIDTH; x+=SIZE){      
            if(y === 0 || y === HEIGHT-SIZE || x === 0 || x === WIDTH-SIZE){
                borders.push(new Border(createVector(x, y), SIZE, true));
            }
        }
    }
    borders.push(new Border(createVector(2, 2), SIZE, false));
    setInterval(timeLoop, 1000*TIMESECONDS);
    lama = new Lama(createVector(1, 1), SIZE);
};

function draw (){
    background(BACKGROUND);
    lama.draw();
    borders.forEach(border => border.draw());
    lama.listenForKeys();
    // console.log(Date.now() - STARTTIME);
    
};

function timeLoop(){
    lama.update();
}