//rq = require("request-promise")



var removeDriverNum = "";
var editDriverNum = "";
var editDriverName = "";
var editDriverStage = "";
var editDriverPhone = "";

var renewDriverRides = "";
var renewDriverNum = "";



function removeDriverClicked(driverNum) {
  
    
	removeDriverNum = driverNum.replace(/\s/g, '');
	console.log("removeDriverClicked: driverNum = " + removeDriverNum)
	
  document.getElementById(".modal-text").text("Are you sure you want to remove driver " +  removeDriverNum + "?")
}

function removeDriver() {
    // $(".modal-body").html("<div class='spinner-loader'>Loading…</div>");
	//$(".modal-body").html("<p>Driver successfully removed!</p>")
	$(".modal").hide();
	
	window.location.href = 'drivercenter/remove/'+removeDriverNum;
	
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
	window.location.href = "addDriver/";
}

function editDriverClicked(driverNum, driverName, driverAddress, driverPhone){
	editDriverNum = driverNum.replace(/\s/g, '');
	editDriverName = driverName.replace(/\s/g, '');
	editDriverStage = driverStage.replace(/\s/g, '');
	editDriverPhone = driverPhone.replace(/\s/g, '');
	console.log(driverName);
	document.getElementById("inputName").value = editDriverName;
	document.getElementById("inputStage").value = editDriverStage;
	document.getElementById("inputPhone").value = editDriverPhone;
}

function renewDriverClicked(driverRides,driverNum){
	renewDriverRides = driverRides.replace(/\s/g, '');
	renewDriverNum = driverNum.replace(/\s/g, '');

	console.log(renewDriverRides);
}



function editDriver(){
	$("#editmodal").hide();//.modal('hide');
	var name = document.getElementById("inputName").value;
	var phone = document.getElementById("inputPhone").value;
	var stage = document.getElementById("inputStage").value;
	//console.log(name);
	window.location.href = 'drivercenter/edit/'+editDriverNum+'/'+name+'/'+stage+'/'+phone;
}

function renewDriver(){
	$(".modal").hide();//.modal('hide');
	
	var payment_option = document.getElementById("inputPayment").value;
	
	var rides_total = parseInt(payment_option) + parseInt(renewDriverRides)
	
	//console.log(name);
	window.location.href = 'drivercenter/renew/'+renewDriverNum + '/'+rides_total;
}
