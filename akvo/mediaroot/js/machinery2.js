
function getHeight(widget_type) 
{	
	switch(widget_type) 
	{
		case 'feature-side': 		return 840; break; 
		case 'project-contribute':  return 570; break; 
		case 'project-small':       return 312; break; 
		case 'project-updates': 	return 900; break; 
		case 'project-list': 		return 730; break;
		case 'project-narrow': 		return 840; break; 
		case 'cobranded-narrow':    return 911; break;
		case 'cobranded-short':     return 627; break;
		case 'cobranded-banner':    return 234; break;
		case 'cobranded-leader':    return 207; break;

		default: 					return 840;
	}	
}

function getWidth(widget_type)
{	
	switch(widget_type) 
	{
		case 'feature-side': 		return 202; break; 
		case 'project-contribute': 	return 202; break; 
		case 'project-small':       return 170; break;
		case 'project-updates': 	return 202; break; 
		case 'project-list': 		return 745; break; 
		case 'project-narrow': 		return 170; break; 
		case 'cobranded-narrow': 	return 170; break; 
		case 'cobranded-short': 	return 170; break; 
		case 'cobranded-banner':    return 468; break;
		case 'cobranded-leader':    return 728; break;
		default: 					return 202;
	}	
}

function hex_validator(hexcolor) 
{ 
	var strPattern = /^([0-9a-f]{1,2}){3}$/i;
	return strPattern.test(hexcolor);
}

function preview_widget()
{
	// Remove old warnings
	var error_message = '';
		
	// Error checking begins	
	var colorsValidate = true;
	
	// Get Backgroundcolor string, validate that it's 3 or 6 characters and only has 0-f characters
	if ( jQ('#backgroundcolor_pulldown').val() == 'x' )
	    var bgcolor = jQ('#backgroundcolor_text').val();
	else
	    var bgcolor = jQ('#backgroundcolor_pulldown').val();
	
	if (!(bgcolor.length == 3 || bgcolor.length == 6)) 
	{ 
		error_message += error1 + ".<br />";
		colorsValidate = false;
	}
	else if (!hex_validator(bgcolor))
	{
		error_message += error2 + ".<br />";
		colorsValidate = false;
	}
	
	// Get Titlecolor string, validate that it's 3 or 6 characters and only has 0-f characters
	if ( jQ('#textcolor_pulldown').val() == 'x' )
	    var txtcolor = jQ('#textcolor_text').val();
	else
	    var txtcolor = jQ('#textcolor_pulldown').val();
	
	if (!(txtcolor.length == 3 || txtcolor.length == 6))
	{ 
		jQ('#warning_color').animate({ opacity: "show" },"slow");
		error_message += error3 + ".<br />";
		colorsValidate = false;
	}
	else if (!hex_validator(txtcolor))
	{
		error_message += error4 +".<br />";
		colorsValidate=false;
	}
	
	// Main warning
	var akvo_widget_container = jQ('#akvo_widget_container');
	var codefield = jQ('#code');
	jQ('#warning_color').animate({ opacity: "hide" }, "fast");
	
    // If errors present them and remove widget and cod
	if(!colorsValidate) {    
	        
        jQ('#warning_color').html(error_message);
        jQ('#warning_color').animate({ opacity: "show" }, "slow");
        
		akvo_widget_container.innerHTML = '';

		codefield.val('');
		return;
	}
	
	// Create the iframe variables
	var akvo_widget_height = getHeight(akvo_widget_type);
	var akvo_widget_width = getWidth(akvo_widget_type);
	
	if (akvo_widget_choice == 'random-from-org') {
	    var akvo_url = 'http://' + location.host + '/rsr/widget/one-from-organisation/' + akvo_widget_organisation + '/?widget=' + akvo_widget_type;
	    var widget_url = akvo_url + '&bgcolor=' + bgcolor + '&textcolor=' + txtcolor + '&site=' + akvo_widget_site;
	} else if (akvo_widget_choice == 'project-list') {
	    var akvo_url ='http://' + location.host + '/rsr/widget/' + akvo_widget_type + '/organisation/' + akvo_widget_organisation + '/'
	    var widget_url = akvo_url + '?bgcolor=' + bgcolor + '&textcolor=' + txtcolor + '&site=' + akvo_widget_site;	    
	} else {
	    var akvo_url = 'http://' + location.host + '/rsr/widget/' + akvo_widget_type + '/project/' + akvo_project_id + '/';
	    var widget_url = akvo_url + '?bgcolor=' + bgcolor + '&textcolor=' + txtcolor + '&site=' + akvo_widget_site;
	}
	
	// If the iframe exists update otherwise create the iframe and add it to our anchor div.
	var akvo_widget = document.getElementById('jswidget');
	
	if(akvo_widget) 
	{
		akvo_widget.src = widget_url;
	} 
	else 
	{
		ifrm = document.createElement("IFRAME");
		ifrm.setAttribute("src", widget_url);
		ifrm.height = akvo_widget_height;
		ifrm.width = akvo_widget_width;
		ifrm.frameBorder = 0;
		ifrm.setAttribute("allowTransparency","true");
		ifrm.setAttribute("id","jswidget");
		//document.getElementById('akvo_widget_container').appendChild(ifrm);
		jQ('#akvo_widget_container').append(ifrm);
	}
	
	// Update the widget code snippet
	// Show code only if valid!!!!
	var codesnippet = '<iframe src="' + widget_url + '" '; 
	codesnippet += 'height="' + akvo_widget_height + '" width="' + akvo_widget_width + '" frameborder="0" allowTransparency="true"> </iframe>';
	codefield.val(codesnippet);
}

function setup(){
    // Hide customize other and warning section
    // jQ('#machinery_step2_warning_main').hide();
    
	//jQ('#backgroundcolor_other_section').hide();
	//jQ('#textcolor_other_section').hide();
	jQ('#warning_color').hide();
	
	
	// Toggle other selections for the colours		
	jQ("#backgroundcolor_pulldown").change(function() { 
		if (jQ('#backgroundcolor_pulldown').val() == 'x') {
			jQ('#backgroundcolor_other_section').animate({ opacity: "show" }, "slow");			
		} else {
			jQ('#backgroundcolor_other_section').animate({ opacity: "hide" }, "slow");
		}
	});
	
	jQ("#textcolor_pulldown").change(function() { 		
		if (jQ('#textcolor_pulldown').val() == 'x') {
			jQ('#textcolor_other_section').animate({ opacity: "show" }, "slow");			
		} else {
			jQ('#textcolor_other_section').animate({ opacity: "hide" }, "slow");
		}		
	});
	
	// Preview button
	jQ(function(){
	 jQ('#preview').click(function(){
	  jQ('html, body').animate({ scrollTop: jQ('#preview_position').offset().top }, 1000);
	   return false;
	 });
	});
	
	// Display the default widget preview
	preview_widget();
}