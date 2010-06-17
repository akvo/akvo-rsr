/*
* For the get a widget pages.
*/

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