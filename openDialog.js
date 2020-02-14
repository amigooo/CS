function showDialog(dialog,id) {
	
    var options = SP.UI.$create_DialogOptions();
       
    options.autoSize = true;
    
    switch(dialog) {
    	
    case "EditProjektauftrag":
		options.title = "Edit";
	    options.url = _spPageContextInfo.webServerRelativeUrl + "/Lists/Projektauftrag/EditForm.aspx?ID="+getParameterByName("PA");
		options.dialogReturnValueCallback = closeCallbackEditProjektauftrag;
		break;
	
	case "Workflowhistory":
		options.title = "Workflowhistory";
	    options.url = _spPageContextInfo.webServerRelativeUrl + "/_layouts/15/NintexWorkflow/ItemWorkflows.aspx?ListId=%7B86A0B609%2D73D5%2D4A4D%2D87D7%2DE4B1E29404DC%7D&ItemId="+getParameterByName("PA")+"&source="+_spPageContextInfo.webServerRelativeUrl+"/Sitepages/Overview.aspx?PA="+getParameterByName("PA");
		options.dialogReturnValueCallback = closeCallbackEditProjektauftrag;
		break;
		
	case "Workflowstatus":
		//alert(id);
		options.title = "Workflowstatus";
	    options.url = id +"&source="+_spPageContextInfo.webServerRelativeUrl+"/Sitepages/Overview.aspx?PA="+getParameterByName("PA");
		options.dialogReturnValueCallback = closeCallbackEditProjektauftrag;
		break;
	
		
    default:
    	options.title = "EditProjektauftrag";
	    options.url = _spPageContextInfo.webServerRelativeUrl + "/Lists/Projektauftrag/EditForm.aspx?ID="+getParameterByName("PA");
		options.dialogReturnValueCallback = closeCallbackEditProjektauftag;
	}    
    
    SP.UI.ModalDialog.showModalDialog(options);
}


function closeCallbackEditProjektauftrag(result, returnValue) {
    if (result != SP.UI.DialogResult.cancel) {
    	init();
	}
}

