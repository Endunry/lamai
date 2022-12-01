import Entity from "./Entities/entity";
import { config, globals } from "./utils/singletons";
import P5, { Vector } from 'p5';
import Gertrud, { Blinky, Inky, Pinky, Clyde } from './Entities/gertruds';
import Lama, { LamaInterface } from './Entities/lama';
import mapdatainit from "./utils/savestate";
import Void from './BuildBlocks/void';
import Door from "./BuildBlocks/door";
import { Cookie, Power } from "./Entities/collectible";
import Border from "./BuildBlocks/borders";
import { AgentType, mapData } from './types/maps';
import Moveable, { MoveableInterface } from "./Entities/moveable";
import { initCanvas } from ".";
import RandomAgent from "./agents/RandomAgent";
import ReflexAgent from "./agents/ReflexAgent";
import { AgentDecoder } from './utils/AgentDecoder';


export interface GameInterface {
    win(): void;
    lose(): void;
    removeMoveable(moveable: MoveableInterface): unknown;
    map: (Entity | undefined)[][];
    blinky: Blinky;
    pinky: Blinky;
    inky: Blinky;
    clyde: Blinky;
    lama: LamaInterface;
    homeTarget: Vector;
    startTime: Date;
    started: boolean;
    cookies: number;
    readyForRestart: boolean;
    init(): void;
    loadMap(id: string): void;
    determineBorderTypes(): void;
    getAllMoveables(): MoveableInterface[];
    start(): void;
    restart(): void;
    update(): void;
    draw(p5: P5): void;
    drawDebug(p5: P5): void;
}
const PORT = 1234;

export class Game implements GameInterface {
    constructor() {
        this.map = new Array(globals.dimensions.gridWidth).fill(0).map(() => new Array(globals.dimensions.gridHeight));
        this.started = false;
        this.scoreElement = document.querySelector('#points span');
    }
    win(): void {
        alert(`Du hast gewonnen! Punktzahl; ${this.lama.points}`);
        this.readyForRestart = true;
        this.started = false;
        initCanvas();
    }

    lose(): void{
        alert(`Du bist gestorben! Punktzahl; ${this.lama.points}`);
        this.readyForRestart = true;
        this.started = false;
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

    getAllMoveables(): Array<MoveableInterface> {
        let moveables: Array<MoveableInterface> = [this.lama, this.blinky, this.inky, this.pinky, this.clyde]
        return moveables;
    }   

    async update(): Promise<void> {
        this.lama && this.lama.update();
        this.inky && this.inky.update();
        this.pinky && this.pinky.update();
        this.clyde && this.clyde.update();
        this.blinky && this.blinky.update();
        this.startTime && this.checkTimeTable([this.inky, this.pinky, this.clyde, this.blinky]);
    }

    drawDebug(p5: P5): void {
        p5.stroke(255);
        p5.strokeWeight(1);
        for (let i = 0; i < globals.dimensions.gridWidth; i++) {
            p5.line(i * config.gridSize, 0, i * config.gridSize, p5.height);
        }
        for (let i = 0; i < globals.dimensions.gridHeight; i++) {
            p5.line(0, i * config.gridSize, p5.width, i * config.gridSize);
        }
        // Draw fps
        p5.fill(255);
        p5.text(`FPS: ${p5.frameRate().toFixed(0)}`, 100, 10);
        this.homeTarget && p5.ellipse(this.homeTarget.x * config.gridSize, this.homeTarget.y * config.gridSize, 10, 10);
        this.blinky && this.blinky.drawDebug(p5);
        this.pinky && this.pinky.drawDebug(p5);
        this.inky && this.inky.drawDebug(p5);
        this.clyde && this.clyde.drawDebug(p5);
        this.lama && this.lama.drawDebug(p5);
    }

    loadMap(): void {

        // Reset some variables
        this.cookies = 0;
        this.map = new Array(globals.dimensions.gridWidth).fill(0).map(() => new Array(globals.dimensions.gridHeight));
        this.started = false;


        
        let request = new XMLHttpRequest();
        request.open('GET', `http://localhost:${PORT}/getMap/${globals.mapId}`, false);
        request.send(null);
        let mapData = JSON.parse(request.responseText).data as mapData;


        if (mapData.statics) {
            for (let x = 0; x < globals.dimensions.gridWidth; x++) {
                for (let y = 0; y < globals.dimensions.gridHeight; y++) {
                    switch (mapData.statics[x][y]) {
                        case -1:
                            this.map[x][y] = new Void(new Vector(x, y));
                            break;
                        case 1:
                            this.map[x][y] = new Border(new Vector(x, y));
                            break;
                        case 2:
                            this.cookies++;
                            this.map[x][y] = new Cookie(x, y);
                            break;
                        case 3:
                            this.map[x][y] = new Power(x, y);
                            break;
                        default:
                    }
                }
            }
        }

        mapData.door?.forEach((door: { x: number; y: number; }) => {
            this.map[Math.floor(door.x)][Math.floor(door.y)] = new Door(door.x, door.y);
        });

        this.lama = new Lama(new Vector(mapData.lama.x, mapData.lama.y), config.gridSize);

        if(mapData.pinky){
            this.pinky = new Pinky(mapData.pinky.x, mapData.pinky.y);
        }

        if(mapData.inky){
        this.inky = new Inky(mapData.inky.x, mapData.inky.y,);
        }  

        if(mapData.clyde){
        this.clyde = new Clyde(mapData.clyde.x, mapData.clyde.y);
        }

        if(mapData.blinky){
        this.blinky = new Blinky(mapData.blinky.x, mapData.blinky.y);
        }

        if(mapData.home){
        this.homeTarget = new Vector(mapData.home.x, mapData.home.y);
        }
        
        globals.agent = AgentDecoder.agentTypeToClass(mapData.agentType)
        console.log(globals.agent);
        let agentSelect = document.querySelector('#agentSelect') as HTMLSelectElement;
        for (let opt in agentSelect.children) {
            const optVal = (agentSelect.children[opt] as HTMLOptionElement).value + "";
            console.log(optVal);
            if (optVal == mapData.agentType+"") {
                (agentSelect.children[opt] as HTMLOptionElement).selected = true;
                break;
            }
        }
        this.determineBorderTypes()
    }

    init(): void {
        this.loadMap();
        this.determineBorderTypes()
    }

    start(): void {
        this.startTime = new Date();
        this.started = true;

        this.inky && this.inky.start();
        this.pinky && this.pinky.start();
        this.clyde && this.clyde.start();
        this.blinky && this.blinky.start();
    }

    restart(): void {
        throw new Error("Method not implemented.");
    }

    draw(p5: P5): void {
        if(!this.started || this.cookies !== 0){
            this.map && this.map.forEach(col => col && col.forEach(item => item && item.draw(p5)));
            this.lama && this.lama.listenForKeys(p5);
            if(this.lama){
                this.scoreElement.innerHTML = this.lama.points.toString();
            }
        }
        this.lama && this.lama.draw(p5);
        this.pinky && this.pinky.draw(p5);
        this.clyde && this.clyde.draw(p5);
        this.inky && this.inky.draw(p5);
        this.blinky && this.blinky.draw(p5);
        if (globals.debug) this.drawDebug(p5);
        if (this.cookies === 0 && this.started) { // Win the game after drawing everything
            this.win();
        }
    }

    determineBorderTypes() {
        for (let x = 0; x < globals.dimensions.gridWidth; x++) {
            for (let y = 0; y < globals.dimensions.gridHeight; y++) {
                if (this.map[x][y] instanceof Border) {
                    let neighbors = this.getBorderNeighbors(this.map, x, y);
                    (this.map[x][y] as Border).setNeighbors(neighbors);
                }
            }
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
    readyForRestart: boolean = false;
    // "Non Interface Functions+members"

    checkTimeTable(ghosts: Array<Gertrud>) {
        /* Timetable to switch between Scatter and Chase in lvl 1 of original Pacman:
        SCATTER/CHASE: 7" 20" 7" 20" 5" 20" 5" -
        */
        let time = new Date();
        let timeDiff = time.getTime() - this.startTime.getTime();
        let seconds = Math.floor(timeDiff / 1000);
        (seconds);
        if (seconds >= 84) {
            ghosts.forEach(ghost => ghost?.chase());
            return;
        }
        if (seconds >= 7 && seconds < 27) {
            ghosts.forEach(ghost => ghost?.chase());
        } else if (seconds >= 27 && seconds < 54) {
            ghosts.forEach(ghost => ghost?.scatter());
        } else if (seconds >= 54 && seconds < 59) {
            ghosts.forEach(ghost => ghost?.chase());
        } else if (seconds >= 59 && seconds < 84) {
            ghosts.forEach(ghost => ghost?.scatter());
        }


    }


    getBorderNeighbors(borders: Array<Array<Entity>>, x: number, y: number) {
        let top = this.getBorder(borders, x, y - 1);
        let right = this.getBorder(borders, x + 1, y);
        let bottom = this.getBorder(borders, x, y + 1);
        let left = this.getBorder(borders, x - 1, y);
        let top_right = this.getBorder(borders, x + 1, y - 1);
        let bottom_right = this.getBorder(borders, x + 1, y + 1);
        let bottom_left = this.getBorder(borders, x - 1, y + 1);
        let top_left = this.getBorder(borders, x - 1, y - 1);
        return [top, right, bottom, left, top_right, bottom_right, bottom_left, top_left];
    }



    getBorder(borders: Array<Array<Entity>>, x: number, y: number): number {
        if (x >= 0 && x < globals.dimensions.gridWidth && y >= 0 && y < globals.dimensions.gridHeight) {
            if (borders[x][y] instanceof Border) {
                return 1;
            } else if (borders[x][y] instanceof Void || borders[x][y] instanceof Door) {
                return -1;
            }
            return 0;
        }
        return -1;
    }




}




