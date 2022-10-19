import * as P5 from "p5";

let p5SIngleton: P5 = null;

export function setP5(p5: P5) {
    p5SIngleton = p5;
}

export function getP5(): P5 {
    if(p5SIngleton == null) {
        throw new Error("p5 singleton not set");
    }
    return p5SIngleton;
}