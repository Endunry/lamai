import { Vector } from "p5";
import { initCanvas } from ".";
import Border from "./BuildBlocks/borders";
import Door from "./BuildBlocks/door";
import Void from "./BuildBlocks/void";
import { Cookie, Power } from "./Entities/collectible";
import Entity from "./Entities/entity";
import { Clyde, Pinky, Blinky, Inky } from "./Entities/gertruds";
import Lama from "./Entities/lama";
import { AgentType, mapData } from "./types/maps";
import { config, globals } from "./utils/singletons";
import { MoveableInterface } from './Entities/moveable';
import RandomAgent from "./agents/RandomAgent";
import ReflexAgent from "./agents/ReflexAgent";
import { AgentDecoder } from "./utils/AgentDecoder";

// REFACTOR: Refactor Editor into multiple classes pls :)

export type ClickEvent = MouseEvent & { target: HTMLCanvasElement | HTMLButtonElement };
type printType = { x: any, y: any }[];
const PORT = 1234;
interface MapEditorInterface {
    saveMap(_id?: string): void;
    selectTool(tool?: ClickEvent): void;
    edit(): void;
    mouseListener(event?: ClickEvent): void;
    currentSelection: string | null;
}
class MapEditor implements MapEditorInterface {

    constructor(editButtonId: string, saveButtonId: string, toolbarId: string, saveAsButtonId: string, selectId: string, brushRangeId: string, newMapButtonId: string, agentTypeSelectId: string) {
        this.editButton = document.getElementById(editButtonId) as HTMLButtonElement;
        this.saveButton = document.getElementById(saveButtonId) as HTMLButtonElement;
        this.saveAsButton = document.getElementById(saveAsButtonId) as HTMLButtonElement;
        this.mapSelect = document.getElementById(selectId) as HTMLSelectElement;
        this.toolbar = document.getElementById(toolbarId) as HTMLDivElement;
        this.brushRange = document.getElementById(brushRangeId) as HTMLInputElement;
        this.agentSelect = document.getElementById(agentTypeSelectId) as HTMLSelectElement;



        this.newMapButton = document.getElementById(newMapButtonId) as HTMLButtonElement;
        this.editButton.addEventListener('click', () => this.edit());
        this.saveButton.addEventListener('click', () =>

            this.saveMap()

        );
        this.newMapButton.addEventListener('click', () => this.newMap());
        this.toolbar.addEventListener('click', e => this.selectTool(e as ClickEvent));

        this.mapSelect.addEventListener('change', () => {

            globals.mapId = this.mapSelect.value;
            // Set a cookie to remember the last map
            document.cookie = `mapId=${globals.mapId}`;
            initCanvas();

        });

        this.agentSelect.addEventListener('change', () => {
            globals.agent = AgentDecoder.agentTypeToClass(this.agentSelect.value as AgentType);
            if (globals.game.getInstance().started) {
                globals.game.getInstance().readyForRestart = true;
            }
        });
        this.saveAsButton.addEventListener('click', () => this.saveMap(this.mapSelect.value));

        let req = new XMLHttpRequest();
        req.open('GET', `http://localhost:${PORT}/getSavedNames`, false);
        req.send(null);
        let savedNames: { name: string, _id: string }[] = JSON.parse(req.responseText);
        for (let name of savedNames) {
            let option = document.createElement('option');
            option.value = name._id;
            option.innerText = name.name;
            if (name._id == config.defaultMap) option.selected = true;
            this.mapSelect.appendChild(option);
        }
        this.currentSelection = null;
    }

    newMap() {

        let width = parseInt(prompt('Width: '));
        let height = parseInt(prompt('Height: '));
        let mapName = prompt('Name: ');
        let request = new XMLHttpRequest();
        request.open('GET', `http://localhost:${PORT}/getSavedNames`, false);
        request.send(null);
        let savedNames: { name: string }[] = JSON.parse(request.responseText);
        console.log(savedNames);
        // Check if the name is already taken
        if (savedNames.some((name) => name.name == mapName)) {
            alert('Map name already taken');
            return;
        }

        let mapData = {
            statics: new Array(width).fill(new Array(height).fill(null)),
            lama: { x: 0, y: 0 },
            pinky: {},
            inky: {},
            door: [],
            clyde: {},
            blinky: {},
            home: {},
            borderDrawing: "original",
            dimensions: {
                gridWidth: width,
                gridHeight: height
            }
        } as mapData

        let request2 = new XMLHttpRequest();
        request2.open('POST', `http://localhost:${PORT}/saveMap`, false);
        request2.setRequestHeader('Content-Type', 'application/json');
        request2.send(JSON.stringify({
            name: mapName,
            data: mapData
        }));
        let res = JSON.parse(request2.responseText);

        let option = document.createElement('option');
        option.value = res._id;
        option.innerText = res.name;
        option.selected = true;
        for (let opt in this.mapSelect.children) {
            if ((this.mapSelect.children[opt] as HTMLOptionElement).value == res._id) {
                (this.mapSelect.children[opt] as HTMLOptionElement).selected = false;
                return;
            }
        }

        this.mapSelect.children;
        this.mapSelect.appendChild(option);
        globals.mapId = res._id;
        globals.dimensions = mapData.dimensions;
        initCanvas();
    }



    saveMap(id?: string): void {

        // Open prompt to enter map name
        let mapName = id;
        if (!mapName) {
            mapName = prompt('Enter map name');
        }
        if (!mapName) return;
        // Get all the names with a http request
        let request = new XMLHttpRequest();
        request.open('GET', `http://localhost:${PORT}/getSavedNames`, false);
        request.send(null);
        let savedNames: { name: string }[] = JSON.parse(request.responseText);
        console.log(savedNames);
        // Check if the name is already taken
        if (!id && savedNames.some((name) => name.name == mapName)) {
            alert('Map name already taken');
            return;
        }


        this.saveButton.setAttribute('disabled', 'disabled');
        this.toolbar.classList.add("disabled");
        this.editButton.removeAttribute('disabled');
        this.currentSelection = null;
        let newCurrSelection = document.createElement('span');
        newCurrSelection.id = 'currentSelection';
        document.getElementById('currentSelection').replaceWith(newCurrSelection);
        let door: printType = [];
        let statics: number[][] = new Array(globals.dimensions.gridWidth).fill(0).map(() => new Array(globals.dimensions.gridHeight)); // Void = 0, Border = 1, Cookie = 2, Power = 3, Door = 4
        for (let i = 0; i < globals.dimensions.gridWidth; i++) {
            for (let j = 0; j < globals.dimensions.gridHeight; j++) {
                let entity = globals.game.getInstance().map[i][j];
                if (!entity) continue;
                switch (entity.constructor.name) {
                    case 'Void':
                        statics[i][j] = -1;
                        break;
                    case 'Border':
                        statics[i][j] = 1;
                        break;
                    case 'Cookie':
                        statics[i][j] = 2;
                        break;
                    case 'Power':
                        statics[i][j] = 3;
                        break;
                    case 'Door':
                        door.push({ x: (entity as Door).pos.x, y: (entity as Door).pos.y });
                        break;
                    default:
                        statics[i][j] = 0;
                }
            }
        }


        let agentData = AgentDecoder.agentClassToAgentType(globals.agent);


        const home = globals.game.getInstance().homeTarget && { x: globals.game.getInstance().homeTarget.x, y: globals.game.getInstance().homeTarget.y };
        let mapData = {
            statics,
            lama: globals.game.getInstance().lama?.deserializeCoords(),
            pinky: globals.game.getInstance().pinky?.deserializeCoords(),
            inky: globals.game.getInstance().inky?.deserializeCoords(),
            door: door,
            clyde: globals.game.getInstance().clyde?.deserializeCoords(),
            blinky: globals.game.getInstance().blinky?.deserializeCoords(),
            home,
            borderDrawing: globals.borderDrawing,
            dimensions: {
                gridWidth: globals.dimensions.gridWidth,
                gridHeight: globals.dimensions.gridHeight
            },
            agentType: agentData
        }
        let request2 = new XMLHttpRequest();
        if (id) {
            request2.open('PUT', `http://localhost:${PORT}/updateMap/${id}`, false);
            request2.setRequestHeader('Content-Type', 'application/json');
            request2.send(JSON.stringify({ data: mapData }));
        } else {

            request2.open('POST', `http://localhost:${PORT}/saveMap`, false);
            request2.setRequestHeader('Content-Type', 'application/json');
            request2.send(JSON.stringify({
                name: mapName,
                data: mapData
            }));
            let res = JSON.parse(request2.responseText);

            let option = document.createElement('option');
            console.log(res);
            option.value = res._id;
            option.innerText = res.name;
            option.selected = true;
            for (let opt in this.mapSelect.children) {
                if ((this.mapSelect.children[opt] as HTMLOptionElement).value == res._id) {
                    (this.mapSelect.children[opt] as HTMLOptionElement).selected = false;
                    return;
                }
            }



            this.mapSelect.children
            this.mapSelect.appendChild(option);
        }
        alert('Map saved');


    }


    selectTool(event?: ClickEvent): void {
        this.currentSelection = event.target.id;
        let eClone = event.target.cloneNode(true) as Element;
        eClone.id = 'currentSelection';
        document.getElementById('currentSelection').replaceWith(eClone);
    }

    edit(): void {
        this.editButton.setAttribute('disabled', 'disabled');
        this.toolbar.classList.remove("disabled");
        this.saveButton.removeAttribute('disabled');
    }

    insertEntity(x: number, y: number, halfX: number, halfY: number): void {
        let insertedItem: Entity;
        switch (this.currentSelection) {
            case 'void':
                insertedItem = new Void(new Vector(x, y));
                break;
            case 'border':
                insertedItem = new Border(new Vector(x, y));
                break;
            case 'lamai_cookie':
                insertedItem = new Cookie(x, y);
                break;
            case 'powerup':
                insertedItem = new Power(x, y);
                break;
            case 'gertrud1':
                globals.game.getInstance().clyde = new Clyde(halfX / 2, halfY / 2);
                break;
            case 'gertrud2':
                globals.game.getInstance().inky = new Pinky(halfX / 2, halfY / 2);
                break;
            case 'gertrud3':
                globals.game.getInstance().pinky = new Blinky(halfX / 2, halfY / 2);
                break;
            case 'gertrud4':
                globals.game.getInstance().blinky = new Inky(halfX / 2, halfY / 2);
                break;
            case 'lama':
                globals.game.getInstance().lama = new Lama(new Vector(halfX / 2, halfY / 2), config.gridSize);
                return;
            case 'homeTarget':
                globals.game.getInstance().homeTarget = new Vector(x, halfY / 2);
                return;
            case 'homeWall':
                insertedItem = new Door(x, halfY / 2);
            case 'delete':
                if (globals.game.getInstance().map[x][y] instanceof Cookie) {
                    globals.game.getInstance().cookies--;
                }
                globals.game.getInstance().map[x][y] = null;
                console.log(globals.game.getInstance().getAllMoveables());
                globals.game.getInstance().getAllMoveables().forEach((moveable: MoveableInterface) => {
                    if (moveable) {
                        if (Math.floor(moveable.pos.x) == x && Math.floor(moveable.pos.y) == y) {
                            globals.game.getInstance().removeMoveable(moveable);
                        }
                    }
                });
                break;
            default:
                return;
        }
        if (insertedItem) {
            if (insertedItem instanceof Cookie && !(globals.game.getInstance().map[x][y] instanceof Cookie)) {
                globals.game.getInstance().cookies++;
            }
            globals.game.getInstance().map[x][y] = insertedItem;
        }
    }

    mouseListener(event?: ClickEvent): void {
        if (!event) return;
        const isBrushable = ['void', 'border', 'cookie', 'powerup', 'delete'].indexOf(this.currentSelection) > -1;
        // Determine the x and y coords
        let rect = document.querySelector('#app canvas').getBoundingClientRect();
        let x = Math.floor((event.clientX - rect.left) / config.gridSize);
        let y = Math.floor((event.clientY - rect.top) / config.gridSize);

        if (x < 0 || x >= globals.dimensions.gridWidth || y < 0 || y >= globals.dimensions.gridHeight) return;
        let halfX = Math.floor((event.clientX - rect.left) / (config.gridSize / 2));
        let halfY = Math.floor((event.clientY - rect.top) / (config.gridSize / 2));
        // Check if the coords are in the map
        if (x < 0 || x > globals.dimensions.gridWidth || y < 0 || y > globals.dimensions.gridHeight) return;
        const isOverlapping = (globals.game.getInstance().map[x] && globals.game.getInstance().map[x][y] != null);


        // }
        console.log(isBrushable)
        if (isBrushable) {
            let brushPoints = this.getBrushPoints(x, y, +this.brushRange.value);
            for (let point of brushPoints) {
                if (point.x < 0 || point.x >= globals.dimensions.gridWidth || point.y < 0 || point.y >= globals.dimensions.gridHeight) continue;
                if (this.currentSelection !== 'delete' && globals.game.getInstance().map[Math.floor(point.x)][Math.floor(point.y)]) continue;
                this.insertEntity(Math.floor(point.x), Math.floor(point.y), halfX, halfY);
            }
        } else {
            if (!isOverlapping) {
                this.insertEntity(x, y, halfX, halfY);
            }
        }
        switch (this.currentSelection) {
            case 'void':
            case 'border':
            case 'delete':
            case 'homeWall':
                globals.game.getInstance().determineBorderTypes();
                break;
            default:
        }

    }
    getBrushPoints(x: number, y: number, radius: number) {
        if (radius == 0) return [{ x, y }];
        let brushPoints = [];
        for (let i = x - radius; i <= x + radius; i++) {
            for (let j = y - radius; j <= y + radius; j++) {
                if (i < 0 || i >= globals.dimensions.gridWidth || j < 0 || j >= globals.dimensions.gridHeight) continue;
                if (Math.sqrt(Math.pow(i - x, 2) + Math.pow(j - y, 2)) <= radius) {
                    brushPoints.push({ x: i, y: j });
                }
            }
        }
        return brushPoints;
    }

    currentSelection: string | null;
    editButton: HTMLButtonElement;
    saveButton: HTMLButtonElement;
    saveAsButton: HTMLButtonElement;
    toolbar: HTMLDivElement;
    newMapButton: HTMLButtonElement;
    mapSelect: HTMLSelectElement;
    agentSelect: HTMLSelectElement;
    brushRange: HTMLInputElement;

}

const mapEditor: MapEditorInterface = new MapEditor('editButton', 'saveButton', 'toolbar', "loadButton", "mapSelect", "brushRadius", "newMap", "agentSelect");

export default mapEditor;