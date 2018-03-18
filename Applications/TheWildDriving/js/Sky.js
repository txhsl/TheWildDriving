Sky = function(){
    this.mesh = new THREE.Object3D();
    this.nClouds = 50;
    this.clouds = [];
    var stepAngle = Math.PI*2 / this.nClouds;
    for(var i=0; i<this.nClouds; i++){
      var c = new Cloud();
      this.clouds.push(c);
      var a = stepAngle*i;
      var h = game.seaRadius + 350 + Math.random()*200;
      c.mesh.position.y = Math.sin(a)*h;
      c.mesh.position.x = Math.cos(a)*h;
      c.mesh.position.z = -1500 + Math.random()*3000;
      c.mesh.rotation.z = a + Math.PI/2;
      var s = 1+Math.random()*2;
      c.mesh.scale.set(s,s,s);
      this.mesh.add(c.mesh);
    }
}
  
Sky.prototype.moveClouds = function(){
    for(var i=0; i<this.nClouds; i++){
      var c = this.clouds[i];
      c.rotate();
    }
    this.mesh.rotation.z += game.speed*deltaTime;
}
