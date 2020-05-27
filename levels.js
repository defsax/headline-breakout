import Brick from './brick.js';

/*
  0 = no brick
  1 = special brick
  2 = invincible brick
  3 = 1 hit brick
  4 = 2 hit brick
  5 = 3 hit brick
*/

export const level1 = [
  [ 3, 3, 3, 3 ],
  [ 3, 3, 3, 3 ],
  [ 3, 3, 3, 3 ],
  [ 3, 3, 3, 3 ] 
];

export const level2 = [
  [ 3, 3, 3, 3 ],
  [ 3, 3, 1, 3 ],
  [ 3, 3, 3, 3 ],
  [ 4, 4, 4, 4 ]
];

export const level3 = [
  [ 3, 3, 3, 3 ],
  [ 4, 4, 4, 4 ],
  [ 4, 4, 1, 4 ],
  [ 5, 5, 5, 5 ]
];

export const level4 = [
  [ 5, 5, 5, 5, 5 ],
  [ 5, 5, 5, 5, 5 ],
  [ 4, 4, 4, 4, 4 ],
  [ 3, 3, 3, 3, 3 ]
];

export const level5 = [
  [ 3, 5, 5, 5, 3 ],
  [ 3, 5, 1, 5, 3 ],
  [ 3, 5, 5, 5, 3 ],
  [ 4, 4, 4, 4, 4 ]
];

export const level6 = [
  [ 1, 4, 4, 4, 4 ],
  [ 2, 2, 4, 2, 2 ],
  [ 2, 4, 4, 4, 2 ],
  [ 2, 2, 3, 2, 2 ]
];

export const level7 = [
  [ 3, 5, 5, 5, 3 ],
  [ 3, 5, 1, 5, 3 ],
  [ 3, 5, 5, 5, 3 ],
  [ 4, 4, 4, 4, 4 ]
];

export const level8 = [
  [ 3, 5, 5, 5, 3 ],
  [ 3, 5, 1, 5, 3 ],
  [ 3, 5, 5, 5, 3 ],
  [ 4, 4, 4, 4, 4 ]
];

export function buildLevel(gameWorld, level){
  var bricks = [];
  var canvasWidth = gameWorld.getScreenDimensions().width;
  var canvasHeight = gameWorld.getScreenDimensions().height;
  
  var bricksInRow = 0;
  var topSpace = 100;
  var brickHeight = 30;
  
  
  //loop through rows in the level 2d array
  level.forEach((row, rowNumber) => {
    
    //get number of bricks in row
    row.forEach((brick) => {
      ++bricksInRow;
    });

    row.forEach((brick, brickNumber) => {
      
      switch(brick){
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
        case 4:
          break;
        case 5:
          break;
        default:
          break;
      }
      //special
      if(brick === 1){
        let pos = {
          x: canvasWidth / bricksInRow * brickNumber, 
          y: topSpace + brickHeight * rowNumber
        }
        bricks.push(new Brick(bricksInRow, pos, gameWorld, true, false, 1, '#ffffff'));
      }
      //invincible
      if(brick === 2){
        let pos = {
          x: canvasWidth / bricksInRow * brickNumber, 
          y: topSpace + brickHeight * rowNumber
        }
        bricks.push(new Brick(bricksInRow, pos, gameWorld, false, true, 0, '#837E7C'));
      }
      //1 hit
      if(brick === 3){
        let pos = {
          x: canvasWidth / bricksInRow * brickNumber, 
          y: topSpace + brickHeight * rowNumber
        }
        bricks.push(new Brick(bricksInRow, pos, gameWorld, false, false, 1, '#ADDFFF'));
      }
      //2 hit
      if(brick === 4){
        let pos = {
          x: canvasWidth / bricksInRow * brickNumber, 
          y: topSpace + brickHeight * rowNumber
        }
        bricks.push(new Brick(bricksInRow, pos, gameWorld, false, false, 2, '#79BAEC'));
      }
      //3 hit
      if(brick === 5){
        let pos = {
          x: canvasWidth / bricksInRow * brickNumber, 
          y: topSpace + brickHeight * rowNumber
        }
        bricks.push(new Brick(bricksInRow, pos, gameWorld, false, false, 3, '#306EFF'));
      }
    });
    bricksInRow = 0;
  });
  
  return bricks;
}
