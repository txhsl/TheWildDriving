var Message = function(msg, id) {
	var message = this;
	
	this.age = 1;
	this.maxAge = 300;
	
	this.message = msg;
	this.id = id;
	
	this.update = function() {
		this.age++;
	}
	
	this.draw = function(color) {
		var messageItem = document.createElement('li');
		messageItem.innerText = this.message;
		messageItem.style.color = (this.id == model.userPlane.id) ? ('#' + MainColors[0].toString(16)) : ('#' + MainColors[this.id % 4 + 1].toString(16));
		messageBox.appendChild(messageItem);
	}
}