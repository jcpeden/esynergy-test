import Block from './Block';

class BlockGrid {
  constructor(width = 10, height = 10) {
    this.width = width;
    this.height = height;
    this.grid = [];

    for (let x = 0; x < this.width; x++) {
      const column = [];
      for (let y = 0; y < this.height; y++) {
        column.push(new Block(x, y));
      }
      this.grid.push(column);
    }
  }

  /**
   * Renders the block grid in the specified element or default element.
   * Creates DOM elements for each block in the grid and appends them to the specified container.
   * Each block element is assigned an ID based on its coordinates and styled according to its color.
   * Click event listeners are added to each block element to handle block clicks.
   * @param {HTMLElement} [element=document.getElementById('gridEl')] The container element to render the grid into.
   */
  render(element = document.getElementById('gridEl')) {
    for (let x = 0; x < this.width; x++) {
      const columnId = 'col_' + x;
      const columnElement = document.createElement('div');
      columnElement.id = columnId;
      columnElement.className = 'col';
      element.appendChild(columnElement);

      for (let y = this.height - 1; y >= 0; y--) {
        const block = this.grid[x][y];
        const blockId = `block_${x}x${y}`;
        const blockElement = document.createElement('div');

        blockElement.id = blockId;
        blockElement.className = 'block';
        blockElement.style.background = block.colour;
        blockElement.addEventListener('click', evt => this.blockClicked(evt, block));
        columnElement.appendChild(blockElement);
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

    // While there are block available in the array to be parsed
    while (adjacentBlocks.length > 0) {

      // Get the row and column the last block from the array
      const [row, column] = adjacentBlocks.pop();

      // If block is within the grid and hasn't already been parsed
      if (this.withinBoundaries(row, column) && !parsedBlocks.has(`${row},${column}`)) {

        // Add it to the parsedBlocks set
        parsedBlocks.add(`${row},${column}`);

        // If current block matches colour of clicked block
        if (this.checkBlockColour(row, column, colour)) {

          // Remove current block from the grid by setting its colour to null
          this.removeBlock(row, column)

          // Update the array of blocks that have been removed
          removedBlockArray.push([row, column]);

          // Add all adjacent blocks into the adjacentBlocks array to be parsed
          directionsArray.forEach(([xOffset, yOffset]) => {
            adjacentBlocks.push([row + xOffset, column + yOffset]);
          });
        }
      }
    }

    return this;
  }

  withinBoundaries = (row, column) => {
    return row >= 0 && column >= 0 && row < this.width && column < this.height;
  }

  checkBlockColour = (row, column, colour) => {
    return this.grid[row][column].colour === colour
  }

  removeBlock = (row, column) => {
    this.grid[row][column].colour = null;
  }

  // Shift blocks downward, starting from the bottom iterate upwards
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

  // Set lower block colour to that of the above block, then set colour of the above block to null
  blockBelowIsEmpty(x, y) {
    return this.grid[x][y].colour === null && this.grid[x][y + 1];
  }

  // Set lower block colour to that of the above block, then set colour of the above block to null
  moveBlockDown(x, y) {
    this.grid[x][y].colour = this.grid[x][y + 1].colour;
    this.grid[x][y + 1].colour = null;
  }

  resetGrid() {
    document.getElementById('gridEl').innerHTML = '';
    return this;
  }
}

export default BlockGrid;

