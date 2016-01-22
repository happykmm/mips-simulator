var machineCode = {

	toMips : function(code) {
		var result = "";
		$.each(code, function(i, item) {
			var machine_code = item.replace(/[ ]+/g, "");
			var mips_command = "";
			if (machine_code.length != 32) {
				mips_command = "[error: length of machine code is not 32 bit]";
			} else {
				var opt = machine_code.substr(0, 6);
				var rs = register.num2name(machine_code.substr(6,5));
				var rt = register.num2name(machine_code.substr(11,5));
				var rd = register.num2name(machine_code.substr(16,5));
				var shamt = machine_code.substr(21,5);
				var func  = machine_code.substr(26,6);
				var imm   = parseInt(machine_code.substr(16,16),2).toString();
				var label = parseInt(machine_code.substr(16,16),2).toString();
				var target = parseInt(machine_code.substr(6,26),2).toString();
				switch (opt) {
					case "000000":         //R-type
						switch (func) {
							case "100000": //add
								mips_command = "add " + rd + ", " + rs + ", " + rt;
							    break;
							case "100010": //sub
								mips_command = "sub " + rd + ", " + rs + ", " + rt;
								break;
							case "101010": //slt
								mips_command = "slt " + rd + ", " + rs + ", " + rt;
								break;
							case "001000": //jr
								mips_command = "jr $ra";
								break;
						}
						break;
					case "001000": //addi rt, rs, imm
						mips_command = "addi " + rt + ", " + rs + ", " + imm;
						break;

					case "100011": //lw rt, imm(rs) 
						mips_command = "lw  " + rt + ", " + imm + "(" + rs + ")";
						break;
					case "100001": //lh rt, imm(rs) 
						mips_command = "lh  " + rt + ", " + imm + "(" + rs + ")";
						break;
					case "100000": //lb rt, imm(rs) 
						mips_command = "lb  " + rt + ", " + imm + "(" + rs + ")";
						break;

					case "101011": //sw rt, imm(rs)
						mips_command = "sw  " + rt + ", " + imm + "(" + rs + ")";
						break;
					case "101001": //sh rt, imm(rs)
						mips_command = "sh  " + rt + ", " + imm + "(" + rs + ")";
						break;
					case "101000": //sb rt, imm(rs)
						mips_command = "sb  " + rt + ", " + imm + "(" + rs + ")";
						break;


					case "000100": //beq rs, rt, label
						mips_command = "beq " + rs +", " + rt + ", " + label;
						break;
					case "000101": //bne rs, rt, label
						mips_command = "bne " + rs +", " + rt + ", " + label;
						break;
					case "000010": //j target
						mips_command = "j  " + target;
						break;
					case "000011": //jal target
						mips_command = "jal " + target;
				}
			}
			result += mips_command;
			if (i != code.length-1)
				result += "\n";
		});
		return result;
	},

	exec : function (line, code) {
		//console.log(code);
		code = code.replace(/[ ]+/g, "");
		var result = "Line " + line + ": ";
		if (code.length != 32) {
			result += "[error: length is not 32 bit]";
			editor.nextLine();
		} else {
			var opt = code.substr(0, 6);
			var rs = parseInt(code.substr(6,5), 2);
			var rt = parseInt(code.substr(11,5), 2);
			var rd = parseInt(code.substr(16,5), 2);
			var shamt = code.substr(21,5);
			var func  = code.substr(26,6);
			var imm   = parseInt(code.substr(16,16), 2);
			var label = parseInt(code.substr(16,16), 2);
			var target = parseInt(code.substr(6,26), 2);
			var jump = false;
			switch (opt) {
				case "000000":         //R-type
					switch (func) {
						case "100000": //add
							register.value[rd] = register.value[rs] + register.value[rt];
						    break;
						case "100010": //sub
							var tmp = register.value[rs] - register.value[rt];
							if (tmp < 0) 
								result += "[error: The difference is less than zero]";
							else
								register.value[rd] = tmp;
							break;
						case "101010": //slt
							if (register.value[rs] < register.value[rt])
								register.value[rd] = 1;
							else
								register.value[rd] = 0;
							break;
						case "001000": //jr
							var tmp = editor.jumpLine(register.value[31]);
							if (tmp == false) 
								result += "[error: target > total lines]";
							else
								jump = true;
							break;

					}
					break;
				case "001000": //addi rt, rs, imm
					register.value[rt] = register.value[rs] + imm;
					break;
				case "100011": //lw rt, imm(rs) 
					var tmp = register.value[rs] + imm;
					var mem = memory.value;
					if (tmp+3 > mem.length-1)
						result += "[error: Memory overflow! max:"+(mem.length-1)+"]";
					else {
						var rlt = mem[tmp];
						rlt <<= 8;
						rlt += mem[tmp+1];
						rlt <<= 8;
						rlt += mem[tmp+2];
						rlt <<= 8;
						rlt += mem[tmp+3];
					}
					register.value[rt] = rlt;
					break;
				case "100001": //lh rt, imm(rs)
					var tmp = register.value[rs] + imm;
					var mem = memory.value;
					if (tmp+1 > mem.length-1)
						result += "[error: Memory overflow! max:"+(mem.length-1)+"]";
					else {
						var rlt = mem[tmp];
						rlt <<= 8;
						rlt += mem[tmp+1];
					}
					register.value[rt] = rlt;
					break;
				case "100000": //lb rt, imm(rs)
					var tmp = register.value[rs] + imm;
					var mem = memory.value;
					if (tmp > mem.length-1)
						result += "[error: Memory overflow! max:"+(mem.length-1)+"]";
					else {
						var rlt = mem[tmp];
					}
					register.value[rt] = rlt;
					break;
				case "101011": //sw rt, imm(rs)
					var tmp = register.value[rs] + imm;
					var mem = memory.value;
					if (tmp+3 > mem.length-1)
						result += "[error: Memory overflow! max:"+(mem.length-1)+"]";
					else {
						var bit32 = register.value[rt];
						mem[tmp+3] = bit32 & 0xff;
						bit32 >>= 8;
						mem[tmp+2] = bit32 & 0xff;
						bit32 >>= 8;
						mem[tmp+1] = bit32 & 0xff;
						bit32 >>= 8;
						mem[tmp] = bit32 & 0xff;
					}
					break;
				case "101001": //sh rt, imm(rs)
					var tmp = register.value[rs] + imm;
					var mem = memory.value;
					if (tmp+1 > mem.length-1)
						result += "[error: Memory overflow! max:"+(mem.length-1)+"]";
					else {
						var bit32 = register.value[rt];
						mem[tmp+1] = bit32 & 0xff;
						bit32 >>= 8;
						mem[tmp] = bit32 & 0xff;
					}
					break;
				case "101000": //sb rt, imm(rs)
					var tmp = register.value[rs] + imm;
					var mem = memory.value;
					if (tmp > mem.length-1)
						result += "[error: Memory overflow! max:"+(mem.length-1)+"]";
					else {
						var bit32 = register.value[rt];
						mem[tmp] = bit32 & 0xff;
					}
					break;
				case "000100": //beq rs, rt, label
					if (register.value[rs] == register.value[rt]) {
						var tmp = editor.jumpLine(label);
						if (tmp == false) 
							result += "[error: lable > total lines]";
						else
							jump = true;
					}
					break;
				case "000101": //bne rs, rt, label
					if (register.value[rs] != register.value[rt]) {
						var tmp = editor.jumpLine(label);
						if (tmp == false) 
							result += "[error: lable > total lines]";
						else
							jump = true;
					}
					break;
				case "000010": //j target
					var tmp = editor.jumpLine(target);
					if (tmp == false) 
						result += "[error: target > total lines]";
					else
						jump = true;
					break;
				case "000011": //jal target
					register.value[31] = line+1;
					var tmp = editor.jumpLine(target);
					if (tmp == false) 
						result += "[error: target > total lines]";
					else
						jump = true;
					break;
				default:
					result += "[error: No such command]";
					break;
			}
			if (jump == false)
				editor.nextLine();
			result += "<br>" + register.getValue();
		}
		return result + "<br><br>";
	}
}


