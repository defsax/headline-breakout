import Brick from './brick.js';

export const level1 = [
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
  [ 1, 0, 0, 0, 0, 0, 1 ],
  [ 1, 0, 1, 0, 1, 0, 1 ],
  [ 1, 1, 1, 1, 1, 1, 1 ], 
  [ 2, 2, 2, 2, 2, 2, 2 ]
];

export const level2 = [
  [ 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
  [ 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
  [ 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
  [ 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
  [ 2, 2, 2, 2, 2, 2, 2, 2, 2 ]
];

export function buildLevel(gameWorld, level){
  var bricks = [];
  var canvasWidth = gameWorld.getScreenDimensions().width;
  var canvasHeight = gameWorld.getScreenDimensions().height;
  
  var bricksInRow = 0;
  var topSpace = 100;
  
  
  //loop through rows in the level 2d array
  level.forEach((row, rowNumber) => {
    
    //get number of bricks in row
    row.forEach((brick) => {
      ++bricksInRow;
    });

    row.forEach((brick, brickNumber) => {
      if(brick === 1){
        let pos = {
          x: canvasWidth / bricksInRow * brickNumber, 
          y: topSpace + 20 * rowNumber
        }
        bricks.push(new Brick(bricksInRow, pos, gameWorld, false));
      }
      if(brick === 2){
        let pos = {
          x: canvasWidth / bricksInRow * brickNumber, 
          y: topSpace + 20 * rowNumber
        }
        bricks.push(new Brick(bricksInRow, pos, gameWorld, true));
      }
    });
    bricksInRow = 0;
  });
  
  return bricks;
}
