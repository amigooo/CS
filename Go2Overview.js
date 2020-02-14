<script type="text/javascript"> 

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(document.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' ')); 
}
 
var id = getParameterByName('ID'); 
window.location.replace('/application/project-approval/Sitepages/overview.aspx?PA='+id); 

</script>