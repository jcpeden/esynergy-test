import BlockGrid from './BlockGrid';
import Block from './Block';

const CONSTANTS = {
  primaryBlockArray: [
    [0, 4],
    [0, 3],
    [0, 2],
    [0, 1],
    [0, 0],
  ],
  secondaryBlockArray: [
    [1, 4],
    [1, 3],
    [1, 2],
    [1, 1],
    [1, 0],
  ],
  tertiaryBlockArray: [
    [0, 9],
    [0, 8],
    [0, 7],
    [0, 6],
    [0, 5],
  ],
};

/**
 * Creates a wrapper div element with id 'gridEl' and appends it to the document body.
 */
const createWrapper = () => {
  const div = document.createElement('div');
  div.setAttribute('id', 'gridEl');
  document.body.appendChild(div);
};

/**
 * Simulates a click event on the block with the specified id.
 * @param {string} id The id of the block to be clicked.
 */
const clickBlock = (id) => {
  document.getElementById(id).click();
};

/**
 * Asserts that blocks in the specified block array have the specified color.
 * @param {BlockGrid} blockGrid The BlockGrid instance.
 * @param {Array<Array<number>>} blockArray An array of block coordinates.
 * @param {string} colour The expected color of the blocks.
 */
const assertBlockColor = (blockGrid, blockArray, colour) => {
  blockArray.forEach(
    ([x, y]) => expect(blockGrid.grid[x][y].colour === colour)
  )
}

/**
 * Sets the color of blocks in the specified block array.
 * @param {BlockGrid} blockGrid The BlockGrid instance.
 * @param {Array<Array<number>>} blockArray An array of block coordinates.
 * @param {string} colour The color to set for the blocks.
 */
const setBlockArrayColour = (blockGrid, blockArray, colour) => {
  blockArray.forEach(
    ([x, y]) => (blockGrid.grid[x][y].colour = colour)
  );
}

/**
 * Sets up the test environment with a new BlockGrid instance.
 * @param {number} width The width of the BlockGrid.
 * @param {number} height The height of the BlockGrid.
 * @returns {BlockGrid} Returns a new BlockGrid instance.
 */
const setup = (width = 10, height = 10) => {
  createWrapper();

  return new BlockGrid(width, height)
}

describe('BlockGrid', () => {
  let blockGrid;

  describe('when using default height and width values', () => {
    beforeEach(() => {
      blockGrid = setup();

      blockGrid.render();
    })

    it('should create a multidimensional array of Blocks', () => {
      expect(blockGrid.grid.length).toBe(10);

      blockGrid.grid.forEach(column => {
        expect(column.length).toBe(10);

        column.forEach(block => {
          expect(block).toBeInstanceOf(Block);
        });
      });
    })

    describe('and when a user clicks on a block', () => {
      beforeEach(() => {
        clickBlock('block_0x9');
      })

      it('should "remove" that block by setting its background to null', () => {
        expect(document.getElementById('block_0x9').style.background).toBe('');
      })
    })

    describe('when adjacent blocks have the same colour', () => {
      const { primaryBlockArray, secondaryBlockArray, tertiaryBlockArray } = CONSTANTS;

      beforeEach(() => {
        // Reassign primaryBlockArray (col 0, bottom) blockArray colour to blue
        setBlockArrayColour(blockGrid, primaryBlockArray, 'red')

        // Reassign secondaryBlockArray (col 1, bottom) blockArray colour to blue
        setBlockArrayColour(blockGrid, secondaryBlockArray, 'blue')

        // Reassign tertiaryBlockArray (col 0, top) blockArray colour to green
        setBlockArrayColour(blockGrid, tertiaryBlockArray, 'green')

        // Render the grid
        blockGrid.render();
      })

      describe('and when user clicks on a block in the primaryBlockArray group', () => {
        beforeEach(() => {
          clickBlock('block_0x0');
        })

        it('should remove all adjacent blocks with the same colour', () => {
          assertBlockColor(blockGrid, primaryBlockArray, null)
        })

        it('should not remove any blocks of a different colour', () => {
          assertBlockColor(blockGrid, secondaryBlockArray, 'blue')
        })

        it('should drop tertiaryBlockArray group blocks into the available space', () => {
          assertBlockColor(blockGrid, primaryBlockArray, 'green')
        })
      });
    });
  })

  describe('when using custom height and width values', () => {
    beforeEach(() => {
      blockGrid = setup(3, 5);
      blockGrid.render();
    })

    it('should create a multidimensional array of Blocks', () => {
      expect(blockGrid.grid.length).toBe(3);

      blockGrid.grid.forEach(column => {
        expect(column.length).toBe(5);

        column.forEach(block => {
          expect(block).toBeInstanceOf(Block);
        });
      });
    })
  })
});