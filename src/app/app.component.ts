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
    this.solve();
  }

  async solve(){
    let x = 11;
    let y = 6;
    this.map = new Array();
    let mapCoords = new Array();
    this.obstacles = new Array();

    let grid = [
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1],
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

    mapCoords[5][5].start = true;
    mapCoords[0][5].end = true;
    let start: Node = mapCoords[5][5];
    let end: Node = mapCoords[0][5];

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
    start.fCost = start.getFcost(end);
    let current: Node;

    while(true){
      current = this.getLowFcost(open);
      open = open.filter(node=> {return current!=node})
      close.push(current);
      
      for (let i = 0; i < open.length; i++) {
        if(current.fCost < open[i].fCost)
          current == open[i];
      }

      if(current == end) break;
      
      current.neighbors.forEach(neighbor => {
        if(close.includes(neighbor)) return;
        let tempParent = neighbor.parent;
        neighbor.parent = current;
        let newPath = neighbor.getFcost(end);
        neighbor.parent = tempParent;
        if(newPath<neighbor.fCost || !open.includes(neighbor)){
          neighbor.parent = current;
          neighbor.fCost = neighbor.getFcost(end);
          if(!open.includes(neighbor)){
            open.push(neighbor);
          }
        }

      });

      this.updateUI(open, close);
      await this.delay();
    }

    let path: Node[] = end.getPath();
    path.reverse();
    for (let i = 0; i < path.length; i++) {
      let node = path[i];
      node.start = true;
    }
    
  }

  getDistance(start: Node, end: Node){
    return Math.sqrt(((start.x - end.x)*(start.x - end.x))+((start.y - end.y)*(start.y - end.y)));
  }

  getLowFcost(openList:Node[]):Node{
    openList = openList.sort((a, b) => {return a.fCost - b.fCost});
    return openList[0]; 
  }

  updateUI(open: Node[], close: Node[]){
    open.forEach(node => {
      node.open = true;
    });

    close.forEach(node => {
      node.close = true;
      node.open = false;
    });
  }

  delay(){
    return new Promise((resolve, reject)=> {
      setTimeout(resolve, 1000);
    });
  }
}
