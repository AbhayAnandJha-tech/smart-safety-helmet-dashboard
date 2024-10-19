import React, { Component } from "react";
import Node from "./Node/Node.tsx";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "../algorithms/dijkstra.js";
import "../styles/PathfindingVisualizer.css";

interface VisualizerState {
  grid: any[][];
  mouseIsPressed: boolean;
  weight: number;
  changeWeight: boolean;
  startNode: { row: number; col: number };
  finishNode: { row: number; col: number };
}

export default class Visualizer extends Component<{}, VisualizerState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      weight: 1,
      changeWeight: false,
      startNode: { row: 8, col: 8 },
      finishNode: { row: 8, col: 15 },
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  getInitialGrid() {
    const grid = [];
    for (let row = 0; row < 17; row++) {
      const currentRow = [];
      for (let col = 0; col < 40; col++) {
        currentRow.push(this.createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  }

  createNode(col: number, row: number) {
    const { startNode, finishNode } = this.state;
    return {
      col,
      row,
      isStart: row === startNode.row && col === startNode.col,
      isFinish: row === finishNode.row && col === finishNode.col,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  }

  handleMouseDown(row: number, col: number) {
    const newGrid = this.state.changeWeight
      ? this.getNewGridWithWeightToggled(row, col)
      : this.getNewGridWithWallToggled(row, col);

    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row: number, col: number) {
    if (!this.state.mouseIsPressed) return;

    const newGrid = this.state.changeWeight
      ? this.getNewGridWithWeightToggled(row, col)
      : this.getNewGridWithWallToggled(row, col);

    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder: any[], nodesInShortestPathOrder: any[]) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        this.updateNodeClass(node, "node-visited");
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder: any[]) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const className = node.isWeight
          ? "node-path-weight"
          : "node-shortest-path";

        this.updateNodeClass(node, className);

        if (node.isFinish) {
          this.updateNodeClass(node, "node-shortest-path node-finish");
        }
        if (node.isStart) {
          this.updateNodeClass(node, "node-shortest-path node-start");
        }
      }, 50 * i);
    }
  }

  updateNodeClass(node: any, className: string) {
    const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
    if (nodeElement) {
      nodeElement.className = `node ${className}`;
    }
  }

  visualizeDijkstra() {
    const { grid, startNode, finishNode } = this.state;
    const start = grid[startNode.row][startNode.col];
    const finish = grid[finishNode.row][finishNode.col];
    const visitedNodesInOrder = dijkstra(grid, start, finish);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  toggleWeight = () => {
    this.setState((prevState) => ({ changeWeight: !prevState.changeWeight }));
  };

  clearFormat() {
    const { grid, startNode, finishNode } = this.state;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        const className =
          row === startNode.row && col === startNode.col
            ? "node node-start"
            : row === finishNode.row && col === finishNode.col
            ? "node node-finish"
            : "node white";

        this.updateNodeClass(grid[row][col], className);
      }
    }
  }

  reset() {
    const grid = this.getInitialGrid();
    this.setState({ grid }, () => this.clearFormat());
  }

  clickStart() {
    const input = (document.getElementById("start-input") as HTMLInputElement)
      .value;
    const [x, y] = input.split(",").map((coord) => parseInt(coord.trim(), 10));
    if (!isNaN(x) && !isNaN(y)) {
      this.setState({ startNode: { row: y, col: x } }, this.reset);
    } else {
      console.error("Invalid start coordinates.");
    }
  }

  clickEnd() {
    const input = (document.getElementById("end-input") as HTMLInputElement)
      .value;
    const [x, y] = input.split(",").map((coord) => parseInt(coord.trim(), 10));
    if (!isNaN(x) && !isNaN(y)) {
      this.setState({ finishNode: { row: y, col: x } }, this.reset);
    } else {
      console.error("Invalid end coordinates.");
    }
  }

  getNewGridWithWallToggled(row: number, col: number) {
    const newGrid = this.state.grid.slice();
    const node = newGrid[row][col];
    const newNode = { ...node, isWall: !node.isWall };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  getNewGridWithWeightToggled(row: number, col: number) {
    const newGrid = [...this.state.grid];
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWeight: !node.isWeight,
      weight: parseInt(this.state.weight.toString()),
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <div className="container">
        <div className="button-container">
          <button
            className="button-27"
            onClick={() => this.visualizeDijkstra()}
          >
            Visualize Dijkstra's Algorithm
          </button>
          <button className="button-27 reset" onClick={() => this.reset()}>
            Reset
          </button>
        </div>

        <div className="input-container">
          <div className="input-group">
            <label htmlFor="start-input" className="input-label">
              Enter the start point
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="start-input"
                className="input-field"
                placeholder="x,y"
              />
              <button className="submit-btn" onClick={() => this.clickStart()}>
                Submit
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="end-input" className="input-label">
              Enter the end point
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="end-input"
                className="input-field"
                placeholder="x,y"
              />
              <button className="submit-btn" onClick={() => this.clickEnd()}>
                Submit
              </button>
            </div>
          </div>
        </div>

        <div className="grid">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => (
                <Node
                  key={nodeIdx}
                  row={node.row}
                  col={node.col}
                  isFinish={node.isFinish}
                  isStart={node.isStart}
                  isWall={node.isWall}
                  isWeight={node.isWeight}
                  isVisited={node.isVisited}
                  mouseIsPressed={mouseIsPressed}
                  onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                  onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                  onMouseUp={() => this.handleMouseUp()}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
