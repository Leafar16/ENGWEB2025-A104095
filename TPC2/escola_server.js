import { createServer } from 'http';
import axios from 'axios';
import { homePage, alunosPage,cursosPage,instrumentosPage ,alunoSingPage} from './mypages.js';
import { readFile } from 'fs'

createServer(async (req, res) => {
    console.log("Method: " + req.method + " URL: " + req.url);
    if (req.url == "/") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(homePage());
        res.end();

    } else if (req.url == "/alunos") {
        axios.get("http://localhost:3000/alunos")
            .then((resp) => {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(alunosPage(resp.data));
                res.end();
            });
            
    } else if (req.url == "/cursos") {
            axios.get("http://localhost:3000/cursos")
                .then((resp) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(cursosPage(resp.data));
                    res.end();
                });
    }else if (req.url.match(/w3\.css$/)){
        readFile("w3.css",function(erro,dados){
            if(erro){
                res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
                res.end('<p>Erro na leitura do ficheiro: ' + erro + '</p>')
    
            }else{
                res.writeHead(200,{"Content-Type":"text/css"});
                res.write(dados);
                res.end();
            }
        })

    }else if(req.url=="/instrumentos"){
        axios.get("http://localhost:3000/instrumentos")
        .then((resp)=>{
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write(instrumentosPage(resp.data));
            res.end();
        })
    }else if(req.url.match(/\/instrumentos\/[a-zA-Z0-9]+$/)){
        var id=req.url.split("/")[2];
        var alunos=await axios.get(`http://localhost:3000/alunos?instrumento=${id}`);
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write(alunosPage(alunos.data));
        res.end();
    }else if(req.url.match(/\/cursos\/[a-zA-Z0-9]+$/)){
            var id=req.url.split("/")[2];
            var alunos=await axios.get(`http://localhost:3000/alunos?curso=${id}`);
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write(alunosPage(alunos.data));
            res.end();
           
    }else if(req.url.match(/\/alunos\/[a-zA-Z0-9]+$/)){
        var id=req.url.split("/")[2];
        var alunos=await axios.get(`http://localhost:3000/alunos?id=${id}`);
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write(alunoSingPage(alunos.data));
        res.end();

    }else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write("404 Not Found");
        res.end();
    }
}).listen(1234);

console.log("Server running at http://localhost:1234/");