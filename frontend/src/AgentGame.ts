import Entity from "./Entities/entity";
import { globals } from "./utils/singletons";
import P5, { Vector } from 'p5';
import Gertrud, { Blinky } from './Entities/gertruds';
import  { LamaInterface } from './Entities/lama';
import { MoveableInterface } from "./Entities/moveable";
import { initCanvas, p5Sketch } from ".";
import { Game, GameInterface } from "./Game";
import { AgentInterface } from './agents/Agent';
import LamaAgent from './agents/LamaAgent';


const PORT = 1234;

export class AgentGame extends Game {
    constructor(agent: AgentInterface) {
        super();
        this.agent = agent;
    }

    win(): void {
        alert(`Du hast gewonnen! Punktzahl; ${this.lama.points}`);
        initCanvas();
    }
    removeMoveable(moveable: MoveableInterface): void {
        switch (moveable.constructor.name) {
            case 'Blinky':
                this.blinky = undefined;
                break;
            case 'Pinky':
                this.pinky = undefined;
                break;
            case 'Inky':
                this.inky = undefined;
                break;
            case 'Clyde':
                this.clyde = undefined;
                break;
            case 'Lama':
                this.lama = undefined;
                break;
        }
    }

    async update(): Promise<void> {
        await super.update();

        if(this.lama.isInGrid()){
            p5Sketch.noLoop();
            await this.agent.sense(this);
            let move = this.agent.act();
            this.lama.listenForKeys(move);
            p5Sketch.loop();
        }
    }

    drawDebug(p5: P5): void {
        super.drawDebug(p5);
    }

    init(): void {
        super.init();
    }

    start(): void {
        super.start();
    }

    draw(p5: P5): void {
        super.draw(p5);
    }

    loadMap(): void {
        super.loadMap();
        if(this.lama){
            this.lama = LamaAgent.createLamaAgent(this.lama);
        }
    }




    map: (Entity | undefined)[][];
    blinky: Blinky;
    pinky: Blinky;
    inky: Blinky;
    clyde: Blinky;
    lama: LamaInterface;
    homeTarget: Vector;
    startTime: Date;
    started: boolean;
    cookies: number = 0;
    scoreElement: HTMLElement;
    agent: AgentInterface;

    // "Non Interface Functions+members"

    checkTimeTable(ghosts: Array<Gertrud>) {
        return; // Dont use the TimeTable for now;
        /* Timetable to switch between Scatter and Chase in lvl 1 of original Pacman:
        SCATTER/CHASE: 7" 20" 7" 20" 5" 20" 5" -
        */
        // let time = new Date();
        // let timeDiff = time.getTime() - this.startTime.getTime();
        // let seconds = Math.floor(timeDiff / 1000);
        // (seconds);
        // if (seconds >= 84) {
        //     ghosts.forEach(ghost => ghost?.chase());
        //     return;
        // }
        // if (seconds >= 7 && seconds < 27) {
        //     ghosts.forEach(ghost => ghost?.chase());
        // } else if (seconds >= 27 && seconds < 54) {
        //     ghosts.forEach(ghost => ghost?.scatter());
        // } else if (seconds >= 54 && seconds < 59) {
        //     ghosts.forEach(ghost => ghost?.chase());
        // } else if (seconds >= 59 && seconds < 84) {
        //     ghosts.forEach(ghost => ghost?.scatter());
        // }


    }

}





