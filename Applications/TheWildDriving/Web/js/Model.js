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
        	if (d < game.ennemyDistanceTolerance){

				if (!this.userPlane.protected){
					game.planeCollisionSpeedX = 100 * diffPos.x / d;
					game.planeCollisionSpeedY = 100 * diffPos.y / d;
					ambientLight.intensity = 2;

					this.userPlane.mesh.position.z += game.ennemyDistanceTolerance * diffPos.z / d;
					this.userPlane.mesh.position.y += game.ennemyDistanceTolerance * diffPos.y / d;
					removeEnergy();
				}

			}
		}
	}
}