/*
Akvo RSR is covered by the GNU Affero General Public License, see more details in the license.txt file located at the root folder of the Akvo RSR module. 
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html
*/

function getQueryVariable(variable) 
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) 
    {
        var pair = vars[i].split("=");
        if (pair[0] == variable) 
        {
            return pair[1];
        }
    } 
}

function URLDecode(encodedString) 
{
  var regExp = /\+/g;
  return unescape(String(encodedString).replace(regExp, " ")); 
}

function setAmount()
{
	var amountValue = getQueryVariable('amount');

	if (amountValue)
	{
		var amountTxt = document.getElementById('id_amount');
		amountTxt.value = amountValue;
	}
}

function setName()
{
	var nameValue = getQueryVariable('name');

	if (nameValue)
	{
		var nameTxt = document.getElementById('id_name');
		nameTxt.value = unescape(URLDecode(nameValue));
	}
}

function setEmail() 
{ 
    var emailValue = getQueryVariable('email');
    
    if (emailValue) 
    {
        var emailTxt = document.getElementById('id_email');
        var email2Txt = document.getElementById('id_email2');
        emailTxt.value = unescape(URLDecode(emailValue));
        email2Txt.value = unescape(URLDecode(emailValue));
    }
}

$(document).ready(function() 
{	
    // Hide customize other and warning section
    //$('#paypal_donate_warning_main').hide();
    
	//$('#warning_main').hide();
	//$('#warning_color').hide();

	setName();
	setEmail();
	setAmount();
});




