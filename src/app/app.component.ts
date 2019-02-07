import { Component } from '@angular/core';
import { Node } from './models/node.class';
import { Mode } from './models/mode.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  map: Node[];
  obstacles:Node[];
  start: Node;
  end: Node;
  mode: any = Mode.none;

  grid;
  gridx: number;
  gridy: number;

  constructor() {

  }

  createGrid(x: number, y: number){
    this.map = new Array();
    this.gridx = x;
    this.gridy = y;
    this.grid = new Array();
    for (let i = 0; i < x; i++) {
      this.grid[i] = new Array();
      for (let j = 0; j < y; j++) {
        let node = new Node(i,j);
        node.walkable = true;
        this.grid[i][j] = node;
        this.map.push(node);        
      }
    }
  }

  onClick(node: Node){
    if(this.mode == Mode.obstacle){
      node.walkable = false;
    } else if (this.mode == Mode.start){
      this.start = node;
      node.start = true;
      this.mode = Mode.none;
    } else if (this.mode == Mode.end){
      this.end = node;
      node.end = true;
      this.mode = Mode.none;
    }
  }

  async solve(){
    let x = 11;
    let y = 6;
    this.obstacles = new Array();

    // Initialize Neighbor
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        let node: Node = this.grid[i][j];
        for (let k = -1; k < 2; k++) {
          for (let l = -1; l < 2; l++) {
            if(node.x + k < 0 || node.y + l < 0) continue;
            if(k==0 && l==0) continue;
            try {
              if(!!this.grid[node.x + k][node.y + l] && this.grid[node.x + k][node.y + l].walkable)
                node.neighbors.push(this.grid[node.x + k][node.y + l]);
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
    open.push(this.start);
    this.start.open = true;
    this.start.fCost = this.start.getFcost(this.end);
    let current: Node;

    while(true){
      current = this.getLowFcost(open);
      open = open.filter(node=> {return current!=node})
      close.push(current);
      
      for (let i = 0; i < open.length; i++) {
        if(current.fCost < open[i].fCost)
          current == open[i];
      }

      if(current == this.end) break;
      
      current.neighbors.forEach(neighbor => {
        if(close.includes(neighbor)) return;
        let tempParent = neighbor.parent;
        neighbor.parent = current;
        let newPath = neighbor.getFcost(this.end);
        neighbor.parent = tempParent;
        if(newPath<neighbor.fCost || !open.includes(neighbor)){
          neighbor.parent = current;
          neighbor.fCost = neighbor.getFcost(this.end);
          if(!open.includes(neighbor)){
            open.push(neighbor);
          }
        }

      });

      this.updateUI(open, close);
      await this.delay();
    }

    let path: Node[] = this.end.getPath();
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
    openList = openList.sort((a, b) => {
      var n = a.fCost - b.fCost;
      if(n !== 0){
        return n;
      }
      return a.hCost - b.hCost;
    });
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
      setTimeout(resolve, 500);
    });
  }
}
