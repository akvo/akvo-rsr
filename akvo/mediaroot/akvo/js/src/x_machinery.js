/*globals jQ, error0, error1, error2, error3, error4, akvo_project_id, 
akvo_widget_type, akvo_widget_choice, akvo_widget_organisation, 
akvo_widget_site
*/

/*
* For the get a widget pages.
*/

function getHeight(widget_type) 
{
	switch(widget_type)
	{
		case 'feature-side':        return 840;
		case 'project-contribute':  return 570;
		case 'project-small':       return 312;
		case 'project-updates':     return 900;
		case 'project-list':        return 730;
		case 'project-map':         return 300;
		case 'project-narrow':      return 840;
		case 'cobranded-narrow':    return 911;
		case 'cobranded-short':     return 627;
		case 'cobranded-banner':    return 234;
		case 'cobranded-leader':    return 207;
		default:                    return 840;
	}
}

function getWidth(widget_type)
{
	switch(widget_type)
	{
		case 'feature-side':        return 202;
		case 'project-contribute':  return 202;
		case 'project-small':       return 170;
		case 'project-updates':     return 202;
		case 'project-list':        return 745;
		case 'project-map':         return 600;
		case 'project-narrow':      return 170;
		case 'cobranded-narrow':    return 170;
		case 'cobranded-short':     return 170;
		case 'cobranded-banner':    return 468;
		case 'cobranded-leader':    return 728;
		default:                    return 202;
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
	var bgcolor = '';
	if ( jQ('#backgroundcolor_pulldown').val() == 'x' ) {
	    bgcolor = jQ('#backgroundcolor_text').val();
	}
	else {
	    bgcolor = jQ('#backgroundcolor_pulldown').val();
    }

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
        
        if (akvo_widget_type != 'project-map') {

            // Get Titlecolor string, validate that it's 3 or 6 characters and only has 0-f characters
            var txtcolor = '';
            if ( jQ('#textcolor_pulldown').val() == 'x' ) {
                txtcolor = jQ('#textcolor_text').val();
            } 
            else 
            {
                txtcolor = jQ('#textcolor_pulldown').val();
            }
	    
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
	
	var widget_height = '';
	var widget_width = '';
	var map_widget_state = '';
	if (akvo_widget_choice == 'project-map') {
	    widget_height = jQ('#widget_height').val();
	    widget_width = jQ('#widget_width').val();
	    map_widget_state = jQ('input:radio[name=map_state]:checked').val();
	}

	// Create the iframe variables
	var akvo_widget_height = getHeight(akvo_widget_type);
	var akvo_widget_width = getWidth(akvo_widget_type);
    
    var akvo_url = '';
    var widget_url = '';
	if (akvo_widget_choice == 'random-from-org') {
	    akvo_url = 'http://' + location.host + '/rsr/widget/one-from-organisation/' + akvo_widget_organisation + '/?widget=' + akvo_widget_type;
	    widget_url = akvo_url + '&bgcolor=' + bgcolor + '&textcolor=' + txtcolor;
	} else if (akvo_widget_choice == 'project-list' || akvo_widget_choice == 'project-map') {
	    akvo_url ='http://' + location.host + '/rsr/widget/' + akvo_widget_type + '/organisation/' + akvo_widget_organisation + '/';
	    widget_url = akvo_url + '?bgcolor=' + bgcolor + '&textcolor=' + txtcolor;
	    if (akvo_widget_choice == 'project-map') {
            widget_url += '&height='+ widget_height + '&width=' + widget_width + '&state=' + map_widget_state;
        }
	} else {
	    akvo_url = 'http://' + location.host + '/rsr/widget/' + akvo_widget_type + '/project/' + akvo_project_id + '/';
	    widget_url = akvo_url + '?bgcolor=' + bgcolor + '&textcolor=' + txtcolor;
	}
	if (!(akvo_widget_site == '' || akvo_widget_site == 'Example: www.akvo.org')) {
	    widget_url += '&site=' + akvo_widget_site;
	}
    
    
    var ifrm = document.createElement("IFRAME");
    if (akvo_widget_choice != 'project-map') {
        var akvo_widget = document.getElementById('jswidget');
        // If the iframe exists update otherwise create the iframe and add it to our anchor div.
        if(akvo_widget) 
        {
            akvo_widget.src = widget_url;
        } 
        else 
        {
            //ifrm = document.createElement("IFRAME");
            ifrm.setAttribute("src", widget_url);
            ifrm.height = akvo_widget_height;
            ifrm.width = akvo_widget_width;
            ifrm.frameBorder = 0;
            ifrm.setAttribute("allowTransparency","true");
            ifrm.setAttribute("id","jswidget");
            //document.getElementById('akvo_widget_container').appendChild(ifrm);
            jQ('#akvo_widget_container').append(ifrm);
        }
    } else {
        var widget = jQ('#jswidget');
        if (widget) {
            widget.remove();
        }
        //ifrm = document.createElement("IFRAME");
        ifrm.setAttribute("src", widget_url);
        ifrm.height = widget_height;
        ifrm.width = widget_width;
        ifrm.frameBorder = 0;
        ifrm.setAttribute("allowTransparency","true");
        ifrm.setAttribute("id","jswidget");
        //document.getElementById('akvo_widget_container').appendChild(ifrm);
        jQ('#akvo_widget_container').append(ifrm);
    }


	// Update the widget code snippet
	// Show code only if valid!!!!
	var codesnippet = '<iframe src="' + widget_url + '" '; 
	if (akvo_widget_choice != 'project-map') {
	    codesnippet += 'height="' + akvo_widget_height + '" width="' + akvo_widget_width + '" frameborder="0" allowTransparency="true"> </iframe>';
	} else {
	    codesnippet += 'height="' + widget_height + '" width="' + widget_width + '" frameborder="0" allowTransparency="true"> </iframe>';
	}
	codefield.val(codesnippet);
}
