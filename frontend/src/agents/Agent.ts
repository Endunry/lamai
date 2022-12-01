import { GameInterface } from "../Game";
import { GameMove } from "../types/game";
import { sleep } from "../utils/utils";

export interface AgentInterface {
    sense: (world: GameInterface) => Promise<void>; // will be called every frame
    act: () => GameMove; // act will always be called when pacman can make its next move
}

export class Agent implements AgentInterface {
    async sense(world: GameInterface): Promise<void> {
        await sleep(10);
    }

    act(): GameMove {
        return 'stay';
    }
}
