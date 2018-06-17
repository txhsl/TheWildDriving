var WebSocketService = function(model, webSocket) {
	var webSocketService = this;
	
	var webSocket = webSocket;
	var model = model;
	
	this.hasConnection = false;
	
	// connect in
	this.welcomeHandler = function(data) {
		webSocketService.hasConnection = true;
		
		model.userPlane.id = data.id;
		model.planes[data.id] = model.planes[-1];
		delete model.planes[-1];
		
		$('#chat').initChat();
		if($.cookie('user_name'))	{
			webSocketService.sendMessage('name:'+$.cookie('user_name'));
		}
	};
	
	// update all
	this.updateHandler = function(data) {
		var newup = false;
		// new plane
		if(!model.planes[data.id]) {
			newup = true;
			model.planes[data.id] = new AirPlane(data.id % 4 + 1);
			model.planes[data.id].mesh.scale.set(.25,.25,.25);
			model.planes[data.id].mesh.position.y = game.planeDefaultHeight;
			
			scene.add(model.planes[data.id].mesh);
		}
		
		var plane = model.planes[data.id];
		
		// update name			
		plane.name = data.name;
		plane.status = data.status;
		plane.planeFallSpeed = data.planeFallSpeed;

		// update postion
		if(plane != model.userPlane){
			plane.targetY = data.targetY;
			plane.targetZ = data.targetZ;

			if((Math.abs(plane.mesh.position.x - data.posX) > 10 || Math.abs(plane.mesh.position.z - data.posZ) > 10) && plane.status == "playing"){
				plane.mesh.position.x = data.posX;
				plane.mesh.position.y = data.posY;
				plane.mesh.position.z = data.posZ;
			}
			//plane.mesh.rotation.x = data.rotX;
			//plane.mesh.rotation.y = data.rotY;
			//plane.mesh.rotation.z = data.rotZ;
		}
		
		plane.distance = data.distance;
			
		plane.timeSinceLastServerUpdate = 0;
	}
	
	// cache message
	this.messageHandler = function(data) {
		var plane = model.planes[data.id];
		if(!plane) {
			return;
		}
		plane.timeSinceLastServerUpdate = 0;
		messages.push(new Message('@' + plane.name +' said: ' + data.message, data.id));
	}
	
	// connect out 
	this.closedHandler = function(data) {
		if(model.planes[data.id]) {
			scene.remove(model.planes[data.id].mesh);
			delete model.planes[data.id];
		}
	}
	
	// redirect server
	this.redirectHandler = function(data) {
		if (data.url) {
			if (authWindow) {
				authWindow.document.location = data.url;
			} else {
				document.location = data.url;
			}			
		}
	}
	
	this.processMessage = function(data) {
		var fn = webSocketService[data.type + 'Handler'];
		if (fn) {
			fn(data);
		}
	}
	
	// disconnect message
	this.connectionClosed = function() {
		webSocketService.hasConnection = false;
		$('#cant-connect').fadeIn(300);
	};
	
	// send self
	this.sendUpdate = function(plane, targetY, targetZ) {
		var sendObj = {
			type: 'update',
			posX: plane.mesh.position.x,
			posY: plane.mesh.position.y,
			posZ: plane.mesh.position.z,
			//rotX: plane.mesh.rotation.x,
			//rotY: plane.mesh.rotation.y,
			//rotZ: plane.mesh.rotation.z,
			targetY: targetY,
			targetZ: targetZ,
			status: game.status,
			planeFallSpeed: game.planeFallSpeed,
			distance: game.distance,
		};
		
		if(plane.name) {
			sendObj['name'] = plane.name;
		}
		
		webSocket.send(JSON.stringify(sendObj));
	}
	
	// send message
	this.sendMessage = function(msg) {
		var regexp = /name: ?(.+)/i;
		if(regexp.test(msg)) {
			model.userPlane.name = msg.match(regexp)[1];
			nameValue.innerText = model.userPlane.name;
			$.cookie('user_name', model.userPlane.name, {expires:14});
			return;
		}
		
		var sendObj = {
			type: 'message',
			message: msg
		};
		
		webSocket.send(JSON.stringify(sendObj));
	}
	
	// token
	this.authorize = function(token,verifier) {
		var sendObj = {
			type: 'authorize',
			token: token,
			verifier: verifier
		};
		
		webSocket.send(JSON.stringify(sendObj));
	}
}