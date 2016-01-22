
$(document).ready(function() {
	$("#exec-line").click(execLine);
});


function execLine() {
	var currLine = editor.currLine();
	var currCode = editor.currCode();
	var currReg = machineCode.exec(currLine, currCode);
	$("#console").append(currReg);
	$("#console")[0].scrollTop = $("#console")[0].scrollHeight;
	var currMem = "Line " + currLine + ": " + "<br>" + memory.getValue() + "<br>";
	$("#memory").append(currMem);
	$("#memory")[0].scrollTop = $("#memory")[0].scrollHeight;
}