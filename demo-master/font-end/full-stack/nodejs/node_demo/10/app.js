//����ģ��
var http=require('http')
//��������
var server=http.createServer(function(req,res){
	//�൱��action�������ﶨ��
	//��Ӧͷ
	res.writeHead(200,{'Content-Type':'text/html'});
	//��Ӧ����
	res.write('<h1>Node.js</h1>');
	//������Ӧ
	res.end('<p>PCAT111111111</p>');
//�����˿�
})
server.listen(3000);
server.on('close',function(){
	console.log('server is close');
})
console.log('HTTP server is listening at port 3000.');