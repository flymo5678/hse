// site specific variables
document.sitePatterns = Array  ('^http://[^\.]*?\.hse\.gov\.uk','^file:///','^http://intranet');
document.siteExclusions = Array('mailto:','.*\.(pdf|PDF)$','.*\.(xls|XLS)$');
// functions
window.onload = function (e){
	document.is = new Is();
	if (document.is.supported) {
			initializecss();	initializeTree();			linkCheck();
			if (document.forms) { initializeOnFocusRules(); cssInputSelector (true) }			
			hidenoscript("hide"); realImages('printbanner', 'realbanner');
			if (window.loadadvanced) window.loadadvanced();		
	}
}
window.onunload = function(e) {	persistcss (); }

/*ON FOCUS RULES*/
function initializeOnFocusRules (){ iOfr ("INPUT", function (a) {return a.type=="text"}); iOfr ("TEXTAREA", function (a) {return true})}
function iOfr (a, f){var k,i = gbn (a); for (var j=0; j<i.length, k = i[j]; j++) {if (f(k) && k.className.indexOf('noclear')==-1){k.old = k.value;k.onfocus = function (e){ this.value = (this.value == this.old)?"":this.value }}}}

/*CSS INPUT SELECTOR*/
function cssInputSelector (override){ var k,i = gbn ("INPUT"); for (var j=0; j<i.length, k = i[j]; j++) {if (k.form && k.form.className.length>0 && (k.className.length==0 || override)){k.className+=" "+k.form.className+k.type; }}}

/*NAVIGATION*/
function initializeTree() {var leftcol = gbi("colleft"); if (leftcol) {	treeX (leftcol, false, '_'); var at = highlight (leftcol, 'selected', function (h) {return h.parentNode}); reveal (at); if (at) {if (at.parentNode.tagName == "DIV"){liveNode (at.parentNode)}; marknav(gbi('colmiddle'),at.href); if (gbi('colright'))marknav(gbi('colright'),at.href);}}}
function treeX(c, nested, idSd) {if (!c.id) c.id = idSd; var tmp = c.firstChild; var counter=0;	while (tmp) {if(tmp.tagName){if(tmp.tagName == "UL"){if (nested) {tmp.id = tmp.id?tmp.id:(c.id+'t');tmp.tctrl = (c.id+'c');	wlinkc (tmp.tctrl, tmp.id);	addPriLinkDiv(tmp); colX (tmp);} treeX (tmp,true, idSd+(counter++));} else if (tmp.tagName == "LI"){treeX (tmp,true, idSd+(counter++));	}} tmp = tmp.nextSibling;}}
function wlink (aTa, listTa, hrefStr, css, alt) {var linktext  = "<img src='/images/spacer.gif' width='16' height='16' alt='"+alt+"' />"; var aTag = gbi (aTa); var listTag = gbi (listTa); if (!aTag){aTag = makeLink (linktext, true, hrefStr, aTa, "dropArrow");if (listTag){listTag.parentNode.insertBefore(aTag,listTag.parentNode.firstChild);} else {alert ("couldn't find the list!");}}else {aTag.href = hrefStr; aTag.innerHTML = linktext;}	listTag.parentNode.className=css;return aTag;}
function addPriLinkDiv (id) {var g = document.createElement("DIV");	r=id.parentNode.firstChild;	id.parentNode.insertBefore(g, r); g=id.parentNode.firstChild; h=g.nextSibling; i=h.nextSibling;	i.className="dropText";	g.appendChild(h); g.appendChild(i);}
document.cbpClass = "selectCollapsed";
document.ebpClass = "selectExpanded";
function wlinke (aTa, listTa) {var expandStr = "javascript:cbr('"+aTa+"','"+listTa+"');"; return wlink (aTa, listTa, expandStr, document.ebpClass, "click to close");}
function wlinkc (aTa, listTa) {var collapseStr = "javascript:ebr('"+aTa+"','"+listTa+"');"; return wlink (aTa, listTa, collapseStr, document.cbpClass, "click to expand");}
function cbr (aTa, listTa){var l = gbi (listTa); col1 (l); wlinkc (aTa, listTa);}	
function ebr (aTa, listTa){var l = gbi (listTa); exp1(l); wlinke (aTa, listTa);}	
function findParent (s) {while (s && !(s.tctrl)) {s = s.parentNode;}; return s; }
function colX (p){var tmp = p.getElementsByTagName ("LI");	for (var i=0; i<tmp.length; i++){tmp[i].style.display = 'none';	}}
function exp1 (p){var tmp = p.firstChild; while (tmp){cstyle (tmp,'block'); tmp = tmp.nextSibling; }}
function col1 (p){var tmp = p.firstChild; while (tmp){cstyle (tmp,'none'); tmp = tmp.nextSibling;}}
function liveNode (tmp) {if (tmp && tmp.parentNode){var c = tmp.parentNode.firstChild;while (c){if (c.tctrl){ebr (c.tctrl, c.id);}c = c.nextSibling;}}}
function reveal (s){var tmp = findParent (s); if (tmp) {ebr (tmp.tctrl, tmp.id); reveal (tmp.parentNode); }}
function cstyle (o,s){ if (o.style){ if (o.style.display){ o.style.display = s; }}}
function highlight (obj, nc, fn){var li = highlightLink (obj, nc, fn, cleanURL (document.location.href));if (!li) {var bk = getBK();if (bk){li = highlightLink (obj, nc, fn, bk);if (li){li = addLink(fn,li)}}} if (!li) {li = highlightLink(obj, nc, fn, decode64(readSessionData('hseid')))};	if (!li) {li = highlightLink(obj, nc, fn, document.referrer) };	return li;	}
function highlightLink (obj, nc, fn, href) {var l = obj.getElementsByTagName ("A");	for (var i=0; i<l.length; i++) {if (cleanURL (l[i].href) == href) {	fn (l[i]).className = nc; return l[i];}}return false;}
function marknav (obj, href){writeSessionData ('hseid', encode64(cleanURL(href)))}
function chooseToAppend (testLink , mustmatchArr, dontmatchArr, testArr){ var mustmatchresult = false;	 for (var h=0; h<mustmatchArr.length; h++){if (testLink.match (mustmatchArr[h])) mustmatchresult = true;} if (mustmatchresult){		for (var i=0; i<dontmatchArr.length; i++){if (testLink.match (dontmatchArr[i])) return false;}  		for (var j=0; j<testArr.length; j++) {if (testLink == testArr[j]) return false;} } else {		return false;}		return true;}
function getBK (){var r;for(var a,i=0; (a = gbn("link")[i]); i++) {if(a.getAttribute("rel").indexOf("bookmark") != -1 && a.getAttribute("title")=='navigation') {r=a.getAttribute("href");}};return r;}
function addLink (fn, al) {var el = fn (al);el.innerHTML+="<ul><li class='selected'><a href='#skip'>"+gbi("colmiddle").getElementsByTagName ('h1')[0].innerText+"</a></li></ul>"; return el.getElementsByTagName ('A')[1];}
/* CSS */
function initializecss (){ var c = readSessionData("style"); if (c != null) {  setActivecss(c, readSessionData("href")); }}
function persistcss (){ var c = readSessionData("style"); if (c) {var title = getActivecss(); writeActivecss (title);}}
function writeActivecss (t, h) { writeSessionData("style", t, 365); if (h) { writeSessionData("href", h, 365); } }
function clearAlternatecss (){ setActivecss("",""); clearCookie (["style","href"]); window.unload = ""; }
function setActivecss(title, href) {  var i, a, main, setSheet = false;  for(i=0; (a = gbn("link")[i]); i++) {	if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) { a.disabled = true; 	if(a.getAttribute("title") == title) { a.disabled = false; writeActivecss (title); setSheet = true; } }  if (!setSheet && href && title){ var hd = gbn("HEAD") [0], l = document.createElement ("LINK"); l.setAttribute ("rel","alternate stylesheet"); l.setAttribute ("href",href); l.setAttribute ("title",title);		hd.appendChild(l); writeActivecss (title, href);} } return void 0;}
function getActivecss() {var i, a; for(i=0; (a = gbn("link")[i]); i++) { if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled) return a.getAttribute("title");}  return null;}
function getPreferredcss() {var i, a; for(i=0; (a = gbn("link")[i]); i++) { if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("rel").indexOf("alt") == -1 && a.getAttribute("title")) return a.getAttribute("title");  }  return null;}
/********** UTILS *************/
function hidenoscript (aClass) {var al = gbn ("*"); for (var i=0; i<al.length; i++) {if (al[i].className){ if(al[i].className.indexOf ("noscript")>-1) al[i].className = aClass;}}}
function classSwap (startClass, endClass, obj) {var al = obj.getByTagName("*"); for (var i=0; i<al.length; i++) {if (al[i].className){ if(al[i].className.indexOf (startClass)>-1) al[i].className = endClass;}}}
function realImages (id, subsClas) { var el = gbi (id);	if (el){ if (el.tagName == "IMG") {	makeRealImage (el, subsClas);} else {var imgs = el.getElementsByTagName ("IMG"); for (var i=0; i<imgs.length; i++) { makeRealImage (imgs[i],subsClas); }}}}

// redirect function

function reDirect(linkAddress) {
  var t=setTimeout('location.href="'+linkAddress+'"', 5000);
}
function linkCheck(){ 
	var arr = new Array(); 
	var elems = document.getElementsByTagName("a");
	for ( var cls, i = 0; ( elem = elems[i] ); i++ ){
		if ( elem.className == "linkredirect" ){
			arr[arr.length] = elem;
		}
	}
	if (arr != '') {
		reDirect(arr[0]);	
	}
}




// New Rule to fix Script for Safari Thanks to Dave Collier
function makeRealImage (imgel, swClass) {
var r=0;
var csspath, rulObj, rul;
var looking=1;
if (document.styleSheets){
		 for (var i=0; i<document.styleSheets.length ; i++) {
		 		 if(looking){
		 		 		 var strRul = "";
		 		 		 var styl = document.styleSheets[i];
		 		 		 styl.cssRules?rulObj=styl.cssRules:rulObj=styl.rules;
		 		 		 for ( var j=0; j<rulObj.length; j++) {
		 		 		 		 if(looking){
		 		 		 		 		 rul = rulObj[j];

		 		 		 		 		 if ( rul.selectorText){
		 		 		 		 		 		 if(rul.selectorText == "."+swClass) {
		 		 		 		 		 		 		 r = rul.style.backgroundImage;
		 		 		 		 		 		 		 looking=0 ;
		 		 		 		 		 		 }
		 		 		 		 		 }
		 		 		 		 }
		 		 		 }
		 		 }
		 }

		 if (r.length>0) {
		 		 var rege = r.match("url\\((.*)\\)"); 		 
		 		 imgel.src=urlstr(rege[1],"");

		 }
}
}
// End new rule to fix Safari

function urlstr (inp,q){var r="" ,u = url(inp);if (u[2])r+=u[2]+":"; if (u[4])r+="//"+u[4]; r+=u[5]; if (u[7]){r+="?"+u[7]+(q?"&"+q:"");} else {q?r+="?"+q:false;} if (u[9])r+="#"+u[9];	return r;}
function url (str, verbose) {var url = str.match ("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?"); if (verbose){var r="";for (var i=0;i<url.length; i++)r+= (i+": "+url[i]+"\n");	}	return url;}
function propertyInspector (el){if (!el || !el.attributes) return; var str; for (var i=0 ; i<el.attributes.length; i++) {j=el.attributes[i]; if(j.name.substring(0,2)!="on"){str+=j.name+" = "+j.value+(i%5==0?"\n":"\t\t");}} alert (str);}
function stringInArray (aString, anArray){ for (var i=0; i<anArray.length; i++){if (aString == anArray [i]) return true;} return false;}
function createCookie(n,v,d) {if (d) {var date = new Date(); date.setTime(date.getTime()+(d*24*60*60*1000)); var e = "; expires="+date.toGMTString();} else e = "";document.cookie = n+"="+v+e+"; path=/";}
function clearCookie (nameArr) { for (var i=0; i<nameArr.length; i++){ writeSessionData (nameArr [i], "", -1);}	return null; }
function querystring (url , id) {var m = url.match ("[^?]*?\\?(.*)"); if (m && m.length == 2) {	var arg=m[1].match ("(.*?&)?"+id+"=([^(&#)]*)"); 	if (arg && arg.length == 3) {			return (unescape(arg[2]));	} else {			return null;	}} else { 		return null;}}
function querystringappend (url, pn, pv) {var q=pn+"="+escape (pv);var u = url.match("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");var r = ""; 	if (u[2]) r+=u[2]+":"; 	if (u[4]) r+="//"+u[4]; 	r+=u[5]; 	if (u[7]){if (querystring (url, pn)) {r+= "?"+u[7].replace (("([&\?])"+pn+"=[^&]*?"), "$1"+q);} else {r+="?"+u[7]+"&"+q;}}else {r+="?"+q;} 	if (u[9]) r+="#"+u[9];return r;}
function readCookie(name) { var n = name + "="; var ca = document.cookie.split(';'); for(var i=0;i < ca.length;i++) { var c = ca[i]; while (c.charAt(0)==' ') c = c.substring(1,c.length); 	if (c.indexOf(n) == 0) {var tmp = c.substring(n.length,c.length);  return tmp=="null"?null:tmp; }}  return null; }
function cleanURL (dirtyurl){ return cleantext(cleantext (dirtyurl, '?'), '#'); }
function readSessionData (pn) { return navigator.cookieEnabled?readCookie (pn):querystring (document.location.href,pn); }
function writeSessionData (pn, pv) {if (navigator.cookieEnabled){createCookie (pn, pv, 1);} else {if (!document.localURLs) createLocalURLs();	var l =  gbn("A");		for (var i=0; i<l.length; i++)  if (l[i].local) l[i].href = querystringappend (l[i].href,pn, pv); }}
function createLocalURLs (){document.localURLs = true;	var l = document.getElementsByTagName ('A'); 	var cl = cleanURL(document.location.href); for (var i=0; i<l.length; i++)  {if (chooseToAppend (l[i].href,document.sitePatterns,document.siteExclusions,Array (cl, l[i].innerText?l[i].innerText:"", l[i].innerHTML?l[i].innerHTML:"")))  l[i].local = true;	}}
function cleantext (i, a){ if (i.indexOf (a) >= 0) { return i.substring (0, i.indexOf (a));} else { return i; } }
function makeLink(ltext, ishtml, href, id, nc){var l = document.createElement("A"); l.setAttribute("href", href); if (id){l.setAttribute("id", id)}; if (nc){l.setAttribute("class", nc)};
if (ishtml){ l.innerHTML = ltext; } else { ltext = document.createTextNode(ltext); l.appendChild(lText); } return l;}
function notSupported (){alert ("Unfortunately your browser is not supported for this functionality"); return void 0; }
function gbn (a){return document.getElementsByTagName (a);}
function gbi (a){return document.getElementById (a);}
/*********** SNIFFER ***********/
function Is() {
this.supported = (document.getElementById && document.getElementsByTagName);
}

/* encoding */
   var kStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
   function encode64(inp) {
	   if (!inp) return null;
      var o="";
	  var c1, c2, c3, e1, e2, e3, e4 = "";
      var i = 0;
      do {
         c1 = inp.charCodeAt(i++); c2 = inp.charCodeAt(i++); c3 = inp.charCodeAt(i++);
         e1 = c1 >> 2; e2 = ((c1 & 3) << 4) | (c2 >> 4); e3 = ((c2 & 15) << 2) | (c3 >> 6); e4 = c3 & 63;
         if (isNaN(c2)) { e3 = e4 = 64; } else if (isNaN(c3)) { e4 = 64; }
         o += kStr.charAt(e1) + kStr.charAt(e2) + kStr.charAt(e3) + kStr.charAt(e4);
		 c1 = c2 = c3 = e1 = e2 = e3 = e4 = "";
      } while (i < inp.length);
      return o;
   }

   function decode64(inp) {
	if (!inp) return null;
	  var o = ""
	  var c1, c2, c3, e1, e2, e3, e4 = "";
      var i = 0;
      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      inp = inp.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      do {
         e1 = kStr.indexOf(inp.charAt(i++)); e2 = kStr.indexOf(inp.charAt(i++)); e3 = kStr.indexOf(inp.charAt(i++)); e4 = kStr.indexOf(inp.charAt(i++));
         c1 = (e1 << 2) | (e2 >> 4); c2 = ((e2 & 15) << 4) | (e3 >> 2); c3 = ((e3 & 3) << 6) | e4;
		 o += String.fromCharCode(c1);
		 if (e3 != 64) { o += String.fromCharCode(c2); }
         if (e4 != 64) { o += String.fromCharCode(c3); }
         c1 = c2 = c3 = e1 = e2 = e3 = e4 = "";
      } while (i < inp.length);
      return o;
   }