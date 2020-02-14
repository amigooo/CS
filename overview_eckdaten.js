var resultEckdaten;

function loadThisPA(){
	restCall4Eckdaten(pa,"Projektauftrag",_spPageContextInfo.webAbsoluteUrl,function(){
	
		$("#atTitle").html(resultEckdaten.Projektname);
		
		$("#atProjektauftrag").html(resultEckdaten.Title);
		$("#atProjekttype").html(resultEckdaten.Projekttype);
		$("#atStandort").html(resultEckdaten.Standort);
		$("#atSponsor").html(resultEckdaten.Sponsor.Title);
		$("#atManager").html(resultEckdaten.Manager.Title);
		$("#atProjektstart").html(getValueDate(resultEckdaten.Projektstart));
		$("#atProjektende2").html(getValueDate(resultEckdaten.Projektende2));
		$("#atProjektende").html(getValueDate(resultEckdaten.Projektende));
		$("#atBewertungsdatum").html(getValueDate(resultEckdaten.Review));
		$("#atBewertungsergebnis").html(resultEckdaten.Revision);
		
		if (!$.isEmptyObject(resultEckdaten.Verlinkung0)) {
			$("#atVerlinkung").html("<a href='"+resultEckdaten.Verlinkung0.Url+"' target='_blank'><span>"+resultEckdaten.Verlinkung0.Description+"<img src='../images/info-icon.png' style='margin-left:5px;padding-top:3px'/></span></a>");
		}
		$("#atBudget").html(resultEckdaten.Budget0);
		$("#atKostenstelle").html(resultEckdaten.Kostenstelle);
		$("#atProjNr").html(resultEckdaten.ProjNr);
	
		$("#atProjektstatus").html(resultEckdaten.Projektstatus);
		
		if(resultEckdaten.GLFreigabe){
			$("#atHeaderProjectApproval").text('FREIGABE (INKLUSIVE GL FREIGABE)');
		}
		
		checkStatus(pa,resultEckdaten.Projektstatus);		
		
	});
}

function restCall4Eckdaten(pa, listName, webUrl, callback) {
	var url = webUrl + "/_api/Web/lists/GetByTitle('"+listName+"')/items?$expand=Sponsor,Manager&$select=*,Sponsor/Title,Manager/Title&$filter=ID%20eq%20'"+pa+"'";
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
			resultEckdaten = response.d.results[0];
			callback();
	  	}
	});
}