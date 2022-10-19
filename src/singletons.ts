import * as P5 from "p5";

export type imagesType = {
    pinky: null | P5.Image,
    inky: null | P5.Image,
    clyde: null | P5.Image,
    blinky: null | P5.Image,
    frightened: null | P5.Image,
    eaten: null | P5.Image,
    pacman: null | P5.Image
}

let p5SIngleton: P5 = null;
let images: imagesType = {
    pinky: null,
    inky: null,
    clyde: null,
    blinky: null,
    frightened: null,
    eaten: null,
    pacman: null
};

export function setImages(imgs: imagesType) {
    images = imgs;
}

export function getImages(): imagesType {
    return images;
}