import { GameInterface } from "../Game";
import { Agent } from "./Agent";

export default class RandomAgent extends Agent {

    rand: number = 0;

    async sense(world: GameInterface) {
        console.log('sense');
        await sleep(1000);
        console.log('SLEEP OVER');
        
        this.rand = randomNumberBetween(0, 4);
    }

    act() {
        switch (this.rand) {
            case 0:
                return 'up';
            case 1:
                return 'down';
            case 2:
                return 'left';
            case 3:
                return 'right';
        }
    }
}

function randomNumberBetween(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function sleep(msec :number) {
    return new Promise(resolve => setTimeout(resolve, msec));
}