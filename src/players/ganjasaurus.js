//Aydan bot

var utils = require('../lib/utils.js');

var state = {
	chill: function(next){
		next(null);
	},
	huntAmmo: function(player, enemies, env){
		var loc = player.position;
		var ammo = env.ammoPosition;
		var closestDist = null;
		var closestAmmo = null;
		for(var a in ammo){
			var dist = utils.getDistance(loc, ammo[a]);
			if(closestDist == null || dist < closestDist){
				closestDist = dist;
				closestAmmo = ammo[a];
			}
		}
		if(closestAmmo == null){
			return 'move';
		}else{
			var dir = utils.fastGetDirection(player.position, closestAmmo);
			if(player.direction != dir)
				return dir;
			else
				return 'move';
		}
	},
	huntEnemy: function(player, enemies, env){
		// console.log(env);
		// console.log(player.position);
		if(utils.canKill(player, enemies))
			return 'shoot';
		
		if(player.position[0] == enemies[0].position[0]){
			if(player.position[1] > enemies[0].position[1]){
				return 'west';
			}else{
				return 'east';
			}
		}else if(player.position[1] == enemies[0].position[1]){
			if(player.position[0] > enemies[0].position[0]){
				return 'south';
			}else{
				return 'north';
			}
		}

		var predictedLoc = enemies[0].position;
		switch(enemies[0].direction){
			case 'east': predictedLoc[0]++; break;
			case 'west': predictedLoc[0]--; break;
			case 'north': predictedLoc[1]--; break;
			case 'south': predictedLoc[1]++; break;
		}

		if(player.position[0] == predictedLoc[0]){
			if(player.position[0] < predictedLoc[0]){
				console.log('east');
				return 'east';
			}else{
				console.log('west');
				return 'west';
			}
		}else if(player.position[1] == predictedLoc[1]){
			if(player.position[1] < predictedLoc[1]){
				console.log('north');
				return 'north';
			}else{
				console.log('south');
				return 'south';
			}
		}

		// console.log('Best ' + utils.fastGetDirection(player.position, predictedLoc));

		var dir = utils.fastGetDirection(player.position, enemies[0].position);
		if(player.direction != dir)
			return dir;
		else
			return null;
	}
}

var BLAZE = {
  info: {
    name: 'Ganjasaurus',
    style: 5
  },
  ai: (player, enemies, env) => {

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