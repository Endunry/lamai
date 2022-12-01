export interface mapData{
    statics: staticData[][]; // 2D array of staticData
    lama: Coordinates | null;
    pinky: Coordinates | null;
    inky: Coordinates | null;
    clyde: Coordinates | null;
    blinky: Coordinates | null;
    door: Coordinates[] | null;
    home: Coordinates | null;
    borderDrawing?: 'original' | 'simple';
    dimensions?: Dimensions;
    agentType?: AgentType;

}

export interface Dimensions{
    gridWidth: number;
    gridHeight: number;
}

export type AgentType = 'random' | 'reflex' | 'replanning' | null;

export interface Coordinates {
    x: number;
    y: number;
}
export type staticData = 1 | 2 | 3 | -1 | null; // 1 = border, -1 = void, null = empty

