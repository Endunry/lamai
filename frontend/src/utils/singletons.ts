import P5 from "p5";
import { AgentGame } from "../AgentGame";
import { Agent } from "../agents/Agent";
import { Game } from "../Game";
import RandomAgent from '../agents/RandomAgent';
import ReflexAgent from './../agents/ReflexAgent';
import ReplanningAgent from './../agents/ReplanningAgent';

export type imagesType = {
    pinky: null | P5.Image,
    inky: null | P5.Image,
    clyde: null | P5.Image,
    blinky: null | P5.Image,
    frightened: null | P5.Image,
    eaten: null | P5.Image,
    pacman: null | P5.Image
}

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



export const config = {
    init: {
        debug: false,
    },
    defaultMap: "6387e3e8182ee41b6b8bada2",
    gridSize: 20,
    speed:{
        val: 1, // speed.val is a arbitrary parameter
        pacman: {
            normal: 0.8,
             frightened: 0.9
        },
        ghosts: {
            normal: 0.75,
            frightened: 0.75
        }
    },
    smoothness: 0.5, // arbitrary parameter
    player:{
        lives: 3
    }
}

export let globals = {
    debug: config.init.debug,
    startTime: undefined as Date | undefined,
    score: 0,
    dimensions: {
        gridWidth: 28,
        gridHeight: 36
    },
    game: {
        instance: null as null | Game | AgentGame,
        getInstance: () => {
            if(!globals.game.instance) {
                globals.game.createInstance();
            }
            return globals.game.instance;
        },
        createInstance: () => {
            if(globals.agent){
                globals.game.instance = new AgentGame(new globals.agent());
            }else{
                globals.game.instance = new Game();
            }
        }
    },
    lives: config.player.lives,
    borderDrawing: 'original' as 'original' | 'simple',
    mapId: config.defaultMap,
    agent: ReplanningAgent as null | typeof Agent
}

console.log(globals.agent);