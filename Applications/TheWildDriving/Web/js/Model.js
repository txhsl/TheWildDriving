Model = function() {
	this.planes = {};
	this.userPlane;
	this.settings;
}

Model.prototype.checkUserCollision = function (){
	for (var id in this.planes){
		if (id != this.userPlane.id){
			var diffPos = this.userPlane.mesh.position.clone().sub(this.planes[id].mesh.position.clone());
			var d = diffPos.length();
        	if (d < game.usrDistanceTolerance){

				game.planeCollisionSpeedX = 100 * diffPos.z / d;
				game.planeCollisionSpeedY = 100 * diffPos.y / d;
				ambientLight.intensity = 2;

				//this.userPlane.mesh.position.z += 0.5 * game.ennemyDistanceTolerance * diffPos.z / d;
				//this.userPlane.mesh.position.y += 0.5 * game.ennemyDistanceTolerance * diffPos.y / d;
				removeEnergy();
			}
		}
	}
}

Model.prototype.updateScore = function (){
	var rankedId = Object.keys(model.planes).sort(function(a, b) {
		return model.planes[b].distance - model.planes[a].distance;
	});
	scoreList.innerHTML = "<tr><th><span>Player</span></th><th><span>Distance</span></th></tr>";
	for (var pos in rankedId){
		var plane = model.planes[rankedId[pos]];
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

Model.prototype.updateHistoryScore = function (data){
	
	historyScoreList.innerHTML = "<tr><th><span>Player</span></th><th><span>Distance</span></th></tr>";
	for (var pos in data.score){
		var plane = data.score[pos];
		var tr = document.createElement("tr"); 
		var tdPlayer = document.createElement("td"); 
		var tdScore = document.createElement("td"); 
		var spanPlayer = document.createElement("span"); 
		var spanScore = document.createElement("span");
		spanPlayer.innerHTML = plane.name;
		spanScore.innerHTML = parseInt(plane["max(distance)"]);

		historyScoreList.appendChild(tr);
		tr.appendChild(tdPlayer);
		tr.appendChild(tdScore);
		tdPlayer.appendChild(spanPlayer);
		tdScore.appendChild(spanScore);
	}
}

Model.prototype.saveScore = function (){
	var name = model.userPlane.name;
	var distance = model.userPlane.distance;

	webSocketService.sendSaveRequest(name, distance);
}