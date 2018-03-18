Sea = function(){
    var geom = new THREE.CylinderGeometry(game.seaRadius,game.seaRadius,game.seaLength,160,20);
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    geom.mergeVertices();
    var l = geom.vertices.length;
  
    this.waves = [];
  
    for (var i=0;i<l;i++){
      var v = geom.vertices[i];
      //v.y = Math.random()*30;
      this.waves.push({y:v.y,
                       x:v.x,
                       z:v.z,
                       ang:Math.random()*Math.PI*2,
                       amp:game.wavesMinAmp + Math.random()*(game.wavesMaxAmp-game.wavesMinAmp),
                       speed:game.wavesMinSpeed + Math.random()*(game.wavesMaxSpeed - game.wavesMinSpeed)
                      });
    };
    var mat = new THREE.MeshPhongMaterial({
      color:Colors.blue,
      transparent:true,
      opacity:.8,
      shading:THREE.FlatShading,
  
    });
  
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.name = "waves";
    this.mesh.receiveShadow = true;
  
}

Sea.prototype.moveWaves = function (){
    var verts = this.mesh.geometry.vertices;
    var l = verts.length;
    for (var i=0; i<l; i++){
        var v = verts[i];
        var vprops = this.waves[i];
        v.x =  vprops.x + Math.cos(vprops.ang)*vprops.amp;
        v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;
        vprops.ang += vprops.speed*deltaTime;
        this.mesh.geometry.verticesNeedUpdate=true;
    }
}