import { GameInterface } from "../Game";
import { GameMove } from "../types/game";
import { sleep } from "../utils/utils";
import { Agent } from "./Agent";

export default class ReplanningAgent extends Agent {


    async sense(world: GameInterface) {
        await sleep(100); 
    }

    act() : GameMove {
        return 'stay';
    }
}

