import { Vector } from "p5";
import Border from "./BuildBlocks/borders";
import Door from "./BuildBlocks/door";
import Void from "./BuildBlocks/void";
import { Cookie, Power } from "./Entities/collectible";
import { Clyde, Pinky, Blinky, Inky } from "./Entities/gertruds";
import Lama from "./Entities/lama";
import game from "./Game";
import { config } from "./utils/singletons";

export type ClickEvent = MouseEvent & { target: HTMLCanvasElement | HTMLButtonElement };
type printType = { x: any, y: any }[];

interface MapEditorInterface {
    saveMap(): void;
    selectTool(tool?: ClickEvent): void;
    edit(): void;
    mouseListener(event?: ClickEvent): void;
    currentSelection: string | null;
}
// TODO: Map Editor zum laufen bringen
class MapEditor implements MapEditorInterface {

    constructor(editButtonId:string, saveButtonId:string, toolbarId:string) {
        this.editButton = document.getElementById(editButtonId) as HTMLButtonElement;
        this.saveButton = document.getElementById(saveButtonId) as HTMLButtonElement;
        this.toolbar = document.getElementById(toolbarId) as HTMLDivElement;
        this.editButton.addEventListener('click', ()=>this.edit());
        this.saveButton.addEventListener('click', ()=>this.saveMap());
        this.toolbar.addEventListener('click', e=>this.selectTool(e as ClickEvent));
        this.currentSelection = null;
    }

    saveMap() {
        this.saveButton.setAttribute('disabled', 'disabled');
        this.toolbar.classList.add("disabled");
        this.editButton.removeAttribute('disabled');
        this.currentSelection = null;
        let newCurrSelection = document.createElement('span');
        newCurrSelection.id = 'currentSelection';
        document.getElementById('currentSelection').replaceWith(newCurrSelection);
        
        let voids: printType = [];
        let barriers: printType = [];
        let cookies: printType = [];
        let powerups: printType = [];
        let doors: printType = [];
        game.map.forEach((col) => {
            col.forEach((entity) => {

                if (entity instanceof Void) {
                    voids.push({
                        x: entity.pos.x,
                        y: entity.pos.y
                    });
                } else if (entity instanceof Border) {
                    barriers.push({
                        x: entity.pos.x,
                        y: entity.pos.y
                    });
                } else if (entity instanceof Cookie) {
                    cookies.push({
                        x: entity.pos.x,
                        y: entity.pos.y
                    });
                } else if (entity instanceof Power) {
                    powerups.push({
                        x: entity.pos.x,
                        y: entity.pos.y
                    });
                } else if (entity instanceof Door) {
                    doors.push({
                        x: entity.pos.x,
                        y: entity.pos.y
                    });
                }
            });
        });

        let mapData = {
            voids,
            barriers,
            cookies,
            powerups,
            lama: game.lama,
            pinky: game.pinky,
            inky: game.inky,
            clyde: game.clyde,
            blinky: game.blinky,
            home: {
                x: game.homeTarget.x,
                y: game.homeTarget.y
            },
            doors
        }
        let mapDataString = JSON.stringify(mapData);
        document.getElementById("io").innerHTML = mapDataString;

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

    mouseListener(event?: ClickEvent): void {
        if (!event) return;
        let insertedItem;
        console.log(this.currentSelection);
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
        // }

        if (!isOverlapping && insertedItem) {
            game.map[x][y] = insertedItem;
        }
        game.determineBorderTypes();
    }

    currentSelection: string | null;
    editButton: HTMLButtonElement;
    saveButton: HTMLButtonElement;
    toolbar: HTMLDivElement;

}

const mapEditor: MapEditorInterface = new MapEditor('editButton', 'saveButton', 'toolbar');

export default mapEditor;