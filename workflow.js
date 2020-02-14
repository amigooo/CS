var fileLocked = true;

function createFormular(){
	checkFileLocked(hasFile,noFile);
}

function startRelevanzpruefung(){
	checkFileLocked(hasFileR,noFileR);
}


function checkFileLocked(success,failure){
    var checkFileLockedEndpointUrl = _spPageContextInfo.webAbsoluteUrl+"/_api/web/GetFileByServerRelativeUrl('"+_spPageContextInfo.webServerRelativeUrl+"/Projects/"+resultEckdaten.Title+".docx')/LockedByUser";

    getJson(checkFileLockedEndpointUrl,success,failure);   
}

function getJson(endpointUrl,success,failure)
{
    $.ajax({
      type: "GET", 
      headers: { 
            "accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose"
      }, 
      url: endpointUrl, 
      success: success,
      failure: failure,
      //statusCode: statusCode
      statusCode: {
        404: function(response) {
            statusCode(response);
        },
        500: function(response) {
            console.log('ajax.statusCode: 500');
            statusCode(response);

        }
      }
   });
}

function hasFile(data){
    if (data.d.hasOwnProperty('Title')) {
        alert("The document is locked by " + data.d.Title);
    }
    
    else {
	   startWorkflowCreateFormular(pa);
	}
}

function noFile(error){
    console.log(JSON.stringify(error));
    startWorkflowCreateFormular(pa);
}


function hasFileR(data){
    if (data.d.hasOwnProperty('Title')) {
        alert("The document is locked by " + data.d.Title);
    }
    
    else {
	   startThisWorkflow(pa,"Relevanzpruefung");
	}
}


function noFileR(error){
    console.log(JSON.stringify(error));
    startThisWorkflow(pa,"Relevanzpruefung");
}

function statusCode(statusCode){
    startWorkflowCreateFormular(pa);
}

function startWorkflowCreateFormular(pa){
     //alert(pa);
     var waitingDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Document writing...', "Please wait while the action is being completed.");
     var $request = new Sys.Net.WebRequest();
     $request.set_url((_spPageContextInfo.webServerRelativeUrl.replace(/^\s+|\s+$/gi,''))+"/_vti_bin/NintexWorkflow/Workflow.asmx");
     var $headers = $request.get_headers();
     $headers["Content-Type"]="text/xml; charset=utf-8";
     $headers["SOAPAction"]="http://nintex.com/StartWorkflowOnListItem";
     $body = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
     			"<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">"+
          			"<soap:Body>" +
               			"<StartWorkflowOnListItem xmlns=\"http://nintex.com\">" +
	               			"<itemId>"+pa+"</itemId>" +
	               			"<listName>Projektauftrag</listName>" +
	                    	"<workflowName>WriteDocument</workflowName>" +
	               		"</StartWorkflowOnListItem >"+
	          		"</soap:Body>"+
     			"</soap:Envelope>";
     $request.add_completed(function(executor, args){
          var statusCode = executor.get_statusCode();
          if(statusCode>=200 && statusCode<=399){
               Sys.Debug.trace("Action terminated");
               Sys.Debug.trace(statusCode);

          }else{
               Sys.Debug.trace('Warning : Error (Status code {0})', statusCode);
               alert('Error '+statusCode);
          }
          waitingDialog.close();
          drawDocuments();
     });
     $request.set_body($body);
     $request.invoke();
}


function startWorkflow(workflow){
	if(workflow == "Relevanzpruefung") {
		startRelevanzpruefung();
	}
	else {startThisWorkflow(pa,workflow);}
}

function startThisWorkflow(pa,workflow){
     var waitingDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(workflow + ' started...', "Please wait while the action is being completed.");
     var $request = new Sys.Net.WebRequest();
     $request.set_url((_spPageContextInfo.webServerRelativeUrl.replace(/^\s+|\s+$/gi,''))+"/_vti_bin/NintexWorkflow/Workflow.asmx");
     var $headers = $request.get_headers();
     $headers["Content-Type"]="text/xml; charset=utf-8";
     $headers["SOAPAction"]="http://nintex.com/StartWorkflowOnListItem";
     $body = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
     			"<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">"+
          			"<soap:Body>" +
               			"<StartWorkflowOnListItem xmlns=\"http://nintex.com\">" +
	               			"<itemId>"+pa+"</itemId>" +
	               			"<listName>Projektauftrag</listName>" +
	                    	"<workflowName>"+workflow+"</workflowName>" +
	               		"</StartWorkflowOnListItem >"+
	          		"</soap:Body>"+
     			"</soap:Envelope>";
     $request.add_completed(function(executor, args){
          var statusCode = executor.get_statusCode();
          if(statusCode>=200 && statusCode<=399){
               Sys.Debug.trace("Action terminated");
               Sys.Debug.trace(statusCode);

          }else{
               Sys.Debug.trace('Warning : Error (Status code {0})', statusCode);
               alert('Error '+statusCode);
          }
          waitingDialog.close();
          location.reload();
     });
     $request.set_body($body);
     $request.invoke();
}

function getWorkflowHistory(pa, workflow){
    
     var $request = new Sys.Net.WebRequest();
     $request.set_url((_spPageContextInfo.webServerRelativeUrl.replace(/^\s+|\s+$/gi,''))+"/_vti_bin/NintexWorkflow/Workflow.asmx");
     var $headers = $request.get_headers();
     $headers["Content-Type"]="text/xml; charset=utf-8";
     $headers["SOAPAction"]="http://nintex.com/GetWorkflowHistoryForListItem";
     $body = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
     			"<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">"+
          			"<soap:Body>" +
               			"<GetWorkflowHistoryForListItem xmlns=\"http://nintex.com\">" +
	               			"<itemId>"+pa+"</itemId>" +
	               			"<listName>Projektauftrag</listName>" +
	               			"<stateFilter>All</stateFilter>" +
	               			"<workflowNameFilter>"+workflow+"</workflowNameFilter>" +
	               		"</GetWorkflowHistoryForListItem>"+
	          		"</soap:Body>"+
     			"</soap:Envelope>";
     $request.add_completed(function(executor, args){
          var statusCode = executor.get_statusCode();
          if(statusCode>=200 && statusCode<=399){
               Sys.Debug.trace("Found Workflows");
               Sys.Debug.trace(statusCode);
               var wfResponse = executor.get_responseData();
               var wfJson = $.parseXML(wfResponse);
               
               if ($(wfJson).find("WorkflowInstanceId").length > 0) {
               	var workflowInstanceId = $(wfJson).find("WorkflowInstanceId")[$(wfJson).find("WorkflowInstanceId").length -1].textContent;
               	var workflowState =  $(wfJson).find("InternalState")[$(wfJson).find("WorkflowInstanceId").length -1].textContent;
                var wfUrl = _spPageContextInfo.webAbsoluteUrl +"/_layouts/15/WrkStat.aspx?WorkflowInstanceID=%7b" + workflowInstanceId  + "%7d";
               	
               	if(workflowState == 'Running'){
               		$("#"+workflow+"IMG").attr("src","../images/Approve-Yellow-24.png");              	
               	}
               	
               	if(workflowState == 'Completed' || workflowState == 'Cancelled'){
               		$("#"+workflow+"IMG").attr("src","../images/Approve-Green-24.png");              	
               	}
               	
               	if(workflowState != 'Running' && workflowState != 'Completed' && workflowState != 'Cancelled'){
               		//alert(workflowState);
               		$("#"+workflow+"IMG").attr("src","../images/Approve-Red-24.png");              	
               	}


				$("#"+workflow+"IMG").attr("title","WORKFLOWHISTORY");
				$("#"+workflow+"IMG").attr("alt","WORKFLOWHISTORY");
				$("#"+workflow+"IMG").attr("onclick","showDialog('Workflowstatus','"+ wfUrl+ "');");
				$("#"+workflow+"IMG").removeAttr("onmouseover");
				$("#"+workflow+"IMG").removeAttr("onmouseout");

               
               	             	
               }
               /*else {
               	$("#"+workflow+"IMG").attr("src","../images/Approve-Green-24.png");
				$("#"+workflow+"IMG").attr("title","WORKFLOWHISTORY");
				$("#"+workflow+"IMG").attr("alt","WORKFLOWHISTORY");
				$("#"+workflow+"IMG").attr("onclick","showDialog('Workflowstatus','"+ wfUrl+ "');");
				$("#"+workflow+"IMG").removeAttr("onmouseover");
				$("#"+workflow+"IMG").removeAttr("onmouseout");

               }*/

          }else{
               Sys.Debug.trace('Warning : Error (Status code {0})', statusCode);
               alert('Error '+statusCode);
          }
     });
     $request.set_body($body);
     $request.invoke();
}

function getRunningWorkflows(pa){
     var $request = new Sys.Net.WebRequest();
     $request.set_url((_spPageContextInfo.webServerRelativeUrl.replace(/^\s+|\s+$/gi,''))+"/_vti_bin/NintexWorkflow/Workflow.asmx");
     var $headers = $request.get_headers();
     $headers["Content-Type"]="text/xml; charset=utf-8";
     $headers["SOAPAction"]="http://nintex.com/GetRunningWorkflowTasksForListItem";
     $body = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
     			"<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">"+
          			"<soap:Body>" +
               			"<GetRunningWorkflowTasksForListItem xmlns=\"http://nintex.com\">" +
	               			"<itemId>"+pa+"</itemId>" +
	               			"<listName>Projektauftrag</listName>" +
	               		"</GetRunningWorkflowTasksForListItem>"+
	          		"</soap:Body>"+
     			"</soap:Envelope>";
     $request.add_completed(function(executor, args){
          var statusCode = executor.get_statusCode();
          if(statusCode>=200 && statusCode<=399){
               Sys.Debug.trace("Found Workflows");
               Sys.Debug.trace(statusCode);
               var wfResponse = executor.get_responseData();
               var wfJson = $.parseXML(wfResponse);
               
               if ($(wfJson).find("UserTask").length < 1) {
               
               	SP.UI.ModalDialog.showModalDialog( {html : $( "<div><h1>No approval active</h1></div>" ).get( 0 )  } );               	
               
               }
               else {
                var workflowInstanceId = $(wfJson).find("WorkflowInstaceId")[0].textContent;
                var wfUrl = _spPageContextInfo.webAbsoluteUrl +"/_layouts/15/WrkStat.aspx?WorkflowInstanceID=%7b" + workflowInstanceId  + "%7d";
               	showDialog("Approval",wfUrl);
               }

          }else{
               Sys.Debug.trace('Warning : Error (Status code {0})', statusCode);
               alert('Error '+statusCode);
          }
     });
     $request.set_body($body);
     $request.invoke();
}