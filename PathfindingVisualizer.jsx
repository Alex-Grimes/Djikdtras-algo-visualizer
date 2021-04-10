import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import'./PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_COL = 35;
const FINISH_NODE_ROW = 10;

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
    }

    refreshPage = ()=>{
        window.location.reload();
     }

    

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
    }

    handelMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggeled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }
    handelMouseEnter(row, col) {
        if(!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggeled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handelMouseUp(){
        this.setState({mouseIsPressed: false});
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for( let i = 0; i <= visitedNodesInOrder.length; i++) {
            if(i === visitedNodesInOrder.length){
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                  }, 10 * i);
                  return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                  'node node-visited';
              }, 10 * i);
            }
          }
        
          animateShortestPath(nodesInShortestPathOrder) {
            for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
              setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                  'node node-shortest-path';
              }, 50 * i);
            }
          }

    visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitNodesInOrder, nodesInShortestPathOrder);
    }

    setNodeStart = (sRow, sCol) => {

    }

    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            <div class = 'pageBackground'>
                <div class = 'buttonHeader'>
                    <button class = 'visualizeButton' onClick={() => this.visualizeDijkstra()}>
                        Visualize Dijkstra's Algorithm
                    </button>
                    <button class ='reset' onClick={this.refreshPage}>Reset
                    </button>
                    <button class = 'CSP'onClick={this.setNodeStart}>Change Start Position</button>
                </div>
                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const {row, col, isStart, isFinish, isWall} = node;
                                    return (
                                        <Node 
                                            key={nodeIdx}
                                            col={col}
                                            isStart={isStart}
                                            isFinish={isFinish}
                                            isWall={isWall}
                                            mouseIsPressed={mouseIsPressed}
                                            onMouseDown={(row, col) => this.handelMouseDown(row, col)}
                                            onMouseEnter={(row, col) => this.handelMouseUp()}
                                            onMouseUp={() => this.handelMouseUp()}
                                            row={row}></Node>
                                        );
                                    })}
                            </div>
                        );  
                    })}
                </div>
            </div>         
        );
    }
}
        
        
    

const getInitialGrid = () => {
    const grid = [];
    for(let row = 0; row<20; row++) {
        const currentRow = [];
        for(let col = 0; col < 50; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};

const getNewGridWithWallToggeled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

