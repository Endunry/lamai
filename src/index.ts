import P5 from 'p5';

const sketch = (p5: P5) => {

    p5.setup = () => {
        const canvas = p5.createCanvas(200, 200);
        canvas.parent("app");
        p5.background("gray");

    };

    p5.draw = () => {
    };
};


new P5(sketch);