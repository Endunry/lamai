import { Vector } from "p5";
import Border from "./BuildBlocks/borders";
import Door from "./BuildBlocks/door";
import Void from "./BuildBlocks/void";
import { Cookie, Power } from "./Entities/collectible";
import Entity from "./Entities/entity";
import { Clyde, Pinky, Blinky, Inky } from "./Entities/gertruds";
import Lama from "./Entities/lama";
import game from "./Game";
import { config } from "./utils/singletons";

export type ClickEvent = MouseEvent & { target: HTMLCanvasElement | HTMLButtonElement };
type printType = { x: any, y: any }[];

interface MapEditorInterface {
    saveMap(_id?: string): void;
    selectTool(tool?: ClickEvent): void;
    edit(): void;
    mouseListener(event?: ClickEvent): void;
    currentSelection: string | null;
}
// TODO: Map Editor zum laufen bringen
class MapEditor implements MapEditorInterface {

    constructor(editButtonId: string, saveButtonId: string, toolbarId: string, saveAsButtonId: string, selectId: string, brushRangeId: string) {
        this.editButton = document.getElementById(editButtonId) as HTMLButtonElement;
        this.saveButton = document.getElementById(saveButtonId) as HTMLButtonElement;
        this.saveAsButton = document.getElementById(saveAsButtonId) as HTMLButtonElement;
        this.mapSelect = document.getElementById(selectId) as HTMLSelectElement;
        this.toolbar = document.getElementById(toolbarId) as HTMLDivElement;
        this.brushRange = document.getElementById(brushRangeId) as HTMLInputElement;

        this.editButton.addEventListener('click', () => this.edit());
        this.saveButton.addEventListener('click', () => this.saveMap());
        this.toolbar.addEventListener('click', e => this.selectTool(e as ClickEvent));
        this.mapSelect.addEventListener('change', () => game.loadMap(this.mapSelect.value));
        this.saveAsButton.addEventListener('click', () => this.saveMap(this.mapSelect.value));

        let req = new XMLHttpRequest();
        req.open('GET', 'http://localhost:8080/getSavedNames', false);
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



    saveMap(id?: string): void {

        // Open prompt to enter map name
        let mapName = id;
        if (!mapName) {
            mapName = prompt('Enter map name');
        }
        if (!mapName) return;
        // Get all the names with a http request
        let request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:8080/getSavedNames', false);
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
        let statics: number[][] = new Array(config.dimensions.gridWidth).fill(0).map(() => new Array(config.dimensions.gridHeight)); // Void = 0, Border = 1, Cookie = 2, Power = 3, Door = 4
        for (let i = 0; i < config.dimensions.gridWidth; i++) {
            for (let j = 0; j < config.dimensions.gridHeight; j++) {
                let entity = game.map[i][j];
                if (!entity) continue;
                switch (entity.constructor.name) {
                    case 'Void':
                        statics[i][j] = -1;
                        break;
                    case 'Border':
                        statics[i][j] = 1; 1
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


        let mapData = {
            statics,
            lama: game.lama,
            pinky: game.pinky,
            inky: game.inky,
            door,
            clyde: game.clyde,
            blinky: game.blinky,
            home: {
                x: game.homeTarget.x,
                y: game.homeTarget.y
            }
        }
        let request2 = new XMLHttpRequest();
        if (id) {
            request2.open('PUT', `http://localhost:8080/updateMap/${id}`, false);
            request2.setRequestHeader('Content-Type', 'application/json');
            request2.send(JSON.stringify({ data: mapData }));
        } else {

            request2.open('POST', 'http://localhost:8080/saveMap', false);
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
            case 'cookie':
                insertedItem = new Cookie(x, y);
                break;
            case 'powerup':
                insertedItem = new Power(x, y);
                break;
            case 'gertrud1':
                game.clyde = new Clyde(halfX / 2, halfY / 2);
                break;
            case 'gertrud2':
                game.inky = new Pinky(halfX / 2, halfY / 2);
                break;
            case 'gertrud3':
                game.pinky = new Blinky(halfX / 2, halfY / 2);
                break;
            case 'gertrud4':
                game.blinky = new Inky(halfX / 2, halfY / 2);
                break;
            case 'lama':
                game.lama = new Lama(new Vector(halfX / 2, halfY / 2), config.dimensions.gridSize);
                return;
            case 'homeTarget':
                game.homeTarget = new Vector(x, halfY / 2);
                return;
            case 'homeWall':
                insertedItem = new Door(x, halfY / 2);
            case 'delete':
                game.map[x][y] = null;
                break;
            default:
                return;
        }
        if (insertedItem) {
            game.map[x][y] = insertedItem;
        }
    }

    mouseListener(event?: ClickEvent): void {
        if (!event) return;
        const isBrushable = ['void', 'border', 'cookie', 'powerup', 'delete'].indexOf(this.currentSelection) > -1;
        // Determine the x and y coords
        let rect = document.querySelector('#app canvas').getBoundingClientRect();
        let x = Math.floor((event.clientX - rect.left) / config.dimensions.gridSize);
        let y = Math.floor((event.clientY - rect.top) / config.dimensions.gridSize);

        if (x < 0 || x >= config.dimensions.gridWidth || y < 0 || y >= config.dimensions.gridHeight) return;
        let halfX = Math.floor((event.clientX - rect.left) / (config.dimensions.gridSize / 2));
        let halfY = Math.floor((event.clientY - rect.top) / (config.dimensions.gridSize / 2));
        // Check if the coords are in the map
        if (x < 0 || x > config.dimensions.gridWidth || y < 0 || y > config.dimensions.gridHeight) return;
        const isOverlapping = (game.map[x] && game.map[x][y] != null);


        // }
        console.log(isBrushable)
            if (isBrushable) {
                let brushPoints = this.getBrushPoints(x, y, +this.brushRange.value);
                for (let point of brushPoints) {
                    if(point.x < 0 || point.x >= config.dimensions.gridWidth || point.y < 0 || point.y >= config.dimensions.gridHeight) continue;
                    if (this.currentSelection !== 'delete' && game.map[Math.floor(point.x)][Math.floor(point.y)]) continue;
                    this.insertEntity(Math.floor(point.x), Math.floor(point.y), halfX, halfY);
                }
            } else {
                if (!isOverlapping){
                    this.insertEntity(x, y, halfX, halfY);
                }
            }
            switch (this.currentSelection) {
                case 'void':
                case 'border':
                case 'delete':
                case 'homeWall':
                    game.determineBorderTypes();
                    break;
                default:
            }
        
    }
    getBrushPoints(x: number, y: number, radius: number) {
        let brushPoints = [];
        for (let i = x - radius; i <= x + radius; i++) {
            for (let j = y - radius; j <= y + radius; j++) {
                if (i < 0 || i >= config.dimensions.gridWidth || j < 0 || j >= config.dimensions.gridHeight) continue;
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
    mapSelect: HTMLSelectElement;
    brushRange: HTMLInputElement;

}

const mapEditor: MapEditorInterface = new MapEditor('editButton', 'saveButton', 'toolbar', "loadButton", "mapSelect", "brushRadius");

export default mapEditor;