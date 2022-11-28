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


interface GameInterface {
    map: (Entity | undefined)[][];
    blinky: Blinky;
    pinky: Blinky;
    inky: Blinky;
    clyde: Blinky;
    lama: LamaInterface;
    homeTarget: Vector;
    startTime: Date;
    started: boolean;
    init(): void;
    loadMap(id: string): void;
    determineBorderTypes(): void;
    start(): void;
    restart(): void;
    update(): void;
    draw(p5: P5): void;
    drawDebug(p5: P5): void;
}

class Game implements GameInterface {
    constructor() {
        this.map = new Array(config.dimensions.gridWidth).fill(0).map(() => new Array(config.dimensions.gridHeight));
        this.started = false;
    }

    update(): void {
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
        for (let i = 0; i < config.dimensions.gridWidth; i++) {
            p5.line(i * config.dimensions.gridSize, 0, i * config.dimensions.gridSize, p5.height);
        }
        for (let i = 0; i < config.dimensions.gridHeight; i++) {
            p5.line(0, i * config.dimensions.gridSize, p5.width, i * config.dimensions.gridSize);
        }
        // Draw fps
        p5.fill(255);
        p5.text(`FPS: ${p5.frameRate().toFixed(0)}`, 100, 10);
        this.homeTarget && p5.ellipse(this.homeTarget.x * config.dimensions.gridSize, this.homeTarget.y * config.dimensions.gridSize, 10, 10);
        this.blinky && this.blinky.drawDebug(p5);
        this.pinky && this.pinky.drawDebug(p5);
        this.inky && this.inky.drawDebug(p5);
        this.clyde && this.clyde.drawDebug(p5);
        this.lama && this.lama.drawDebug(p5);
    }

    loadMap(id: string = "635143ded482a24c597f959d"): void {
        this.map = new Array(config.dimensions.gridWidth).fill(0).map(() => new Array(config.dimensions.gridHeight));
        this.started = false;
        // let mapData = mapdatainit;   
        let request = new XMLHttpRequest();
        request.open('GET', `http://localhost:8080/getMap/${id}`, false);
        request.send(null);
        let mapData = JSON.parse(request.responseText).data;
        console.log(mapData)
        if (mapData.statics) {

            for (let x = 0; x < config.dimensions.gridWidth; x++) {
                for (let y = 0; y < config.dimensions.gridHeight; y++) {
                    switch (mapData.statics[x][y]) {
                        case -1:
                            this.map[x][y] = new Void(new Vector(x, y));
                            break;
                        case 1:
                            this.map[x][y] = new Border(new Vector(x, y));
                            break;
                        case 2:
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

        this.lama = new Lama(new Vector(mapData.lama.x, mapData.lama.y), config.dimensions.gridSize);
        this.pinky = new Pinky(mapData.pinky.x, mapData.pinky.y,);
        this.inky = new Inky(mapData.inky.x, mapData.inky.y,);
        this.clyde = new Clyde(mapData.clyde.x, mapData.clyde.y,);
        this.blinky = new Blinky(mapData.blinky.x, mapData.blinky.y,);
        this.homeTarget = new Vector(mapData.home.x, mapData.home.y);
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
        this.map && this.map.forEach(col => col && col.forEach(item => item && item.draw(p5)));
        this.lama && this.lama.draw(p5);
        this.lama && this.lama.listenForKeys(p5);
        this.lama && p5.text(`Punkte: ${this.lama.points}`, 0, 0, p5.width, config.dimensions.gridSize + 5);
        this.inky && this.inky.draw(p5);
        this.pinky && this.pinky.draw(p5);
        this.clyde && this.clyde.draw(p5);
        this.blinky && this.blinky.draw(p5);
        if (globals.debug) this.drawDebug(p5);
    }

    determineBorderTypes() {
        for (let x = 0; x < config.dimensions.gridWidth; x++) {
            for (let y = 0; y < config.dimensions.gridHeight; y++) {
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
            ghosts.forEach(ghost => ghost.chase());
            return;
        }
        if (seconds >= 7 && seconds < 27) {
            ghosts.forEach(ghost => ghost.chase());
        } else if (seconds >= 27 && seconds < 54) {
            ghosts.forEach(ghost => ghost.scatter());
        } else if (seconds >= 54 && seconds < 59) {
            ghosts.forEach(ghost => ghost.chase());
        } else if (seconds >= 59 && seconds < 84) {
            ghosts.forEach(ghost => ghost.scatter());
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
        if (x >= 0 && x < config.dimensions.gridWidth && y >= 0 && y < config.dimensions.gridHeight) {
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




const game: GameInterface = new Game();

export default game;