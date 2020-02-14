//var thisSite = getSiteUrl();

//This line was not working anymore
//ExecuteOrDelayUntilScriptLoaded(getWebUserData, "sp.js");

//found a workaround here
//https://social.msdn.microsoft.com/Forums/office/en-US/8b253f58-3cb5-4202-be20-8e4913850e16/error-uncaught-typeerror-cannot-read-property-apply-of-undefined-at-arrayanonymous?forum=sharepointdevelopment#1fc40c59-96a5-47f5-a4a2-642e4aef1792

var pa = getParameterByName("PA");

$(window).load(function () {
   
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () { }); 
    SP.SOD.executeOrDelayUntilScriptLoaded(init, "sp.js"); 
});

function init(){
	
	if (pa==0) {
	
		url = _spPageContextInfo.webAbsoluteUrl +"/sitepages/overview.aspx?PA="+getNewItemID('Projektauftrag');
      	$( location ).attr("href", url);
	}
	
	if (pa==-1){
		loadTest();
	}
	
	
	else {
	
		loadThisPA();
		drawDocuments();
	}
}

  
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(document.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getValue(object, fieldName) {
	var value =  object.attr("ows_" + fieldName);
	if (value == null) { 
		value = "";
	} 
	return value;
}
    
function getValueDropDown(object, fieldName) {
	var value =  object.attr("ows_" + fieldName);
	if (value == null) { 
		value = ""; 
	} 
	else { 
		value = value.substr(value.indexOf("#")+1, value.length); 
	}
	
	return value;
}

function getValueDate(object, fieldName) {
	var value =  object.attr("ows_" + fieldName);
	if (value == null) { 
		value = ""; 
	} 
	else {
		value = value.substr(8,2) + "." + value.substr(5,2) + "." + value.substr(0,4); 
	}
	
	return value;
}

function getValueDate(object) {
	if (object == null) { 
		object = ""; 
	} 
	else {
		var d1 = Date.parse(object);
		var d2 = new Date(d1);
		object = d2.format("dd.MM.yyyy");

	}
	
	return object;
}


function getSiteUrl() {
	var thisUrl = document.location.href;
	thisUrl = thisUrl.toLowerCase();
	var thisSite = thisUrl.substr(0,thisUrl.indexOf("/seiten/")+1);
	return thisSite;
}

function getNewItemID(listname){
    var itemID=0;
	var siteURL = _spPageContextInfo.webAbsoluteUrl;
	
	var url = siteURL + "/_api/web/lists/getbytitle('" + listname + "')/items?$select=ID&$OrderBy=Created desc&$top=1";
	$.ajax({
	 url: url,
	 method: "GET",
	 async: false,
	 headers: { "Accept": "application/json; odata=verbose" },
	 success: function (data) {
		if(data.d.results.length>0){
			itemID = data.d.results[0].ID;
		}	
	 },
	 error: function (data) {		
	 }
	});
	return itemID;
}


function writeBottomLine(id,colspan) {
		$(id).append("<tr class='attableBottomLine'><td id='atHeaderBottomline' colspan='"+colspan+"'></td></tr>");
}

function checkStatus(id, status){

	switch (status) {
	
		case "Projektauftrag in Erstellung":
		
			$("#RelevanzpruefungIMG").attr("title","RELEVANZPRUEFUNG");
			$("#RelevanzpruefungIMG").attr("alt","RELEVANZPRUEFUNG");
			$("#RelevanzpruefungIMG").attr("onclick","startWorkflow('Relevanzpruefung');");
			$("#RelevanzpruefungIMG").attr("onmouseover","this.src='../images/Approve-Yellow-24.png'");
			$("#RelevanzpruefungIMG").attr("onmouseout","this.src='../images/Approve-White-24.png'");

			brake;
			
		case "In Prüfung der Relevanz auf andere Fachbereiche":
		
			getWorkflowHistory(id, "Relevanzpruefung");
			brake;
			
		case "In Freigabe":
			getWorkflowHistory(id, "Relevanzpruefung");
			getWorkflowHistory(id, "Freigabe");
			brake;
			
		case "Projekt bewilligt und in Umsetzung":
		
			getWorkflowHistory(id, "Relevanzpruefung");
			getWorkflowHistory(id, "Freigabe");
			$("#ProjektabschlussIMG").attr("title","PROJEKTABSCHLUSS");
			$("#ProjektabschlussIMG").attr("alt","PROJEKTABSCHLUSS");
			$("#ProjektabschlussIMG").attr("onclick","startWorkflow('Projektabschluss');");
			$("#ProjektabschlussIMG").attr("onmouseover","this.src='../images/Approve-Yellow-24.png'");
			$("#ProjektabschlussIMG").attr("onmouseout","this.src='../images/Approve-White-24.png'");
			brake;
			
		case "Projektabschluss beantragt":
		
			getWorkflowHistory(id, "Relevanzpruefung");
			getWorkflowHistory(id, "Freigabe");
			getWorkflowHistory(id, "Projektabschluss");
			brake;
			
		case "Projekt abgeschlossen":
		
			getWorkflowHistory(id, "Relevanzpruefung");
			getWorkflowHistory(id, "Freigabe");
			getWorkflowHistory(id, "Projektabschluss");
			$("#ErfolgskontrolleIMG").attr("title","ERFOLGSKONTROLLE");
			$("#ErfolgskontrolleIMG").attr("alt","ERFOLGSKONTROLLE");
			$("#ErfolgskontrolleIMG").attr("onclick","startWorkflow('Erfolgskontrolle');");
			$("#ErfolgskontrolleIMG").attr("onmouseover","this.src='../images/Approve-Yellow-24.png'");
			$("#ErfolgskontrolleIMG").attr("onmouseout","this.src='../images/Approve-White-24.png'");


			brake;
			
		case "Erfolgskontrolle beauftragt":
		
			getWorkflowHistory(id, "Relevanzpruefung");
			getWorkflowHistory(id, "Freigabe");
			getWorkflowHistory(id, "Projektabschluss");
			getWorkflowHistory(id, "Erfolgskontrolle");

			brake;
			
		case "Erfolgskontrolle durchgeführt":
		
			getWorkflowHistory(id, "Relevanzpruefung");
			getWorkflowHistory(id, "Freigabe");
			getWorkflowHistory(id, "Projektabschluss");
			getWorkflowHistory(id, "Erfolgskontrolle");

			brake;

	}
}


function loadTest(){	
	alert('in Testmode');
	
	$.ajax({
	    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('ListName')/items?$select=ID,Title,HyperlinkCol",
	    method: "GET",
	    headers: { "Accept": "application/json; odata=verbose" },
	    success: function (data) {
	        if(data.d.results.length>0){
	            var items = data.d.results;
	            var desc = "";
	            //add logic for iteration
	            if (items[0].HyperlinkCol) {  
	                 desc = items[0].HyperlinkCol.Description;  
	
	                 if(desc == "Approved")
	                 {
	                    console.log("Approved Item");
	                 }
	            }
	        }
	    },
	    error: function (data) {
	        console.log(data);
	    }
	});	
	
}

