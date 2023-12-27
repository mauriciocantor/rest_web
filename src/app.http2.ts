
import http2 from 'http2';
import * as fs from "fs";

const server = http2.createSecureServer( {
    key: fs.readFileSync('./keys/server.key'),
    cert: fs.readFileSync('./keys/server.crt'),
} ,(req,res)=>{
    console.log(req.url);
    // res.writeHead(200, {'Content-Type': 'text/html'});
    // res.write('<h1>   hola mundo </h1>');

    if(req.url?.includes('/js/')){
        const htmlFile = fs.readFileSync('./public'+req.url,'utf-8');
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        res.end(htmlFile);
    }else if(req.url?.includes('/css/')){
        const htmlFile = fs.readFileSync('./public'+req.url,'utf-8');
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.end(htmlFile);
    }else if(req.url === '/'){
        const htmlFile = fs.readFileSync('./public/index.html','utf-8');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(htmlFile);
        res.end();
    }
});

server.listen(3000, ()=>{
    console.log('Server running 3000');
});