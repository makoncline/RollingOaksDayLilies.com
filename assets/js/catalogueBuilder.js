

let table;
let daylilyList = [];

window.onload = function(){
	table = document.getElementById("daylilyTable").getElementsByTagName("tbody")[0];

	var input = document.getElementById('file'),
	    readFile = function () {
        var reader = new FileReader();
        reader.onload = function () {
            loadListFromCSV(reader.result.split("\r\n"));
        };
        // start reading the file. When it is done, calls the onload event defined above.
        reader.readAsBinaryString(input.files[0]);
    };
	input.addEventListener('change', readFile);
	
	console.log(table);
	if (localStorage.savedDaylilyList){
		daylilyList = JSON.parse(localStorage.savedDaylilyList);
	}
	updateView();
};

function loadListFromCSV(list){
	console.log(list);
	if(list.length === 0) {
		console.log("no file selected");
	} else {
		list.shift();
		for (var i = 0; i < list.length; i++) {
			add(list[i]);
		}
	}
}

function clearList(){
	localStorage.clear();
	daylilyList = [];
	updateView();
}

function exportList (list) {
	//make the csv
	let csvContent = "data:text/csv;charset=utf-8,Cultivar\r\n";
	csvContent += list.join("\r\n");

	//export the csv
	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	let currentTime = new Date();
	link.setAttribute("download", "daylilyListExport_"+currentTime.getTime()+".csv");
	document.body.appendChild(link); // Required for FF
	link.click();
}

function add(daylily) {
	if (daylilyList.indexOf(daylily) > -1) {
		//alert(daylily + " is already on your list");
		return;
	} else {
		daylilyList.push(daylily);
		daylilyList.sort();
		updateView();
		//alert(daylily + " has been added to your list");
	}
}

function remove(daylily){
	var index = daylilyList.indexOf(daylily);
	if (index > -1){
		daylilyList.splice(index,1);
		updateView();
		//alert(daylily + " has been removed from your list");
	}
}

function saveDaylilyListToLocalStorage(){
	localStorage.savedDaylilyList = JSON.stringify(daylilyList);

}

function updateView() {
	saveDaylilyListToLocalStorage();

	while(table.hasChildNodes()){
		table.removeChild(table.firstChild);
	}
	for (var i = 0; i < daylilyList.length; i++) {
		var row = table.insertRow(table.rows.length);
		var numCell = row.insertCell(0);
		var nameCell = row.insertCell(1);
		var btnCell = row.insertCell(2);
		var num = document.createTextNode(i+1);
		var name = document.createTextNode(daylilyList[i]);

		var btn = document.createElement("BUTTON");
		btn.className = "btn btn-xs btn-danger";
		let daylily = daylilyList[i].toString();
		let funcString = "remove(\""+daylily+"\");";
		btn.setAttribute("onclick", funcString);

		var icon = '<i class="fas fa-trash"></i>';
		// var icon = document.createElement("SPAN");
		// icon.className = "glyphicon glyphicon-remove-sign";
		// icon.innerHTML = "&nbsp";
		// btn.appendChild(icon);
		btn.innerHTML = icon;

		numCell.appendChild(num);
		nameCell.appendChild(name);
		btnCell.appendChild(btn);
	}
}
