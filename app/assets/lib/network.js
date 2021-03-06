var requestQueue = [];
var inProcess = false;

var addRequest = function (_url, _username, _password, _callback, _isJSON, _filename){
	
	var r = {};
	r.url = _url;
	r.username = _username;
	r.password = _password;
	r.callback = _callback;
	r.isJSON = _isJSON;
	r.filename = _filename;
	
	requestQueue.push(r);
	processQueue();
	//Ti.API.log('Added request for ' + _url + '. Number of pending requests: ' + requestQueue.length);
};

var processQueue = function(){
	if (!inProcess && requestQueue.length > 0){
		inProcess = !inProcess;
		var request = requestQueue.shift();
		
		createRequest(request.url, request.username, request.password, request.callback, request.isJSON, request.filename);
		//Ti.API.log('process request for ' +request.url + '. Number of pending requests: ' + requestQueue.length);
	} else{
		//Ti.API.log('processQueue: no elements to process');
	}
};

var createRequest = function(_url, _username, _password, callback, _isJSON, _filename){
	Ti.API.info("CreateRequest for " + _url);
    var xhr = Ti.Network.createHTTPClient({
    	username : _username,
    	password : _password,
    	onload : function() {
        	if(_isJSON){
        		//Ti.API.log(this.responseText);
        	}
        
        	if (callback){        		
        		callback(this, _filename, _url);
        	}
    	},
    	onerror:function(e) {
        	Ti.API.log("getSPFile ERROR " + e.error);
    	},
    	onreadystatechange: function(e) {
			switch(this.readyState) {
				case 0:
					// after HTTPClient declared, prior to open()
					// though Ti won't actually report on this readyState
					Ti.API.info('case 0, readyState = '+this.readyState);
				break;
				case 1:
					// open() has been called, now is the time to set headers
					Ti.API.info('case 1, readyState = '+this.readyState);
				break;
				case 2:
					// headers received, xhr.status should be available now
					Ti.API.info('case 2, readyState = '+this.readyState);
				break;
				case 3:
					// data is being received, onsendstream/ondatastream being called now
					Ti.API.info('case 3, readyState = '+this.readyState);
				break;
				case 4:
					// done, onload or onerror should be called now
					Ti.API.info('case 4, readyState = '+this.readyState);
					inProcess = !inProcess;
					processQueue();
				break;
			}
		},
    });
    
    xhr.open("GET", _url);
    
    if (_isJSON){
    	xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    	xhr.setRequestHeader("Accept", "application/json;odata=verbose");
    }
    
    xhr.send();
    Ti.API.info("out createRequest");	
};

exports.addRequest = addRequest;
exports.createRequest = createRequest;
