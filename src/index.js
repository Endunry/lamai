const WIDTH = 1000;
const HEIGHT = 700;
const SIZE = 50;

const BACKGROUND = "black";
const TIMESECONDS = 0.35;

let textx = 0;
let texty = 0;

let lama; 
let map = [];

function keyPressed(){
    if(lama){
        lama.resetQueue();
    }
}


function setup(){    
    const canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent("app");

    textx = 0;
    texty = 0;
    textSize(20);
    textAlign(CENTER,CENTER);
    background(BACKGROUND);
    for(let y = 0; y <= HEIGHT; y+=SIZE){
        for(let x = 0; x <= WIDTH; x+=SIZE){      
            if(y === 0 || y === HEIGHT-SIZE || x === 0 || x === WIDTH-SIZE){
                map.push(new Border(createVector(x, y), SIZE, true));
            }
        }
    }
    map.push(new Border(createVector(2, 2), SIZE, false));
    map.push(new Power(6, 3));
    map.push(new Cookie(5, 3));
    map.push(new Cookie(4, 3));
    map.push(new Cookie(3, 3));
    map.push(new Cookie(2, 3));
    setInterval(timeLoop, 1000*TIMESECONDS);
    lama = new Lama(createVector(1, 1), SIZE);
};

function draw (){
    background(BACKGROUND);
    lama.draw();
    map.forEach(border => border.draw());
    lama.listenForKeys();
    text(`Punkte: ${lama.points}`, textx, texty, WIDTH, SIZE+5);
    fill("blue");
    // console.log(Date.now() - STARTTIME);
    
};

function timeLoop(){
    lama.update();
}