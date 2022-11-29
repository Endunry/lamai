import { GameInterface } from "../Game";
import { GameMove } from "../types/game";

export interface AgentInterface {
    sense: (world: GameInterface) => Promise<void>; // will be called every frame
    act: () => GameMove; // act will always be called when pacman can make its next move
}

export class Agent implements AgentInterface {
    sense(world: GameInterface): Promise<void> {
        // do nothing
        return Promise.resolve();
    }

    act(): GameMove {
        return 'stay';
    }
}
