$("document").ready(function () {
	$("button.chooseColor").click(function(){
		  $("#container").toggleClass("darkBG lightBG");
		  return false;
 		});
	$("button.changeStatus").click(function(){
		  $(".projectStatus, .pbar").toggleClass("shown hidden");
		  
		})
	})
