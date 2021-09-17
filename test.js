var http = require('http');

http.createServer(function(request, response) {  
  response.writeHeader(200, {"Content-Type": "text/html"});  
  response.write('hello world');

  response.end();  
}).listen(80);