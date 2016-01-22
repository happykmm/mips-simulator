

$(document).ready(function(){
	var value = memory.value;
	var i;
	for (i=0; i<value.length; i++) {
		if (Math.random() < 0.1)
			value[i] = 0;
		else
		if (Math.random() < 0.4)
			value[i] = 48 + Math.floor(Math.random() * 10);
		else
			value[i] = Math.floor(Math.random() * 256);
	}
});


var memory = {
	value : new Array(80),

	getValue : function() {
		var value = memory.value;
		var result = "";
		for (i=0; i<value.length; i++) {
			if (i%10 == 0) result += pad(i,2)+": ";
			result += pad(value[i].toString(16),2) + " ";
			if ((i+1)%10 == 0)  result += "<br>";
		}
		return result;
	}

}