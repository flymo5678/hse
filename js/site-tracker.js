// Change these to match your requirements
var siTrackerUrl    = "http://www.hse.gov.uk/images/searchtrack.gif";
var siCookieName    = "SITESERVER";
var siCookieQPName  = "simigvis";
var siCookiePath    = "/";
var siCookieTimeout = 315360000000;
var siDomainList    = new Array(".co.uk",".com",".gov.uk");
var siAutoTracer    = true;
// These will be set by functions below - note image set is needed to stop variables going out of scope
var siCookieValue   = "";
var siPageID        = "";
var siTracerPath    = "";
var siTracerQuery   = "";
var siImageSet      = new Array(1);

function EncodeString(Input)
{
  var TransChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var Output     = "";
  for (var i = 0; i < Input.length; i += 3)
  {
    var NumBytesLeft = Input.length - i;
    var Value        = 0;
    Value  = (Input.charCodeAt(i) << 16) & 0x00ff0000;
    Value |= (NumBytesLeft > 1)? (Input.charCodeAt(i + 1) << 8) & 0x0000ff00 : 0;
    Value |= (NumBytesLeft > 2)? Input.charCodeAt(i + 2) & 0x000000ff : 0;
    Output += TransChars.charAt((Value & 0x00fC0000) >> 18);
    Output += TransChars.charAt((Value & 0x0003f000) >> 12);
    Output += (NumBytesLeft > 1)? TransChars.charAt((Value & 0x00000fc0) >> 6) : '_';
    Output += (NumBytesLeft > 2)? TransChars.charAt((Value & 0x0000003f)) : '_';
  }
  return Output;
}

//---------------------------------------------------------------------------------------------
// Encode all the relevent detals into a string
//---------------------------------------------------------------------------------------------
function EncodeDetails(Format)
{
   var Output = "";
   for (var i = 0; i < Format.length; i++)
   {
      var Data;
      switch (Format.charAt(i))
      {
      case 'r':
         Data = document.referrer;
         break;
      case 'p':
         Data = document.URL;      
         break;
      case 'd':
         Data = screen.availWidth+"x"+screen.availHeight+"x"+screen.colorDepth+"."+navigator.javaEnabled();
         if (navigator.plugins) Data += "."+navigator.plugins.length;
         break;
      case 'c':
         Data = siCookieValue;
         break;
      case 'u':
         Data = window.history.length+"."+(Math.random()*1000)+"."+(new Date()).getTime();
         break;
      case 't':
         Data = siPageID;
         break;
      case 'f':
         Data = siTracerPath;
         break;
      case 'q':
         Data = siTracerQuery;
         break;
      }
      //alert("Format="+Format.charAt(i)+", data: "+Data);
      Output += EncodeString(Data)+"*";
   }  
   return Output;
}

function GetDomain()
{
  var DomainValue = null;
  var firstDot;
  var secondDot;
  var lastDot;
  var useHostname=document.location.hostname;
  if (useHostname != null)
  {
     var arIndex;
     for (arIndex = 0; (arIndex < siDomainList.length) && (DomainValue == null); arIndex++)
     {
        var tldIndex = useHostname.lastIndexOf(siDomainList[arIndex]);
        if (tldIndex > 0)
        {
           var nextDot = useHostname.lastIndexOf('.',tldIndex-1);
           if (nextDot >= 0)
           {
              DomainValue = useHostname.substring(nextDot);
           }
           else
           {
              DomainValue = "." + useHostname;
           }
        }
     }
  }
  return DomainValue;
}

function SetCookie(Name,Value,Path) 
{
  var Expiry=new Date;
  Expiry.setTime(Expiry.getTime()+siCookieTimeout);
  var Domain=GetDomain();
  var CookieDetails=Name+"="+Value+"; expires=\""+Expiry.toGMTString()+"\" "+((siCookiePath) ? "; path=" + siCookiePath : "")+((Domain) ? "; domain="+Domain : "");
  document.cookie=CookieDetails;
}

function GetCookie(Name,DataSource,DataEndChar) 
{
  var Prefix = Name+"=";
  var Value  = null;
  var Begin  = DataSource.indexOf(Prefix);
  if ((Begin != -1) && (Name.length > 0))
  {
    var End = DataSource.indexOf(DataEndChar,Begin);
    if (End == -1) End = DataSource.length;
    Value = DataSource.substring(Begin+Prefix.length,End);
  } 
  return Value;
}

function BuildCookie()
{
   var CookieValue=GetCookie(siCookieQPName,document.URL,"&");
   if (CookieValue != null) 
   {
      SetCookie(siCookieName,CookieValue);
   }
   else
   {
      CookieValue=GetCookie(siCookieName,document.cookie,";");
      if (CookieValue == null)
      {
         CookieValue=EncodeDetails("u");
         SetCookie(siCookieName,CookieValue);
      }
   }
   CookieValue = GetCookie(siCookieName,document.cookie,";");
   return CookieValue;
}

function SiMigrateCookie(link)
{
   var CookieValue=GetCookie(siCookieName,document.cookie,";");
   if (CookieValue != null) link.href=link.href+((link.href.indexOf('?') > 0) ? "&" : "?")+siCookieQPName+"="+CookieValue;
   return true;
}

function SiSendTracer(cookieForm,noCookieForm)
{
   var Tracker = new Image();
   Tracker.src = (siCookieValue == null) ? siTrackerUrl+"?f="+noCookieForm+"&d="+EncodeDetails(noCookieForm) : siTrackerUrl+"?f="+cookieForm+"&d="+EncodeDetails(cookieForm);
   siImageSet[siImageSet.length] = Tracker;
}

function SiTrackForm(filePath,form,list)
{
   siTracerPath = filePath;
   siTracerQuery = "";
   if (form.elements && (form.elements.length > 0))
   {
      var doamp=false;
      for (var i=0; i<form.elements.length; i++)
      {
         var el=form.elements[i];
         if (el.name)
         {
            var capture=(list == null);
            if (list != null)
            {
               for (var j=0; !capture && (j<list.length); j++)
               {
                  if (el.name == list[j]) capture = true;      
               }
            }
            if (capture && (el.type == "radio")) capture = el.checked;
            if (capture) 
            {
               if (doamp) siTracerQuery += "&";
               siTracerQuery += escape(el.name)+"="+escape(el.value);
               doamp=true;
            }
         }
      }
   } 
   SiSendTracer("fqcrt","fqdrt");
   return true;
}

function SiTrackTracer(filePath,queryString)
{
   siTracerPath = filePath;
   siTracerQuery = queryString;
   SiSendTracer("fqcrt","fqdrt");
}

function SiTrackPage()
{
   siCookieValue = BuildCookie();
   siPageID = "t"+(new Date()).getTime()+"h"+window.history.length;
   if (siAutoTracer) SiSendTracer("prt","prt");
}

SiTrackPage();
