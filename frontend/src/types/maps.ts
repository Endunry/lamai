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
}

export interface Dimensions{
    gridWidth: number;
    gridHeight: number;
}

export interface Coordinates {
    x: number;
    y: number;
}
export type staticData = 1 | 2 | 3 | -1 | null; // 1 = border, -1 = void, null = empty

