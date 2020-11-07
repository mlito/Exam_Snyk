console.log('script loaded');
function loadhandlers() {
	var toggler = document.getElementsByClassName("caret");
	console.log('togler len: '+ toggler.length);
	
	for (let i = 0; i < toggler.length; i++) {
		toggler[i].addEventListener("click", function () {
			console.log(this.className +'clicked');
			this.parentElement.querySelector(".nested").classList.toggle("active");
			this.classList.toggle("caret-down");
		});
	}
}
function handleGetPkg() {
	document.body.style.cursor = 'wait';
	let label = document.getElementById('lblstatus');
	label.textContent = 'Processing ...';
	label.style.color = 'blue';
	let errorLabel = document.getElementById('lblerrormsg');
	errorLabel.textContent = '';
	let txtElem = document.getElementById('txtpkgname');
	let pkgName = txtElem.value;
	let contElelent = document.getElementById('cont');
	if (contElelent) {
		contElelent.innerHTML = '';
	}
	let xhr = new XMLHttpRequest();
	xhr.overrideMimeType("application/json");
	let urlRoSend = '/packages/' + pkgName;
	console.log(urlRoSend);
	xhr.open('GET', urlRoSend, true);
   

	xhr.onreadystatechange = function () {

		if (xhr.readyState == 4 && xhr.status == 200) {
			let jsonData = JSON.parse(xhr.responseText);
			if (!jsonData.error) {
				CreateTreeViewFromJson(jsonData);
				label.textContent = 'Done';
				label.style.color = 'blue';
			}
			else {
				label.textContent = 'Error';
				label.style.color = 'red';
				errorLabel.textContent = (jsonData.message) ? jsonData.message : 'Processing error';
			}
			document.body.style.cursor = 'default';
		}
	};

	xhr.send();
}

function CreateUlTreeView(items, parent) {
	var ul = document.createElement("ul");
	if (parent) {
		parent.appendChild(ul);
		if (parent.id !== 'cont') { 
			ul.className = 'nested';   
		}
	}
	items.forEach(function (x) {
		var li = document.createElement("li");
		var text = document.createElement("span");
		text.innerHTML = x.name;
		li.appendChild(text);
		if (x.dependentItems && x.dependentItems.length > 0) {
			text.className = 'caret';
			CreateUlTreeView(x.dependentItems, li);
		}

		ul.append(li);
	});
	return ul;
}

function CreateTreeViewFromJson(jsonData) {
	console.log(jsonData);
	let items = [jsonData];
	CreateUlTreeView(items, document.getElementById("cont"));
	loadhandlers();
}

function handleLoad() { 
	console.log('Body loaded');
}