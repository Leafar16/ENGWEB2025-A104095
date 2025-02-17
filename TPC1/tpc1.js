const http = require('http');
const axios = require('axios');

http.createServer((req, res) => {
    switch (req.method) {
        case "GET":
            switch (req.url) {
                case "/reparacoes":
                    axios.get("http://localhost:3000/reparacoes")
                        .then(resp => {
                            var intervencoes = resp.data;
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                            res.write("<h1>Reparações</h1>");
                            res.write("<ul>");
                            intervencoes.forEach(i => {
                                res.write(`<li>
                                    <ul>
                                    <li><b>Nome:</b>${i.nome}</li> 
                                    <li><b>NIF:</b>${i.nif}</li>
                                    <li><b>Data:</b>${i.data}</li>
                                    <li><b>Viatura:</b>${i.viatura.marca} ${i.viatura.modelo} - ${i.viatura.matricula}</li>
                                    <li><b>Nr de intervenções:</b>${i.nr_intervencoes}</li>
                                    `);
                                    res.write("<li><b>Intervenções:</b></li>");
                                    res.write("<ul>");
                                    for(let j=0;j<i.nr_intervencoes;j++){
                                        res.write(`<li>${i.intervencoes[j].codigo} - ${i.intervencoes[j].nome}</li>`);
                                    }
                                    res.write("</ul>");
                                    res.write("</ul></li>");
                            });
                            res.write("</ul>");
                            res.end();
                        })
                        .catch(error => {
                            res.writeHead(500, { 'Content-Type': 'text/html;charset=utf-8' });
                            res.write("<h1>Erro ao obter reparacoes</h1>");
                            res.end();
                        });
                    break;
                case "/carros":
                    axios.get("http://localhost:3000/reparacoes")
                        .then(resp => {
                            var carros = [];
                            var modelos = new Set();
                            var data = resp.data;
                            for (let elem of data) {
                                if (modelos.has(elem.viatura.matricula)) {
                                    continue;
                                }
                                carros.push(elem.viatura);
                                modelos.add(elem.viatura.matricula);
                            }
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                            res.write("<h1>Carros</h1>");
                            res.write("<p>Lista de carros</p><ul>");
                            carros.forEach(i => {
                                res.write(`<li>
                                    <ul>
                                    <li><b>Marca:</b>${i.marca}</li>
                                    <li><b>Modelo:</b>${i.modelo}</li> 
                                    <li><b>Matricula:</b>${i.matricula}<li>
                                    </ul>
                                    </li>`);
                            });
                            res.write("</ul>");
                            res.end();
                        })
                        .catch(error => {
                            res.writeHead(500, { 'Content-Type': 'text/html;charset=utf-8' });
                            res.write("<h1>Erro ao obter carros</h1>");
                            res.end();
                        });
                    break;
                case "/intervencoes":
                    axios.get("http://localhost:3000/reparacoes")
                        .then(resp => {
                            var intervencoes = new Set();
                            var codigos =new Set();
                            var data = resp.data;
                            for (let i of data) {
                                for (let nr = 0; nr < i.nr_intervencoes; nr++) {
                                    if (codigos.has(i.intervencoes[nr].codigo)) {
                                        continue;
                                    }
                                    intervencoes.add(i.intervencoes[nr]);
                                    codigos.add(i.intervencoes[nr].codigo);
                                }
                            }
                            intervencoes = Array.from(intervencoes);
                            intervencoes.sort((a, b) => a.codigo.localeCompare(b.codigo));
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                            res.write("<h1>Intervenções</h1>");
                            intervencoes.forEach(i => {
                                res.write(`<p><b>${i.codigo}</b>- ${i.nome}</p>`);
                            });
                            res.end();
                        })
                        .catch(error => {
                            console.error(error);
                            res.writeHead(500, { 'Content-Type': 'text/html;charset=utf-8' });
                            res.write("<h1>Erro ao obter intervenções</h1>");
                            res.end();
                        });
                    break;
                default:
                    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.write("<div align='center'>");
                    res.write("<h1>Oficina de Reparações</h1>");
                    res.write("<p><a href='/intervencoes'>Intervenções</a></p>");
                    res.write("<p><a href='/carros'>Carros</a></p>");
                    res.write("<p><a href='/reparacoes'>Reparações</a></p>");
                    res.write("</div>");
                    res.end();
                    break;
            }
            break;
        default:
            res.writeHead(405, { 'Content-Type': 'text/html;charset=utf-8' });
            res.write("<h1>Method Not Allowed</h1>");
            res.end();
            break;
    }
}).listen(1234);

console.log('Servidor à escuta na porta 1234...');