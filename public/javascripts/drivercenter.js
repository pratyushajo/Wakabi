//rq = require("request-promise")



var removeDriverNum = ""

function removeDriverClicked(driverNum) {
  
    
	removeDriverNum = driverNum.replace(/\s/g, '');
	console.log("removeDriverClicked: driverNum = " + removeDriverNum)
	
  $(".modal-text").text("Are you sure you want to remove driver " +  removeDriverNum + "?")
}

function removeDriver() {
    // $(".modal-body").html("<div class='spinner-loader'>Loading…</div>");
	//$(".modal-body").html("<p>Driver successfully removed!</p>")
	$(".modal").hide();
	
	window.location.href = 'http://wakabi2.herokuapp.com/drivercenter/remove/'+removeDriverNum
	
 // var url = 'http://wakabi2.herokuapp.com/drivercenter/remove?driver' +removeDriverNum

   //NOT WORKING YET
  //rq(url).then(function (response) {
  //   console.log("driver removed!!")
  //   $(".modal-body").html("<p>Driver successfully removed!</p>")
  // }).catch(
  //   console.log("driver not removed!!"))
     //$(".modal-body").html("<p>Error</p>"))
}

function addDriver(){
}

function editDriver(){
}
