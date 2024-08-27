// JavaScript Document
window.loadadvanced = function (e){
	if (document.is.supported) {
			initializeTicker(gbi("subnav100"),"Latest: ", "ticker", "... ", 50, 3500, "subnavticker");
			initializeStripedTables();
			countdowninit();
			sortables_init();		
	}
}

/********** Table Striping Start *************/
var stripe = "stripe";
var stripePattern = stripe+" *?\\(([^\"]*?)\\)";

function initializeStripedTables () {for (var aT = gbn("TABLE"), i=0; i<aT.length; i++) if (aT[i].className.indexOf (stripe)>-1) stripeinit(aT[i]);}

function stripeinit (aT){
	var stripeArr = aT.className.match (stripePattern);
	if (stripeArr.length==2){ // carry on - [0] = "stripe (class)", [1] = "class"
		aT.stripeable = true;			
		var stripeClass = stripeArr [1];
		
		if (aT.sorted != null){ 
			loopTable (aT, function (a,b) {
				a.stripe=a.className?a.className+' '+stripeClass:stripeClass;a.noStripe=a.className?a.className:'';
				if (b){a.className = a.className? a.className+' '+stripeClass:stripeClass }
			});		
			aT.stripe = function () {loopTable (aT, function (a,b) {a.className = b?a.stripe:a.noStripe;})};
		} else {
		 	// no messing here, because it is basically static, just update the class name.
			loopTable (aT, function (a,b) {if (b){a.className = a.className? a.className+' '+stripeClass:stripeClass }});				
		}
	}
}

function loopTable (aTable, fn){
	for (var j=0, tr = aTable.getElementsByTagName ("tbody")?aTable.getElementsByTagName ("tbody") [0].firstChild:aTable.firstChild ; tr ; tr = tr.nextSibling ) { 
		if (tr.tagName == 'TR'){ 
			j++; var on= (j%2==0);  
			for (var td, i=0, tds=tr.getElementsByTagName("TD"); i<tds.length, td=tds[i]; i++) fn (td, on);
		}
	}	
}
/********** Table Striping End *************/


/********** Table Sorter Start *************/
//addEvent(window, "load", );
var SORT_COLUMN_INDEX;

function sortables_init() {
    // Find all tables with class sortable and make them sortable
    if (!document.getElementsByTagName) return;
    tbls = document.getElementsByTagName("table");
    for (ti=0;ti<tbls.length;ti++) {
        thisTbl = tbls[ti];
        if (((' '+thisTbl.className+' ').indexOf("tablesortable") != -1) && (thisTbl.id)) {
            //initTable(thisTbl.id);
            ts_makeSortable(thisTbl);
        }
    }
}

function ts_makeSortable(table) {
    if (table.rows && table.rows.length > 0) {
        var firstRow = table.rows[0];
    }
    if (!firstRow) return;
    
    // We have a first row: assume it's the header, and make its contents clickable links
    for (var i=0;i<firstRow.cells.length;i++) {
        var cell = firstRow.cells[i];
        var txt = ts_getInnerText(cell);
        cell.innerHTML = '<a href="#" class="sortheader" '+ 
        'onclick="ts_resortTable(this, '+i+');return false;" title="click to sort">' + 
        txt+'<span class="sortarrow">&nbsp;&nbsp;&larr;</span></a>';
    }
}

function ts_getInnerText(el) {
	if (typeof el == "string") return el;
	if (typeof el == "undefined") { return el };
	if (el.innerText) return el.innerText;	//Not needed but it is faster
	var str = "";
	
	var cs = el.childNodes;
	var l = cs.length;
	for (var i = 0; i < l; i++) {
		switch (cs[i].nodeType) {
			case 1: //ELEMENT_NODE
				str += ts_getInnerText(cs[i]);
				break;
			case 3:	//TEXT_NODE
				str += cs[i].nodeValue;
				break;
		}
	}
	return str;
}

function ts_resortTable(lnk,clid) {
    // get the span
    var span;
    for (var ci=0;ci<lnk.childNodes.length;ci++) {
        if (lnk.childNodes[ci].tagName && lnk.childNodes[ci].tagName.toLowerCase() == 'span') span = lnk.childNodes[ci];
    }
    var spantext = ts_getInnerText(span);
    var td = lnk.parentNode;
    var column = clid || td.cellIndex;
    var table = getParent(td,'TABLE');
    
    // Work out a type for the column
    if (table.rows.length <= 1) return;
    var itm = ts_getInnerText(table.rows[1].cells[column]);
    sortfn = ts_sort_caseinsensitive;
    if (itm.match(/^\d\d[\/-]\d\d[\/-]\d\d\d\d$/)) sortfn = ts_sort_date;
    if (itm.match(/^\d\d[\/-]\d\d[\/-]\d\d$/)) sortfn = ts_sort_date;
    if (itm.match(/^[£$]/)) sortfn = ts_sort_currency;
    if (itm.match(/^[\d\.]+$/)) sortfn = ts_sort_numeric;
    SORT_COLUMN_INDEX = column;
    var firstRow = new Array();
    var newRows = new Array();
    for (i=0;i<table.rows[0].length;i++) { firstRow[i] = table.rows[0][i]; }
    for (j=1;j<table.rows.length;j++) { newRows[j-1] = table.rows[j]; }

    newRows.sort(sortfn);

    if (span.getAttribute("sortdir") == 'down') {
		//if sorted up display
        ARROW = '&nbsp;&nbsp;&uarr;';
        newRows.reverse();
        span.setAttribute('sortdir','up');
    } else {
		//if sorted down display
        ARROW = '&nbsp;&nbsp;&darr;';
        span.setAttribute('sortdir','down');
    }
    
    // We appendChild rows that already exist to the tbody, so it moves them rather than creating new ones
    // don't do sortbottom rows
    for (i=0;i<newRows.length;i++) { if (!newRows[i].className || (newRows[i].className && (newRows[i].className.indexOf('sortbottom') == -1))) table.tBodies[0].appendChild(newRows[i]);}
    // do sortbottom rows only
    for (i=0;i<newRows.length;i++) { if (newRows[i].className && (newRows[i].className.indexOf('sortbottom') != -1)) table.tBodies[0].appendChild(newRows[i]);}
    
    // Delete any other arrows there may be showing
    var allspans = document.getElementsByTagName("span");
    for (var ci=0;ci<allspans.length;ci++) {
        if (allspans[ci].className == 'sortarrow') {
            if (getParent(allspans[ci],"table") == getParent(lnk,"table")) { // in the same table as us?
                //adds in next to link if not sorted by
				allspans[ci].innerHTML = '&nbsp;&nbsp;&larr;';
            }
        }
    }
        
    span.innerHTML = ARROW;
}

function getParent(el, pTagName) {
	if (el == null) return null;
	else if (el.nodeType == 1 && el.tagName.toLowerCase() == pTagName.toLowerCase())	// Gecko bug, supposed to be uppercase
		return el;
	else
		return getParent(el.parentNode, pTagName);
}
function ts_sort_date(a,b) {
    // y2k notes: two digit years less than 50 are treated as 20XX, greater than 50 are treated as 19XX
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]);
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]);
    if (aa.length == 10) {
        dt1 = aa.substr(6,4)+aa.substr(3,2)+aa.substr(0,2);
    } else {
        yr = aa.substr(6,2);
        if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
        dt1 = yr+aa.substr(3,2)+aa.substr(0,2);
    }
    if (bb.length == 10) {
        dt2 = bb.substr(6,4)+bb.substr(3,2)+bb.substr(0,2);
    } else {
        yr = bb.substr(6,2);
        if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
        dt2 = yr+bb.substr(3,2)+bb.substr(0,2);
    }
    if (dt1==dt2) return 0;
    if (dt1<dt2) return -1;
    return 1;
}

function ts_sort_currency(a,b) { 
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]).replace(/[^0-9.]/g,'');
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]).replace(/[^0-9.]/g,'');
    return parseFloat(aa) - parseFloat(bb);
}

function ts_sort_numeric(a,b) { 
    aa = parseFloat(ts_getInnerText(a.cells[SORT_COLUMN_INDEX]));
    if (isNaN(aa)) aa = 0;
    bb = parseFloat(ts_getInnerText(b.cells[SORT_COLUMN_INDEX])); 
    if (isNaN(bb)) bb = 0;
    return aa-bb;
}

function ts_sort_caseinsensitive(a,b) {
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]).toLowerCase();
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]).toLowerCase();
    if (aa==bb) return 0;
    if (aa<bb) return -1;
    return 1;
}

function ts_sort_default(a,b) {
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]);
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]);
    if (aa==bb) return 0;
    if (aa<bb) return -1;
    return 1;
}


function addEvent(elm, evType, fn, useCapture)
// addEvent and removeEvent
// cross-browser event handling for IE5+,  NS6 and Mozilla
// By Scott Andrew
{
  if (elm.addEventListener){
    elm.addEventListener(evType, fn, useCapture);
    return true;
  } else if (elm.attachEvent){
    var r = elm.attachEvent("on"+evType, fn);
    return r;
  } else {
    alert("Handler could not be removed");
  }
} 
/********** Table Sorter End *************/

/********** COUNTDOWN *************/
var countdownStr = "countdown";
var countdownPattern = countdownStr+" *?\\(([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([012])(,([^\\)]*?))?\\)";
function countdowninit (){var al = gbn ("*"); for (var i=0; i<al.length; i++) {if (al[i].className){ if(al[i].className.indexOf (countdownStr)>-1) cdc (al[i]);}}}
function cdc (aNode) {var cargs = aNode.className.match (countdownPattern);
	if (cargs) {var cls="";	if (!aNode.id) aNode.id = "cd"+Math.ceil(Math.random()*1000);if (cargs.length==9 && cargs[8]) cls=cargs[8];
		countdownstart (aNode.id, Math.abs(cargs[1]) , 0+cargs[2], cargs[3], cargs[4], cargs[5], Math.abs(cargs[6]), cls);		
	}	else {alert ("Invalid countdown timer arguments were given: \n\nuse the syntax: class=\"style1 countdown(yy,mm,dd,hh,min,format[,style2])\" \n\nFormat:\n0 - seconds only [25828 seconds]\n1 - Full format [0 days 7 hours 10 minutes 28 seconds]\n2- Full format, hides zero terms [7 hours 10 minutes 28 seconds]");}
}

function countdownstart (id, yy , m , d , h , mn , frmt , as){
	var now, tl, tg, t = gbi(id); now = (new Date()).getTime(); // now
	if (yy<2000) yy+=2000;		
	tg = (new Date(yy, m-1, d, h, mn, 00)).getTime();				 
	if(tg<=now) {t.style.visibility = "hidden";} else {
		t.targetDate = tg;
		t.originalText = t.innerHTML;
		if (as){ t.aStyle = as; t.oStyle = t.className; t.tick = function (){ this.className==this.aStyle?this.className=this.oStyle:this.className=this.aStyle; }} else {t.tick = function (){}}
		t.set = function (str) { this.innerHTML = this.originalText + str; }
		switch(frmt){
		case 0: t.show = function (tl) { this.set (tl + ' seconds'); t.tick();};break;
		case 1: t.show = function (tl) {var ds, hs, ms, ss;
			ds = Math.floor(tl / (60 * 60 * 24)); tl %= (60 * 60 * 24); hs = Math.floor(tl / (60 * 60)); tl %= (60 * 60); ms = Math.floor(tl / 60); tl %= 60; ss = tl;
			ds == 1?dps = '1 day ':    dps =ds + ' days '; hs == 1?hps = '1 hour ':   hps =hs + ' hours '; ms == 1?mps = '1 minute ': mps =ms + ' minutes '; ss == 1?sps = '1 second':  sps =ss + ' seconds';                    
			this.set ( dps + hps +  mps +  sps);
			this.tick();
		}; break;
		case 2: t.show = function (tl) {var ds, hs, ms, ss; 
			ds = Math.floor(tl / (60 * 60 * 24)); tl %= (60 * 60 * 24); hs = Math.floor(tl / (60 * 60)); tl %= (60 * 60); ms = Math.floor(tl / 60); tl %= 60;ss = tl;									
			ds == 0? dps="": ds == 1?dps = '1 day ':    dps =ds + ' days '; hs == 0? hps="": hs == 1?hps = '1 hour ':   hps =hs + ' hours '; ms == 0? mps="": ms == 1?mps = '1 minute ': mps =ms + ' minutes '; ss == 0? sps="": ss == 1?sps = '1 second':  sps =ss + ' seconds';                    
			this.set ( dps + hps +  mps +  sps);
			this.tick();
		}; break;
		default: t.show = function (tl) { this.set (tl + ' seconds');  t.tick();} 
		}

		t.next = function (){var now, tl; now = (new Date()).getTime(); tl = Math.round((this.targetDate - now) / 1000);
			if(tl<= 0){setTimeout ("document.location = '"+document.location+"'", 2000);} else { this.show (tl);}
			this.timer = setTimeout("document.countdowns['"+this.id+"'].next()", 1000);}
		t.stop = function () { clearTimeout (this.timer); }
	
		if (!document.countdowns) document.countdowns = new Array(); document.countdowns [id] = t; t.next ();
	}
}

/* TICKER */
function initializeTicker (con, leadString, aClass, suffix, charDelay, storyDelay, tlid){
if (con){ if (con.getElementsByTagName("UL").length>0){
var list = con.getElementsByTagName ("UL") [0]; if (list.className == aClass) {		
list.style.display='none'; 
var tl = document.createElement("a"); tl.setAttribute("id",tlid); tl.chartime = charDelay; tl.pausetime = storyDelay; tl.stories = new Array ();					
for (var i=0, li=list.firstChild; li; li=li.nextSibling){if (li.firstChild) tl.stories [i++] = new story (li.firstChild.innerHTML+suffix,li.firstChild.href);}

var wrap = document.createElement ("p");
wrap.className = aClass; wrap.appendChild(document.createTextNode(leadString)); wrap.appendChild (tl); 
con.appendChild (wrap); removeAllChildren (list); 					

tl.tick = function (id, c) {
if (c==0) { removeAllChildren(this); this.setAttribute("href", this.stories[id].href); /*new story*/} 
this.appendChild(document.createTextNode(this.stories[id].text.substring(c,++c))); /*new character displayed*/
var callid = id, callc = c, timeout=this.chartime; /* next call worked out*/
if(c >= this.stories[id].text.length) { callid = (id >= this.stories.length-1)?0:++id; callc=0;timeout=this.pausetime;} /* pause between stories */
setTimeout ("document.tickers ['"+this.id+"'].tick("+callid+","+callc+")",timeout); /*doc.tickers - much more efficient than gbi*/
}

if (!document.tickers) { document.tickers = new Array(); }
document.tickers [tlid] = tl;
tl.tick(0,0);
}}}}
function story(text, href) { this.text = text; this.href = href; }	
function removeAllChildren ( node ) { if (node) {while ( node.hasChildNodes() ) { node.removeChild ( node.lastChild );	}}	}