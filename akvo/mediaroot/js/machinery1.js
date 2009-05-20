/*
Akvo RSR is covered by the GNU Affero General Public License, see more details in the license.txt file located at the root folder of the Akvo RSR module. 
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html
*/


function getHeight(widget_type) 
{	
	switch(widget_type) 
	{
		case 'feature-side': 		return 840; break; 
		case 'project-contribute':  return 570; break; 
		case 'project-updates': 	return 900; break; 
		case 'project-list': 		return 730; break;
		case 'project-narrow': 		return 840; break; 
		default: 					return 840;
	}	
}

function getWidth(widget_type)
{	
	switch(widget_type) 
	{
		case 'feature-side': 		return 202; break; 
		case 'project-contribute': 	return 202; break; 
		case 'project-updates': 	return 202; break; 
		case 'project-list': 		return 745; break; 
		case 'project-narrow': 		return 172; break; 
		default: 					return 202;
	}	
}


$(document).ready(function() 
{	
    // Hide customize other and warning section
    // Step 1
	//$('#machinery_step1_warning_main').hide();
	
	// Step 2
	//$('#backgroundcolor_other_section').hide();
	//$('#textcolor_other_section').hide();
	
	//$('#warning_main').hide();
	//$('#warning_color').hide();
	
	// Enaable the project / organisation list on the first page	
	$("#feature-side-random-from-org").click(function() { $('#feature-side-organisations').removeAttr("disabled"); });
	$("#feature-side-specific-project").click(function() {	$('#feature-side-organisations').attr("disabled", true); });
	
	$("#project-narrow-random-from-org").click(function() { $('#project-narrow-organisations').removeAttr("disabled"); });
	$("#project-narrow-specific-project").click(function() {	$('#project-narrow-organisations').attr("disabled", true); });
	
	$("#project-updates-random-from-org").click(function() { $('#project-updates-organisations').removeAttr("disabled"); });
	$("#project-updates-specific-project").click(function() {	$('#project-updates-organisations').attr("disabled", true); });
	
	$("#project-contribute-random-from-org").click(function() { $('#project-contribute-organisations').removeAttr("disabled"); });
	$("#project-contribute-specific-project").click(function() {	$('#project-contribute-organisations').attr("disabled", true); });
	
	
	
	// Toggle other selections for the colours		
	$("#backgroundcolor_pulldown").change(function() { 
		if (document.getElementById('backgroundcolor_pulldown').value == 'x') {
			$('#backgroundcolor_other_section').animate({ opacity: "show" }, "slow");			
		} else {
			$('#backgroundcolor_other_section').animate({ opacity: "hide" }, "slow");
		}
	});
	
	$("#textcolor_pulldown").change(function() { 		
		if (document.getElementById('textcolor_pulldown').value == 'x') {
			$('#textcolor_other_section').animate({ opacity: "show" }, "slow");			
		} else {
			$('#textcolor_other_section').animate({ opacity: "hide" }, "slow");
		}		
	});
	
	
});

