# TPC2

## Identificação
**Autor:** Rafael Pereira
**Nº:** 104095  
**Foto**:![Rafael Pereira](../rafael.jpeg)

## Propósito 
Esta pasta serve para armazenar o TPC2 de Engenharia Web, que decorreu na semana de 17 a 24 de fevereiro de 2025.


Este serviço em Node.js irá consumir a API de dados fornecida pelo `json-server` da escola de música, implementada na segunda aula teórica, e disponibilizar um website com as seguintes características.

## Requisitos

- **Página Principal**: Apresenta listas de alunos, cursos e instrumentos.
- **Página de Alunos**: Exibe uma tabela com informações sobre os alunos. Ao clicar numa linha, o usuário é redirecionado para a página específica do aluno.
- **Página de Cursos**: Exibe uma tabela com as informações dos cursos. Ao clicar numa linha, o usuário é redirecionado para a página do curso, onde é exibida uma lista de alunos matriculados no curso.
- **Página de Instrumentos**: Exibe uma tabela com as informações dos instrumentos. Ao clicar numa linha, o usuário é redirecionado para a página do instrumento, onde é exibida uma lista de alunos que tocam aquele instrumento.

## Resumo do Sistema

1. **Página Inicial**:
    - Apresenta links ou botões para navegar para as páginas de alunos, cursos e instrumentos.

2. **Página de Aluno**:
    - Exibe os dados de um aluno específico, como nome, idade, instrumentos que toca, cursos em que está matriculado, etc.

3. **Página de Curso**:
    - Exibe os dados de um curso específico, como nome do curso, descrição, carga horária, e uma lista dos alunos matriculados.

4. **Página de Instrumento**:
    - Exibe os dados de um instrumento específico, como nome, tipo de instrumento, e uma lista de alunos que tocam esse instrumento.

## Estrutura do Código
### escola_server.js
1. **Imports**:
    - **`createServer`**: Usado para criar o servidor HTTP.
    - **`axios`**: Biblioteca para realizar requisições HTTP e obter dados da API.
    - **`homePage`, `alunosPage`, `cursosPage`, `instrumentosPage`, `alunoSingPage`**: Funções que retornam o HTML das páginas, importadas de outro arquivo (`mypages.js`).
    - **`readFile`**: Usado para ler arquivos locais, como o CSS.

2. **Configuração do Servidor**:
    - O servidor é configurado para responder a diferentes rotas HTTP:
        - **`/`**: Exibe a página principal (homePage).
        - **`/alunos`**: Exibe a lista de alunos, obtida da API.
        - **`/cursos`**: Exibe a lista de cursos, obtida da API.
        - **`/instrumentos`**: Exibe a lista de instrumentos, obtida da API.
        - **CSS (`/w3.css`)**: Lê e serve o arquivo `w3.css` para estilizar as páginas.
        - **Roteamento Dinâmico**:
            - **`/instrumentos/***`**: Exibe a lista de alunos que tocam um instrumento específico.
            - **`/cursos/***`**: Exibe a lista de alunos matriculados em um curso específico.
            - **`/alunos/***`**: Exibe as informações detalhadas de um aluno específico.
          
***->identifcador da página(pode ser o id,nome...)

3. **Tratamento de Erros**:
    - Se o arquivo CSS (`w3.css`) não puder ser lido, é retornada uma mensagem de erro.
    - Para rotas que não correspondem a nenhum dos padrões definidos, o servidor retorna um erro 404.
  

## Ficheiros
- [Código-fonte](escola_server.js)
- [Páginas](mypages.js)
- [Ficheiro JSON](db.json)

## Como executar?
- Executar o comando "json-server -w bd.json"
- De seguida executar "node escola_server.js"
- Aceder ao url "http://localhost:1234"
