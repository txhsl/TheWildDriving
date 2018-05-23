Model = function() {
	this.planes = {};
	this.userPlane;
	this.settings;
}

Model.prototype.checkUserCollision = function (){
	for (id in this.planes){
		if (id != this.userPlane.id){
			var diffPos = this.userPlane.mesh.position.clone().sub(this.planes[id].mesh.position.clone());
			var d = diffPos.length();
        	if (d < game.usrDistanceTolerance){

				if (!this.userPlane.protected){
					game.planeCollisionSpeedX = 100 * diffPos.x / d;
					game.planeCollisionSpeedY = 100 * diffPos.y / d;
					ambientLight.intensity = 2;

					this.userPlane.mesh.position.z += 0.5 * game.ennemyDistanceTolerance * diffPos.z / d;
					this.userPlane.mesh.position.y += 0.5 * game.ennemyDistanceTolerance * diffPos.y / d;
					removeEnergy();
				}

			}
		}
	}
}

Model.prototype.updateScore = function (){
	var rankedPlanes = this.planes;
	scoreList.innerHTML = "<tr><th><span>Player</span></th><th><span>Distance</span></th></tr>";
	for (id in rankedPlanes){
		var plane = this.planes[id];
		var tr = document.createElement("tr"); 
		var tdPlayer = document.createElement("td"); 
		var tdScore = document.createElement("td"); 
		var spanPlayer = document.createElement("span"); 
		var spanScore = document.createElement("span");
		spanPlayer.innerHTML = plane.name;
		spanScore.innerHTML = parseInt(plane.distance);

		scoreList.appendChild(tr);
		tr.appendChild(tdPlayer);
		tr.appendChild(tdScore);
		tdPlayer.appendChild(spanPlayer);
		tdScore.appendChild(spanScore);
	}
}