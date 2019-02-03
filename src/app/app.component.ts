import { Component } from '@angular/core';
import { Node } from './models/node.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  map: Node[];
  obstacles:Node[];

  constructor() {
    let x = 11;
    let y = 6;
    this.map = new Array();
    let mapCoords = new Array();
    this.obstacles = new Array();

    let grid = [
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,0,1,1,1,1,1,1,1],
      [1,1,1,0,0,0,0,0,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1],
    ];


    // Initialize Nodes to map
    for (let i = 0; i < grid.length; i++) {
      mapCoords[i] = new Array();
      for (let j = 0; j < grid[i].length; j++) {
        let node = new Node(i,j);
        node.walkable = !!grid[i][j];
        this.map.push(node);
        mapCoords[i][j] =node;
      } 
    }
    console.log("Map initialize");

    mapCoords[3][7].start = true;
    mapCoords[1][4].end = true;
    let start: Node = mapCoords[3][7];
    let end: Node = mapCoords[1][4];

    // Initialize Neighbor
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        let node: Node = mapCoords[i][j];
        for (let k = -1; k < 2; k++) {
          for (let l = -1; l < 2; l++) {
            if(node.x + k < 0 || node.y + l < 0) continue;
            if(k==0 && l==0) continue;
            try {
              if(!!mapCoords[node.x + k][node.y + l] && mapCoords[node.x + k][node.y + l].walkable)
                node.neighbors.push(mapCoords[node.x + k][node.y + l]);
            } catch (error) {
              continue;
            }
          }
        }
      } 
    }
    
    console.log("Neighbor initialized");

    //a*

    let open: Node[] = new Array();
    let close: Node[] = new Array();
    open.push(start);
    start.open = true;
    start.fCost = 0;
    let current: Node;

    while(true){
      
      let current: Node = open[0];
      for (let i = 0; i < open.length; i++) {
        if(current.fCost < open[i].fCost)
          current == open[i];
      }

      if(current == end) break;

      current.neighbors.forEach(neighbor => {
        if(close.includes(neighbor)) return;

      });
      
      return;
    }

  }

  getDistance(start: Node, end: Node){
    return Math.sqrt(((start.x - end.x)*(start.x - end.x))+((start.y - end.y)*(start.y - end.y)));
  }



}
