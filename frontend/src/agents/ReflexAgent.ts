import { GameInterface } from "../Game";
import { GameMove } from "../types/game";
import { Agent } from "./Agent";
import { Vector } from 'p5';
import { sleep } from "../utils/utils";

export default class ReflexAgent extends Agent {

    dir: Vector;

    async sense(world: GameInterface) {
        await sleep(100);
        let dirs = world.lama.getPossibleDirections();
        for(let dir of dirs){
            const pos = world.lama.pos.copy().add(dir);
            const col = world.map[pos.x];
            if(!col) continue;
            const cell = col[pos.y];
            if(!cell) continue;
            if(cell.constructor.name == 'Cookie'){
                this.dir = dir;
                return;
            }
        }
        this.dir = dirs[Math.floor(Math.random() * dirs.length)];
        
    }

    act() {
        // translate the dir vector to a move string
        // return the move string
        if(this.dir.x == 1){
            return 'right' as GameMove;
        }
        if(this.dir.x == -1){
            return 'left' as GameMove;
        }
        if(this.dir.y == 1){
            return 'down' as GameMove;
        }
        if(this.dir.y == -1){
            return 'up' as GameMove;
        }

        return 'stay' as GameMove;
        
    }
}

function randomNumberBetween(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

