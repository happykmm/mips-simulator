var mipsCommand = {

    mips_command : "",
    machine_code : "",


	toCode : function (mips) {
		var result = "";
		$.each(mips, function(i, item) {
			mipsCommand.mips_command = item.toLowerCase().split(/[, ]+/) ;
			mipsCommand.machine_code = "";
			switch (mipsCommand.mips_command[0]) {
				case "add": 
					mipsCommand.machine_code = "000000,rs,rt,rd,00000,100000";
					mipsCommand.rType();
					break;
				case "sub":
					mipsCommand.machine_code = "000000,rs,rt,rd,00000,100010";
					mipsCommand.rType();
					break;
				case "slt":
					mipsCommand.machine_code = "000000,rs,rt,rd,00000,101010";
					mipsCommand.rType();
					break;

				case "lw":
					mipsCommand.machine_code = "100011,rs,rt,imm";
					mipsCommand.iType();
					break;
				case "lh":
					mipsCommand.machine_code = "100001,rs,rt,imm";
					mipsCommand.iType();
					break;
				case "lb":
					mipsCommand.machine_code = "100000,rs,rt,imm";
					mipsCommand.iType();
					break;

				case "sw":
					mipsCommand.machine_code = "101011,rs,rt,imm";
					mipsCommand.iType();
					break;
				case "sh":
					mipsCommand.machine_code = "101001,rs,rt,imm";
					mipsCommand.iType();
					break;
				case "sb":
					mipsCommand.machine_code = "101000,rs,rt,imm";
					mipsCommand.iType();
					break;

				case "beq":
					mipsCommand.machine_code = "000100,rs,rt,imm";
					mipsCommand.beq();
					break;
				case "bne":
					mipsCommand.machine_code = "000101,rs,rt,imm";
					mipsCommand.beq();
					break;
				case "addi":
					mipsCommand.machine_code = "001000,rs,rt,imm";
					mipsCommand.addi();
					break;
				case "j":
					mipsCommand.machine_code = "000010,imm";
					mipsCommand.jType();
					break;
				case "jal":
					mipsCommand.machine_code = "000011,imm";
					mipsCommand.jType();
					break;
				case "jr":
					mipsCommand.machine_code = "000000,11111,00000,00000,00000,001000";
					break;
				case "":
					mipsCommand.machine_code = "";
					break;
				default:
					mipsCommand.machine_code = "error";
					break;
			}
			mipsCommand.machine_code = mipsCommand.machine_code.replace(/\,/g , " ");
			result += mipsCommand.machine_code;
			if (i != mips.length-1)
				result += "\n";
			
		});
		return result;
	},

	rType : function () {
		this.reg("rd", this.mips_command[1]);
		this.reg("rs", this.mips_command[2]);
		this.reg("rt", this.mips_command[3]);
		this.len(4);
	},

	beq : function () {
		this.reg("rs", this.mips_command[1]);
		this.reg("rt", this.mips_command[2]);
		this.imm(this.mips_command[3], 16);
		this.len(4);
	},

	addi : function () {
		this.reg("rt", this.mips_command[1]);
		this.reg("rs", this.mips_command[2]);
		this.imm(this.mips_command[3], 16);
		this.len(4);
	},

	iType : function () {
		this.reg("rt", this.mips_command[1]);
		if (!(this.mips_command[2] == undefined || this.mips_command[2] == "")) {
			var rs  = this.mips_command[2].replace(/.*\(/, "").replace(/\)/g, "");
			var imm = this.mips_command[2].replace(/\(.*\)/g, "");
			this.reg("rs", rs);
			this.imm(imm, 16);
			this.len(3);
		}
	},

	jType : function () {
		this.imm(this.mips_command[1], 26);
		this.len(2);
	},

	reg : function (rx, register_name) {
		var register_num = register.name2num(register_name);
		if (register_num)
			this.machine_code = this.machine_code.replace(rx, register_num);
	},

	imm : function (imm, maxlen) {
		if (imm==undefined || imm=="")	return;
		imm = parseInt(imm).toString(2);
		if (imm == "NaN")
			imm = "[error: Imm is NaN]";
		else 
		if (imm.length > maxlen)
			imm = "[error: Imm too large]";
		else 
			while (imm.length < maxlen)
				imm = "0" + imm;
		this.machine_code = this.machine_code.replace("imm",imm);
	},

	len : function (maxlen) {
		if (this.mips_command.length > maxlen) 
			if (this.mips_command[maxlen][0] != "#")
				this.machine_code += " [error: Extra characters]";
	}


}






