
let table;
let daylilyList = [];

window.onload = function(){
	table = document.getElementById("daylilyTable").getElementsByTagName("tbody")[0];
	console.log(table);
	daylilyList.push("Coffee Frenzy");
	updateView();
};

function add(daylily) {
	daylilyList.push(daylily);
	daylilyList.sort();
	updateView();
}

function updateView() {
	for (var i = 0; i < daylilyList.length; i++) {
		var row = table.insertRow(table.rows.length);
		var numCell = row.insertCell(0);
		var nameCell = row.insertCell(1);
		var num = document.createTextNode(i+1);
		var name = document.createTextNode(daylilyList[i]);
		numCell.appendChild(num);
		nameCell.appendChild(name);
	}
}
