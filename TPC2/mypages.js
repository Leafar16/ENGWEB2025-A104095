export function homePage(){
    var pageHTML=`
    <!DOCTYPE html>
    <html>
        <head>
            <title>Home</title>
            <link rel="stylesheet" href="./w3.css">
            <meta charset="UTF-8">
        </head>
        <body >
            <div class="w3-container w3-blue" style="text-align:center">
                <h1>Escola de música</h1>
                <p>Bem-vindo à página inicial.</p>
            </div>
            <div style="text-align:center">
                <ul class="w3-ul w3-border">
                    <li><a href="/alunos">Listar Alunos</a></li>
                    <li><a href="/cursos">Listar Cursos</a></li>
                    <li><a href="/instrumentos">Listar Instrumentos</a></li>
                </ul>
            </div>
            <footer class="w3-container w3-blue" style="text-align:center">
                <p>Desenvolvido na cadeira de Engenharia Web 2025</p>
            </footer>
        </body>
    </html>
            `
    return pageHTML;
}

export function alunosPage(data){
    var pageHTML=`  <!DOCTYPE html>
                <html>
                    <head>
                        <title>Alunos</title>
                        <link rel="stylesheet" href="w3.css">
                        <meta charset="UTF-8">
                    </head>
                <body class="w3-container">
                <h1 class="w3-center">Alunos</h1>
                <table class="w3-table w3-table-all">
                <tr>
                    <th>Nome</th>
                    <th>Curso</th>
                    <th>Ano de Curso</th>
                </tr>
                 `
                for (let aluno of data) {
                    
                   pageHTML+=`
                   <tr>
                   <td><a href="/alunos/${aluno.id}">${aluno.nome}</a></td>
                   <td>${aluno.curso}</td>
                   <td>${aluno.anoCurso}</td>
                   </tr>`;
                }
                pageHTML+=`
                </body>
            </html>
                `
        return pageHTML;
}

export function cursosPage(data){
    var pageHTML=`  <!DOCTYPE html>
                <html>
                    <head>
                        <title>Cursos</title>
                        <meta charset="UTF-8">
                        <link rel="stylesheet" href="w3.css">
                    </head>
                <body class="w3-container">
                <h1 class="w3-center">Cursos</h1>
                <table class="w3-table w3-table-all">
                <tr>
                    <th>Id</th>
                    <th>Designação</th>
                    <th>Duração</th>
                    <th>Id do Instrumento</th>
                    <th>Instrumento</th
                </tr>
                 `
                for (let curso of data) {
                    
                   pageHTML+=`
                   <tr>
                   <td>${curso.id}</td>
                   <td><a href="/cursos/${curso.id}">Designação: ${curso.designacao}</a></td>
                   <td>${curso.duracao}</td>
                   <td>${curso.instrumento.id}</td>
                   <td>${curso.instrumento["#text"]}</td>
                   </tr>`;   
                }
                pageHTML+=`
                </body>
            </html>
                `
        return pageHTML;
}

export function instrumentosPage(data){
    var pageHTML=`  <!DOCTYPE html>
                <html>
                    <head>
                        <title>Instrumentos</title>
                        <meta charset="UTF-8">
                        <link rel="stylesheet" href="w3.css">
                    </head>
                <body class="w3-container">
                <h1 class="w3-center">Instrumentos</h1>
                <table class="w3-table w3-table-all">
                <tr>
                    <th>Id</th>
                    <th>Nome</th
                </tr>
                 `
                for (let instrumento of data) {
                    
                   pageHTML+=`<tr>
                   <td>${instrumento.id}</td>
                    <td><a href="/instrumentos/${instrumento["#text"]}"> ${instrumento["#text"]}</a></td> 
                    </tr>`;    
                }
                pageHTML+=`
                </body>
            </html>
                `
        return pageHTML;
}
export function alunoSingPage(data){
    var pageHTML=`  <!DOCTYPE html>
                <html>
                    <head>
                        <title>Alunos</title>
                        <link rel="stylesheet" href="w3.css">
                        <meta charset="UTF-8">
                    </head>
                <body class="w3-container">
                <h1 class="w3-center">Alunos</h1>
                <table class="w3-table w3-table-all">
                <tr>
                    <th>Id</th>
                    <th>Nome</th>
                    <th>Data de Nascimento</th>
                    <th>Curso</th>
                    <th>Ano de Curso</th>
                    <th>Instrumento</th>
                </tr>
                 `
                for (let aluno of data) {
                    
                   pageHTML+=`
                   <tr>
                   <td>${aluno.id}</td>
                   <td>${aluno.nome}</td>
                   <td>${aluno.dataNasc}</td>
                   <td>${aluno.curso}</td>
                   <td>${aluno.anoCurso}</td>
                   <td>${aluno.instrumento}</td>
                   </tr>`;
                }
                pageHTML+=`
                </body>
            </html>
                `
        return pageHTML;
}