
var isVisible = true;
// First hide show function
var x = 3;
var hideArray1 = new Array(x);
hideArray1[0]="agric1";
hideArray1[1]="agric2";
hideArray1[2]="agric3";
var iWantThisClosed = "open";

function HideRows1() {
	if (iWantThisClosed == "open")	
	{
		iWantThisClosed="closed";
		//for loop to 'hide' all of the specified rows
		for (i=0; i<x; i++) {
			document.getElementById(hideArray1[i]).style.display = 'none';
		}
	}
	else {
		for (i=0; i<x; i++) {
			document.getElementById(hideArray1[i]).style.display = '';
		}
		iWantThisClosed="open";
	}
}
// Secong hide show function
var x2 = 7;
var hideArray2 = new Array(x);
hideArray2[0]="extra1";
hideArray2[1]="extra2";
hideArray2[2]="extra3";
hideArray2[3]="extra4";
hideArray2[4]="extra5";
hideArray2[5]="extra6";
hideArray2[6]="extra7";
var iWantThisClosed2 = "open";
function HideRows2() {
	if (iWantThisClosed2 == "open")	
	{
		iWantThisClosed2="closed";
		//for loop to 'hide' all of the specified rows
		for (i=0; i<x2; i++) {
			document.getElementById(hideArray2[i]).style.display = 'none';
		}

	}
	else {
		for (i=0; i<x2; i++) {
			document.getElementById(hideArray2[i]).style.display = '';
		}
		iWantThisClosed2="open";
	}
}
//Third hide show function
var x3 = 23;
var hideArray3 = new Array(x);
hideArray3[0]="manuf0";
hideArray3[1]="manuf1";
hideArray3[2]="manuf2";
hideArray3[3]="manuf3";
hideArray3[4]="manuf4";
hideArray3[5]="manuf5";
hideArray3[6]="manuf6";
hideArray3[7]="manuf7";
hideArray3[8]="manuf8";
hideArray3[9]="manuf9";
hideArray3[10]="manuf10";
hideArray3[11]="manuf11";
hideArray3[12]="manuf12";
hideArray3[13]="manuf13";
hideArray3[14]="manuf14";
hideArray3[15]="manuf15";
hideArray3[16]="manuf16";
hideArray3[17]="manuf17";
hideArray3[18]="manuf18";
hideArray3[19]="manuf19";
hideArray3[20]="manuf20";
hideArray3[21]="manuf21";
hideArray3[22]="manuf22";
var iWantThisClosed3 = "open";
function HideRows3() {
	if (iWantThisClosed3 == "open")	
	{
		iWantThisClosed3="closed";
		//for loop to 'hide' all of the specified rows
		for (i=0; i<x3; i++) {
			document.getElementById(hideArray3[i]).style.display = 'none';
		}

	}
	else {
		for (i=0; i<x3; i++) {
			document.getElementById(hideArray3[i]).style.display = '';
		}
		iWantThisClosed3="open";
	}
}
// Fourth hide show function
var x4 = 35;
var hideArray4 = new Array(x);
hideArray4[0]="serv0";
hideArray4[1]="serv1";
hideArray4[2]="serv2";
hideArray4[3]="serv3";
hideArray4[4]="serv4";
hideArray4[5]="serv5";
hideArray4[6]="serv6";
hideArray4[7]="serv7";
hideArray4[8]="serv8";
hideArray4[9]="serv9";
hideArray4[10]="serv10";
hideArray4[11]="serv11";
hideArray4[12]="serv12";
hideArray4[13]="serv13";
hideArray4[14]="serv14";
hideArray4[15]="serv15";
hideArray4[16]="serv16";
hideArray4[17]="serv17";
hideArray4[18]="edu0";
hideArray4[19]="edu1";
hideArray4[20]="edu2";
hideArray4[21]="edu3";
hideArray4[22]="edu4";
hideArray4[23]="health0";
hideArray4[24]="health1";
hideArray4[25]="health2";
hideArray4[26]="health3";
hideArray4[27]="health4";
hideArray4[28]="health5";
hideArray4[29]="health6";
hideArray4[30]="other0";
hideArray4[31]="other1";
hideArray4[32]="other2";
hideArray4[33]="other3";
hideArray4[34]="other4";
var iWantThisClosed4 = "open";
function HideRows4() {
	if (iWantThisClosed4 == "open")	
	{
		iWantThisClosed4="closed";
		//for loop to 'hide' all of the specified rows
		for (i=0; i<x4; i++) {
			document.getElementById(hideArray4[i]).style.display = 'none';
		}

	}
	else {
		for (i=0; i<x4; i++) {
			document.getElementById(hideArray4[i]).style.display = '';
		}
		iWantThisClosed4="open";
	}
}

//close all function
function closeAllBits() {
HideRows1();
HideRows2();
HideRows3();
HideRows4();
}

document.write("<style type='text/css' media='screen'> input.tog {color:#006; background-color:#fff; width:18px; height:18px; padding:0; border: 1px solid #006; cursor:pointer;}</style>");

