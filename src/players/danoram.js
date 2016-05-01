//Danoram bot

var utils = require('../lib/utils.js');


var LEGEND = {
  info: {
    name: 'Danoram',
    style: 5
  },
  ai: (playerState, enemiesStates, gameEnvironment) => {
    var directionToAmmo;

    if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
      return 'shoot';
    }
    if (gameEnvironment.ammoPosition.length > 0) {
      //directionToAmmo = utils.fastGetDirection(playerState.position, gameEnvironment.ammoPosition[0]);


      if (!playerState.ammo) {
        //check all ammo for closest
        var closest = 0;

        var minDist = 1000.0;
        var i;
        for (i = 0; i < gameEnvironment.ammoPosition.length; i++) {
            var dist = utils.getDistance(playerState.position, gameEnvironment.ammoPosition[i]);
            if (dist < minDist) {
                closest = i;
                minDist = dist;
            }
        }
        directionToAmmo = utils.fastGetDirection(playerState.position, gameEnvironment.ammoPosition[closest]);
        //console.log(directionToAmmo);
        if (directionToAmmo !== playerState.direction) return directionToAmmo;
        return 'move';
      }
      

      
    }
    //player has ammo - go into hunt mode
    if(enemiesStates){
      
      var i;
      for(i = 0; i < enemiesStates.length; i++){
        var enemy = enemiesStates[i];
        var distToEnemy = utils.getDistance(playerState.position, enemy.position);
        //console.log(distToEnemy);


        //find if enemy is facing me
        //if a position is in line with enemy direction
        // return not safe

        var safeDirection = ['north','south','east','west'];

        var targetPosition = playerState.position;
        //console.log("TARGETTING");
        //console.log(playerState.position);

        //make an array of positions around player [y,x]
        // [+1,0] south, [-1,0] north, [0,+1] east, [0,-1] west -> 

        //remember 
        var areaAroundPlayer = [[playerState.position[0]+1,playerState.position[1]],[playerState.position[0]-1,playerState.position[1]],[playerState.position[0],playerState.position[1]+1],[playerState.position[0],playerState.position[1]-1]];
        //console.log(areaAroundPlayer);

        var j;
        for(j = 0; j < areaAroundPlayer.length; j++){
          //check position is in bounds of grid
          if(((areaAroundPlayer[j][0] < gameEnvironment.gridSize) && (areaAroundPlayer[j][0] >= 0)) || ((areaAroundPlayer[j][1] < gameEnvironment.gridSize) && (areaAroundPlayer[j][1] >= 0))) {

          }
        }

        if (utils.canKill(enemy, [playerState]) && playerState.ammo){
          console.log("NOT SAFE!");
        }
      }
      

      

      //console.log("hunt");
      
    }



    return utils.safeRandomMove();
  }
};


module.exports = LEGEND;