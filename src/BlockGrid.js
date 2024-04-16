import Block from './Block';

class BlockGrid {
  constructor(width = 10, height = 10) {
    this.width = width;
    this.height = height;
    this.grid = [];

    for (let x = 0; x < this.width; x++) {
      const col = [];
      for (let y = 0; y < this.height; y++) {
        col.push(new Block(x, y));
      }

      this.grid.push(col);
    }
  }

  render(el = document.getElementById('gridEl')) {
    for (let x = 0; x < this.width; x++) {
      const id = 'col_' + x;
      const colEl = document.createElement('div');
      colEl.id = id;
      colEl.className = 'col';
      el.appendChild(colEl);

      for (let y = this.height - 1; y >= 0; y--) {
        const block = this.grid[x][y];
        const id = `block_${x}x${y}`;
        const blockEl = document.createElement('div');

        blockEl.id = id;
        blockEl.className = 'block';
        blockEl.style.background = block.colour;
        blockEl.addEventListener('click', evt => this.blockClicked(evt, block));
        colEl.appendChild(blockEl);
      }
    }
  }

  /**
 * Handles the click event on a block.
 * If the block has a non-null color, it initiates the removal of connected blocks with the same color,
 * shifts blocks downward, resets the grid, and re-renders the grid.
 * @param {Event} event The click event object.
 * @param {Object} block The block object representing the clicked block.
 */
  blockClicked(event, block) {
    const { x, y, colour } = block;

    if (colour !== null) {
      const removedBlockArray = [];

      this.removeConnectedBlocks(x, y, colour, removedBlockArray)
        .shiftBlocksDownward(removedBlockArray)
        .resetGrid()
        .render();
    }
  }

  /**
   * Removes connected blocks with the same color recursively.
   * @param {number} x The x-coordinate of the block.
   * @param {number} y The y-coordinate of the block.
   * @param {string} colour The color of the block.
   * @param {Array<Array<number>>} removedBlockArray An array to store removed block coordinates.
   * @returns {Object} Returns the current instance for chaining.
   */
  removeConnectedBlocks = (x, y, colour, removedBlockArray) => {
    const adjacentBlocks = [];
    const parsedBlocks = new Set();
    const directionsArray = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];

    adjacentBlocks.push([x, y]);

    while (adjacentBlocks.length > 0) {
      const [row, column] = adjacentBlocks.pop();

      if (this.withinBoundaries(row, column) && !parsedBlocks.has(`${row},${column}`)) {
        parsedBlocks.add(`${row},${column}`);

        if (this.checkBlockColour(row, column, colour)) {
          this.removeBlock(row, column);
          removedBlockArray.push([row, column]);

          directionsArray.forEach(([xOffset, yOffset]) => {
            adjacentBlocks.push([row + xOffset, column + yOffset]);
          });
        }
      }
    }

    return this;
  }

  /**
   * Checks if a given row and column are within the boundaries of the grid.
   * @param {number} row The row index.
   * @param {number} column The column index.
   * @returns {boolean} Returns true if the coordinates are within the grid boundaries, false otherwise.
   */
  withinBoundaries = (row, column) => {
    return row >= 0 && column >= 0 && row < this.width && column < this.height;
  }

  /**
   * Checks if the color of a block matches the specified color.
   * @param {number} row The row index of the block.
   * @param {number} column The column index of the block.
   * @param {string} colour The color to compare with.
   * @returns {boolean} Returns true if the block color matches the specified color, false otherwise.
   */
  checkBlockColour = (row, column, colour) => {
    return this.grid[row][column].colour === colour;
  }

  /**
   * Removes the color of the block at the specified coordinates.
   * @param {number} row The row index of the block.
   * @param {number} column The column index of the block.
   */
  removeBlock = (row, column) => {
    this.grid[row][column].colour = null;
  }

  /**
   * Shifts blocks downward after removal, starting from the bottom and iterating upwards.
   * @param {Array<Array<number>>} removedBlockArray An array containing the coordinates of removed blocks.
   * @returns {Object} Returns the current instance for chaining.
   */
  shiftBlocksDownward(removedBlockArray) {
    removedBlockArray.forEach(([x, y]) => {
      for (let yPos = this.height - 1; yPos >= 0; yPos--) {
        let currentRow = yPos;

        while (this.blockBelowIsEmpty(x, currentRow)) {
          this.moveBlockDown(x, currentRow);
          currentRow++;
        }
      }
    });
    return this;
  }

  /**
   * Checks if the block below a given position is empty.
   * @param {number} x The x-coordinate of the block.
   * @param {number} y The y-coordinate of the block.
   * @returns {boolean} Returns true if the block below is empty, false otherwise.
   */
  blockBelowIsEmpty(x, y) {
    return this.grid[x][y].colour === null && this.grid[x][y + 1];
  }

  /**
   * Moves the block at the specified position one step down.
   * @param {number} x The x-coordinate of the block.
   * @param {number} y The y-coordinate of the block.
   */
  moveBlockDown(x, y) {
    this.grid[x][y].colour = this.grid[x][y + 1].colour;
    this.grid[x][y + 1].colour = null;
  }

  /**
   * Resets the grid by clearing its content.
   * @returns {Object} Returns the current instance for chaining.
   */
  resetGrid() {
    document.getElementById('gridEl').innerHTML = '';
    return this;
  }
}

export default BlockGrid;