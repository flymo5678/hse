//Origional code taken from:
//http://www.devarticles.com/c/a/Web-Style-Sheets/Taming-the-Select/
//Modified for accessibility by Phillip Roberts-Jones
//
//Turn all ULs with the class 'ddmswitch' dropdown menus
//

function tamingselect()
{
	if(!document.getElementById && !document.createTextNode && !document.getElementsByTagName){return;}
	
	// Classes for the link and the visible dropdown
	var ts_listclass='ddmswitch';				//class to identify ULs
	var toreplace=new Array();				//array to run the ULs through
	var count=0;						//count the number of ULs
	var uls=document.getElementsByTagName('ul');		//getting all of the ULs
	var goHere=''

	//setting up the loop to go thtough all of the ULs
	for(var i=0;i<uls.length;i++)
	{

		//checks to make sure the class name is there
		if(ts_check(uls[i],ts_listclass))
		{
			

			//setting up the form ID from the UL
			var selectId = uls[i].getAttribute("id");

			//creating the form element			
			var newform=document.createElement('form');
			
			//setting an empty action attribute to make the generated code valid
			newform.setAttribute('action','');

			//setting up the form ID from the UL
			var selectId = uls[i].getAttribute("id");

			//creating the select element
			var newselect=document.createElement('select');

			//setting the ID for the select
			newselect.setAttribute("id",selectId);

			//starting the loop to get all of the 'a' tags in the ul
			for(j=0;j<uls[i].getElementsByTagName('a').length;j++)
			{
				var newopt=document.createElement('option');
				newopt.value=uls[i].getElementsByTagName('a')[j].href;	
				newopt.appendChild(document.createTextNode(uls[i].getElementsByTagName('a')[j].innerHTML));	
				newselect.appendChild(newopt);

			}
		


			//This make notes of what you've changed 
			newselect.onchange=function()
			{
				goHere=this.options[this.selectedIndex].value;
			}


			//setting up the go button attributes
			var GoButton = document.createElement("input");
			GoButton.setAttribute("type","button");
			GoButton.setAttribute("value","Go");

			//function to change page
			GoButton.onclick = function(){
				//checks the sibling values for the button
				var siblingStuff = this.previousSibling;
				//goes to the siblings selected value
				self.location=siblingStuff.options[siblingStuff.selectedIndex].value;
			}

			//writing the select element into the form
			newform.appendChild(newselect);

			//writing in the button after the select box
			newform.appendChild(GoButton);


			uls[i].parentNode.insertBefore(newform,uls[i]);
			toreplace[count]=uls[i];
			count++;
		}
	}

	//this used to remove the uls, changed to keep them in, but hide them via css for accessability
	for(i=0;i<count;i++){
		//toreplace[i].parentNode.removeChild(toreplace[i]);
		// uncomment line above to remove altogether & comment-out 2 lines below
		toreplace[i].className = "hideComplete";
		toreplace[i].removeAttribute("id");
	}

	//class name check function
	function ts_check(o,c)
	{
	 	return new RegExp('\\b'+c+'\\b').test(o.className);
	}

	//pass, something to do with the class and swaping, still havent worked it out
	function ts_swapclass(o,c1,c2)
	{
		var cn=o.className
		o.className=!ts_check(o,c1)?cn.replace(c2,c1):cn.replace(c1,c2);
	}

	//not sure again here
	function ts_addclass(o,c)
	{
		if(!ts_check(o,c)){o.className+=o.className==''?c:' '+c;}
	}



}

/*window.onload=function()
{
	tamingselect();
	// add more functions if necessary
}*/
  function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}

addLoadEvent(tamingselect);
addLoadEvent(function() {
  /* more code to run on page load */ 
});
