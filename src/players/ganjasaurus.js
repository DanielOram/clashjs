//Aydan bot

var utils = require('../lib/utils.js');

var lastPos = [0, 0];

function getClosestAmmo(loc, ammo, exclude){
	var closest = null;
	var closestDist = null;
	for(var a in ammo){
		var dist = utils.getDistance(loc, ammo[a]);
		if((closestDist == null || dist < closestDist)){
			if(exclude.length == 0 || exclude.indexOf(ammo[a]) == -1){
				closestDist = dist;
				closest = ammo[a];
			}
		}
	}
	return closest;
}

function moveTowards(player, loc){
	var dir = utils.fastGetDirection(player.position, loc);
	if(player.direction != dir)
		return dir;
	else
		return 'move';
}

var state = {
	huntAmmo: function(player, enemies, env){
		var ammo = env.ammoPosition;
		var closestEnemyAmmo = getClosestAmmo(enemies[0].position, ammo, []);
		var closestPlayerAmmo = getClosestAmmo(player.position, ammo, []);
		
		if(closestEnemyAmmo == null){
			if(closestPlayerAmmo != null){
				return moveTowards(player, closestPlayerAmmo);
			}else{
				return utils.safeRandomMove();
			}
		}else{
			if(closestPlayerAmmo == closestEnemyAmmo){
				console.log('Enemy closer');
				closestPlayerAmmo = getClosestAmmo(player.position, ammo, [closestEnemyAmmo]);
				if(closestPlayerAmmo){
					return moveTowards(player, closestEnemyAmmo)
				}else{
					return utils.safeRandomMove();
				}
			}else{
				return utils.safeRandomMove();
			}
			if(utils.getDistance(player.position, closestEnemyAmmo) < utils.getDistance(enemies[0].position, closestEnemyAmmo)){
				return moveTowards(player, closestEnemyAmmo);
			}else{
				var closestAmmo = getClosestAmmo(player.position, ammo, [closestEnemyAmmo]);
				if(closestAmmo != null)
					return moveTowards(player, closestAmmo);
				else
					return utils.safeRandomMove();
			}
		}
	},
	huntEnemy: function(player, enemies, env){
		if(utils.canKill(player, enemies))
			return 'shoot';
		
		if(player.position[0] == enemies[0].position[0]){
			if(player.position[1] > enemies[0].position[1]){
				if(player.direction == 'west') return 'shoot';
				return 'west';
			}else if(player.position[1] < enemies[0].position[1]){
				if(player.direction == 'east') return 'shoot';
				return 'east';
			}
		}else if(player.position[1] == enemies[0].position[1]){
			if(player.position[0] > enemies[0].position[0]){
				if(player.direction == 'south') return 'shoot';
				return 'south';
			}else if(player.position[0] < enemies[0].position[0]){
				if(player.direction == 'north') return 'shoot';
				return 'north';
			}
		}

		var inc = 2;

		var predictedLoc = enemies[0].position;
		switch(enemies[0].direction){
			case 'south': predictedLoc[0] -= inc; break;
			case 'north': predictedLoc[0] += inc; break;
			case 'east': predictedLoc[1] -= inc; break;
			case 'west': predictedLoc[1] += inc; break;
		}

		var mod = 3;

		if(player.position[0] > predictedLoc[0] - mod && player.position[0] < predictedLoc[0] + mod ){
			if(player.position[1] < predictedLoc[1]){
				console.log('east');
				return 'east';
			}else{
				console.log('west');
				return 'west';
			}
		}else if(player.position[1] > predictedLoc[1] - mod && player.position[1] < predictedLoc[1] + mod){
			if(player.position[0] < predictedLoc[0]){
				console.log('south');
				return 'south';
			}else{
				console.log('north');
				return 'north';
			}
		}

		var dir = utils.getDirection(player.position, enemies[0].position);
		if(player.direction != dir)		
			return dir;
		else
			return utils.safeRandomMove();

		// console.log('Best ' + utils.fastGetDirection(player.position, predictedLoc));

		/*var dir = utils.getDirection(player.position, enemies[0].position);
		if(player.direction != dir)
			return dir;
		else
			return null;*/
	}
}

var BLAZE = {
  info: {
    name: 'Ganjasaurus',
    style: 7
  },
  ai: (player, enemies, env) => {
		// console.log(lastPos[0] - player.position[0], lastPos[1] - player.position[1]);
		// console.log(player.position);
		lastPos = player.position;

  	if(player.ammo == 0)
  		return state.huntAmmo(player, enemies, env);
  	else
  		return state.huntEnemy(player, enemies, env);

  	/*findClosestAmmo(player.position, env.ammoPosition);
    var directionToAmmo;

    if (utils.canKill(player, enemies) && player.ammo) {
      return 'shoot';
    }
    if (env.ammoPosition.length) {
      directionToAmmo = utils.fastGetDirection(player.position, env.ammoPosition[0]);

      if (directionToAmmo !== player.direction) return directionToAmmo;
      return 'move';
    }
    return utils.safeRandomMove();*/
  }
};

module.exports = BLAZE;

/*
Player state

ammo: 1
direction: "west"
isAlive: true
position: Array[2]
style: 5
*/