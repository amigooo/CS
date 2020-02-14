NWF$(document).ready(function() {

	isNewMode = document.location.pathname.indexOf("/NewForm.aspx") > -1; 

	if (isNewMode ) {
		
		
		getLastProjektauftrag("Projektauftrag", _spPageContextInfo.webAbsoluteUrl, function (data) {
			
			var paNumber = parseInt(data.Title.substr(8,5))+1;	
			NWF$('#'+tbTitle).val("PA-" + new Date().getFullYear() + "-" + paNumber);
			
	    }, function (data) {
	        alert("Ooops, an error occured. Please try again");
	    });

		
		
		/*NWF$('#'+ddlBereich).change(function (){
		
			
			var Bereich = (NWF$('#'+ddlBereich).val()).split(';#');
			
		
		});*/
	}
	
	LimitLength();
	
});

function LimitLength(){
   NWF$("body").append('<div id="charCounter";></div>');  // create div for counter
   var zaehlerFeld = NWF$('#charCounter');   // save as jquery object
   zaehlerFeld.hide(); // hide the div
   NWF$("[class*=kob-maxtextlen-]").each(function () { // for all html elemts with class name beginning with kob-maxtext-len
      var classes = this.className.split(" ");  // splitt class names 
      for (var i = 0; i < classes.length; i++) {  // for all class names of the actual html
         if (classes[i].substr(0, 15) == "kob-maxtextlen-") {   // check if class name begins with kob-maxtext-len
            var maxlen = parseInt(classes[i].split('kob-maxtextlen-')[1]); // extract the number at the end of the class name
            
            NWF$(this).on('focus input blur', function () { // define an event function
               zaehlerFeld.show();   // show counter
               zaehlerFeld.css({   // format counter
                                 "text-align":"center",
                                 "display":"inline-block",
                                  "background-color":"#FFF",
                                  "border":"1px solid",
                                  "box-shadow":"3px 3px 3px #888",
                                  "height":"16px",
                                  "width":"22px"
                              });
               MaxTextLaenge(NWF$(this), maxlen, zaehlerFeld);  // call check function
            });
            NWF$(this).blur(function () {
               zaehlerFeld.text(' '); 
               zaehlerFeld.hide();
            });
         }
      }
   });
}

function MaxTextLaenge(textFeld, maxAnzahl, zaehlerFeld) {
   zaehlerFeld.position({  // positioning the counter
      my: "left top-16",
      at: "left top",
      of: textFeld,
      collision: "fit"
   });
   if (textFeld.val().length > maxAnzahl) { // more then max characters enterd
      textFeld.val(textFeld.val().substr(0, maxAnzahl)); // limit to max text length
      textFeld.css('border-color', 'red');  // show control border in red
      zaehlerFeld.text(0);   // no more input allowed
   } else {
      zaehlerFeld.text(maxAnzahl - textFeld.val().length); // count down counter
      textFeld.css('border-color', "");   // normal border 
   }
}

function setPeoplePicker(name) { 
   var ins = new NF.PeoplePickerApi('#' + tbPruefer);
   ins.clear();
   ins.search(name).done(function (data) {
      ins.add(data[0]);
   });
}

function getLastProjektauftrag(listName, siteurl, success, failure) {
    var url = siteurl + "/_api/web/lists/getbytitle('" + listName + "')/items?$select=Title&$OrderBy=Created desc&$top=1";
    NWF$.ajax({
        url: url,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data.d.results.length == 1) {          	
                success(data.d.results[0]);
            }
            else {
                failure("No Uniqe result obtained for the specified Id value");
            }
        },
        error: function (data) {
            failure(data);
        }
    });
}

