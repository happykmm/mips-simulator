

$(document).ready(function() {
	editor.init();
});


var editor = {
	mipsInit : " # digitCount(char* u) #\nadd $t0, $zero, $zero  #i=0\nadd $t1, $zero, $zero  #count=0\naddi $t3, $zero, 48    #'0'\naddi $t4, $zero, 57    #'9'\nadd $t2, $a0, $t0      #&u[i]\nlb  $t2, 0($t2)        #u[i]\nbeq $t2, $zero, 16     #跳出循环\nslt $t5, $t2, $t3      #u[i]<'0'?\nbne $t5, $zero, 14     #u[i]<'0'跳走\nslt $t5, $t4, $t2      #u[i]>'9'?\nbne $t5, $zero, 14     #u[i]>'9'跳走\naddi $t1, $t1, 1       #count++\naddi $t0, $t0, 1       #i++\nj 6\nadd $v0, $t1, $zero\njr $ra",
	mipsEditor : "" ,
	codeEditor : "" ,
	mipsFocus : false,
	codeFocus : false,

	init : function() {
		this.mipsEditor = ace.edit("mips");
		var mipsEditor = this.mipsEditor;
		mipsEditor.setTheme("ace/theme/textmate");
	    mipsEditor.getSession().setMode("ace/mode/text");
	    mipsEditor.$blockScrolling = Infinity;
		
		this.codeEditor = ace.edit("code");
		var codeEditor = this.codeEditor;
		codeEditor.setTheme("ace/theme/textmate");
		codeEditor.getSession().setMode("ace/mode/text");
		codeEditor.$blockScrolling = Infinity;

		mipsEditor.on("focus", function(e) { 
			editor.mipsFocus = true;
			editor.codeFocus = false;
			codeEditor.gotoLine(mipsEditor.selection.getCursor().row + 1);
		});
		/*mipsEditor.on("blur", function(e) {
			editor.mipsFocus = false;
		});*/
		codeEditor.on("focus", function(e) { 
			editor.mipsFocus = false;
			editor.codeFocus = true;
			mipsEditor.gotoLine(codeEditor.selection.getCursor().row + 1);
		});/*
		codeEditor.on("blur", function(e) {
			editor.codeFocus = false;
		});*/

		mipsEditor.getSession().on('change', function(e){
			if (editor.mipsFocus) {
			 	editor.mipsChange();
			}
		});
		codeEditor.getSession().on('change', function(e){
			if (editor.codeFocus) {
			 	editor.codeChange();
			}
		});

		mipsEditor.getSession().selection.on('changeCursor', function(e) {
			if (editor.mipsFocus)  {
			 	codeEditor.gotoLine(mipsEditor.selection.getCursor().row + 1);
			}
		});
		codeEditor.getSession().selection.on('changeCursor', function(e) {
			if (editor.codeFocus) {
				mipsEditor.gotoLine(codeEditor.selection.getCursor().row + 1);
			}
		});

		mipsEditor.focus();
		mipsEditor.setValue(this.mipsInit, {silent: true});
		mipsEditor.gotoLine(1);
	},

	mipsChange : function () {
		var mipsEditor = this.mipsEditor;
		var codeEditor = this.codeEditor;
		var mips = mipsEditor.getValue().split('\n');
		var code = mipsCommand.toCode(mips);
		codeEditor.setValue(code, {silent: true});
		
	},

	codeChange : function () {
		var mipsEditor = this.mipsEditor;
		var codeEditor = this.codeEditor;
		var code = codeEditor.getValue().split('\n');
		var mips = machineCode.toMips(code);
		mipsEditor.setValue(mips, {silent: true});
	},

	nextLine : function() {
		var mipsEditor = this.mipsEditor;
		var codeEditor = this.codeEditor;
		if (this.mipsFocus) {
			var total = mipsEditor.session.getLength();
			var curr = mipsEditor.selection.getCursor().row + 1;
			var next = curr + 1;
			if (next > total) next = 1;
			mipsEditor.gotoLine(next);
		} else {
			var total = codeEditor.session.getLength();;
			var curr = codeEditor.selection.getCursor().row + 1;
			var next = curr + 1;
			if (next > total) next = 1;
			codeEditor.gotoLine(next);
		}
	},

	jumpLine : function(target) {
		var mipsEditor = this.mipsEditor;
		var codeEditor = this.codeEditor;
		if (this.mipsFocus) {
			var total = mipsEditor.session.getLength();
			if (target > total)  return false;
			mipsEditor.gotoLine(target);
		} else {
			var total = codeEditor.session.getLength();;
			if (target > total)  return false;
			codeEditor.gotoLine(target);
		}
		return true;
	},

	currMips: function() {
		var mipsEditor = this.mipsEditor;
		var currLine = mipsEditor.selection.getCursor().row;
		return mipsEditor.session.getLine(currLine); 
	},

	currCode : function() {
		var codeEditor = this.codeEditor;
		var currLine = codeEditor.selection.getCursor().row;
		return codeEditor.session.getLine(currLine);  
	},

	currLine : function() {
		return this.codeEditor.selection.getCursor().row + 1;
	}
}

