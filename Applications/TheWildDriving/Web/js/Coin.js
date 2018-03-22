Coin = function(){
    var geom = new THREE.TetrahedronGeometry(15,0);
    var mat = new THREE.MeshPhongMaterial({
        color:0x009999,
        shininess:0,
        specular:0xffffff,
  
        shading:THREE.FlatShading
    });
    this.mesh = new THREE.Mesh(geom,mat);
    this.mesh.castShadow = true;
    this.angle = 0;
    this.dist = 0;
}
  
CoinsHolder = function (nCoins){
    this.mesh = new THREE.Object3D();
    this.coinsInUse = [];
    this.coinsPool = [];
    for (var i=0; i<nCoins; i++){
        var coin = new Coin();
        this.coinsPool.push(coin);
    }
}
  
CoinsHolder.prototype.spawnCoins = function(){
  
    var nCoins = 1 + Math.floor(Math.random()*10);
    var d = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight-20);
    var amplitude = 10 + Math.round(Math.random()*10);
    var targetZ = -200 + Math.random()*400;
    for (var i=0; i<nCoins; i++){
        var coin;
        if (this.coinsPool.length) {
            coin = this.coinsPool.pop();
        }else{
            coin = new Coin();
        }
        this.mesh.add(coin.mesh);
        this.coinsInUse.push(coin);
        coin.angle = - (i*0.02);
        coin.distance = d + Math.cos(i*.5)*amplitude;
        coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle)*coin.distance;
        coin.mesh.position.x = Math.cos(coin.angle)*coin.distance;
        coin.mesh.position.z = targetZ;
    }
}
  
CoinsHolder.prototype.rotateCoins = function(){
    for (var i=0; i<this.coinsInUse.length; i++){
        var coin = this.coinsInUse[i];
        if (coin.exploding) continue;
        coin.angle += game.speed*deltaTime*game.coinsSpeed;
        if (coin.angle>Math.PI*2) coin.angle -= Math.PI*2;
        coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle)*coin.distance;
        coin.mesh.position.x = Math.cos(coin.angle)*coin.distance;
        coin.mesh.rotation.z += Math.random()*.1;
        coin.mesh.rotation.y += Math.random()*.1;
  
        //var globalCoinPosition =  coin.mesh.localToWorld(new THREE.Vector3());
        var diffPos = airplane.mesh.position.clone().sub(coin.mesh.position.clone());
        var d = diffPos.length();
        if (d<game.coinDistanceTolerance){
            this.coinsPool.unshift(this.coinsInUse.splice(i,1)[0]);
            this.mesh.remove(coin.mesh);
            particlesHolder.spawnParticles(coin.mesh.position.clone(), 15, 0x009999, .8);
            addEnergy();
            i--;
        }else if (coin.angle > Math.PI){
            this.coinsPool.unshift(this.coinsInUse.splice(i,1)[0]);
            this.mesh.remove(coin.mesh);
            i--;
        }
    }
}