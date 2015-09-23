function sendMessageToRider() {
	$(".modal").hide();
	var message = $("#inputMessageRider").val();
	$("#inputMessageRider").val("");
	window.location.href = 'home/sendToAllRiders/'+message;
}

function sendMessageToDriver() {
	$(".modal").hide();
	var message = $("#inputMessage").val();
	$("#inputMessage").val("");
	window.location.href = 'home/sendToAllDrivers/'+message;
}