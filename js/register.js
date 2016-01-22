$(document).ready(function(){
	var i;
	for (i=0; i<32; i++) {
		register.value[i] = 0;
	}
	register.value[29] = memory.value.length-1; //sp
	register.value[31] = 1;                     //ra
});

var register = {
	
	table : { "$zero":"00000", "$at":"00001", "$v0":"00010", "$v1":"00011",
			 "$a0":"00100", "$a1":"00101", "$a2":"00110", "$a3":"00111",
			 "$t0":"01000", "$t1":"01001", "$t2":"01010", "$t3":"01011",
			 "$t4":"01100", "$t5":"01101", "$t6":"01110", "$t7":"01111",
			 "$s0":"10000", "$s1":"10001", "$s2":"10010", "$s3":"10011",
			 "$s4":"10100", "$s5":"10101", "$s6":"10110", "$s7":"10111",
			 "$t8":"11000", "$t9":"11001", "$k0":"11010", "$k1":"11011",
			 "$gp":"11100", "$sp":"11101", "$fp":"11110", "$ra":"11111"},

	value : new Array(32),

	getValue :function () {
		var result = "";
		$.each(this.table, function(name, num){
			num = parseInt(num,2);
			if (isNaN(register.value[num])) {
				register.value[num] = 0;
			}
			var tmp = register.value[num].toString(16);
			//tmp = tmp.replace("-", "1");
			//console.log(tmp);
			while (tmp.length < 8)  tmp = "0" + tmp;
			tmp = name + "=" + tmp + "  ";
			result += tmp;
		});
		return result;
	},

	name2num : function (name) {
		if (name == undefined || name == "")
			return false;
		var json = register.table;
		if (json[name] == undefined) 
			return "[error: Invalid register name]";
		else
			return json[name];
	},

	num2name : function (num) {
		var json = register.table;
		var result = false;
		$.each(json, function(key, value){
			//console.log(value == num);
			if (value == num)  {
				result = key;
			}
		});
		if (result === false)
			return "[error: Invalid register num]";
		else
			return result;
	}


}




