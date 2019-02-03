export class Node{
    x: number;
    y: number;
    hCost: number;
    gCost: number;
    fCost: number;
    walkable: boolean;
    neighbors: Node[];
    parent: Node;
    
    open: boolean;
    close: boolean;
    start: boolean;
    end: boolean;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
        this.walkable = true;
        this.neighbors = new Array();
    }
}