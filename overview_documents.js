var resultPADocuments;
var listPADocuments = "Projektdokument";

function drawDocuments(){

	$("#atPADocuments").find("tr:not(:first)").remove();
	loadPADocuments();
}

function loadPADocuments(){
	restCall4PADocuments(pa,listPADocuments,_spPageContextInfo.webAbsoluteUrl,function(){
	
		$.each( resultPADocuments, function( index, resultPADocument ) {
			
			var docIconPath = '';
			var extension =  (resultPADocument.File.Name.indexOf('.') > 0 ) ? resultPADocument.File.Name.split('.').pop().toLowerCase() : 'undefined';
			
			if (extension.search("pdf")== -1){ //not PDF
				docIconPath = "ic"+extension+".png";
       		}
       		else {
       			docIconPath = "pdficon_small.gif"; //PDF
       		}

			paDocumentsTR = "";	
			paDocumentsTR = paDocumentsTR + "<tr class='attableBoxText'>";	
	        paDocumentsTR = paDocumentsTR + "<td style='width:5%;'><img src='/_layouts/15/images/"+docIconPath +"' /></td>";	        
	        paDocumentsTR = paDocumentsTR + "<td style='width:80%;'><a href='"+resultPADocument.File.ServerRelativeUrl+"'>" + resultPADocument.File.Name + "</a></td>";
        	paDocumentsTR = paDocumentsTR + "<td style='width:15%;'>" + getValueDate(resultPADocument.File.TimeLastModified) + "</td>";
			paDocumentsTR = paDocumentsTR + "</tr>";
	
			$("#atPADocuments").append(paDocumentsTR);
		});
		writeBottomLine("#atPADocuments",3);	  	
	});
}

function restCall4PADocuments(pa, listName, webUrl, callback) {
	//var url = webUrl + "/_api/Web/lists/GetByTitle('"+listName+"')/items?$expand=file&$select=*&$filter=ProjektauftragId%20eq%20'"+pa+"'&$orderby=Created%20desc&$top=1";
	var url = webUrl + "/_api/Web/lists/GetByTitle('"+listName+"')/items?$expand=file&$select=*&$OrderBy=Created desc&$filter=ProjektauftragId%20eq%20"+pa;
	var settings = {
		"async": true,
		"url": url,
  		"method": "GET",
  		"headers": {
    		"accept": "application/json; odata=verbose",
    		"cache-control": "no-cache",
  		}
	}
	
	$.ajax(settings).done(function (response) {
		if (response.d.results.length > 0) {
			resultPADocuments = response.d.results;
			callback();
	  	}
	  	else {
			writeBottomLine("#atPADocuments",3);
		}	  	
	});
}