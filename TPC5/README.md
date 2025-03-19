# TPC5

## Identificação  
**Autor:** Rafael Pereira  
**Nº:** 104095  
**Foto:** ![Rafael Pereira](../rafael.jpeg)  

## Propósito  
Esta pasta contém o TPC5 de Engenharia Web, referente à semana de 17 a 24 de março de 2025.  

O objetivo deste trabalho foi desenvolver um serviço em **Node.js** que consome dados armazenados numa base de dados **MongoDB**, permitindo a gestão de uma lista de alunos.  

## Implementação  
O servidor foi desenvolvido utilizando as seguintes tecnologias:  
- **Express** (Framework para Node.js)  
- **MongoDB** (Base de dados)  
- **Pug** (Motor de templates para a interface)  

### Passos principais:  
- Configurar a base de dados **MongoDB** para armazenar as informações dos alunos.  
- Criar os **templates Pug** na pasta `views` para estruturar a interface.  
- Implementar as **rotas no Express** para manipular os dados da base de dados.  

## Resumo do Sistema  

### 1. **Página de Lista de Alunos (`AlunosList.pug`)**  
- Apresenta uma **tabela com ID, Nome e GitHub** dos alunos.  
- Cada nome é um **link para a página do aluno**.  
- Inclui botões para **editar** e **eliminar** alunos.  

### 2. **Página de Detalhes do Aluno (`/:id`)**  
- Apresenta as informações detalhadas do aluno.  
- Exibe a lista de **TPCs completos**.  

### 3. **Página de Edição (`/edit/:id`)**  
- Formulário para **editar os dados** de um aluno.  
- Permite modificar o **nome, link do GitHub e estado dos TPCs**.  

### 4. **Página de Criação de Novo Aluno (`/new`)**  
- Formulário para **adicionar um novo aluno** à base de dados.  

### 5. **Função de Remoção (`/delete/:id`)**  
- Elimina um aluno permanentemente da base de dados.  

## Estrutura do Código  

### Ficheiros principais:  
- **[`alunos.js`](./alunos.js)** → Define as **rotas** para manipular os alunos.  
- **[`views/`](./views/)** → Contém os templates em **Pug**.  

## Como executar?  

1. Abrir **dois terminais**:  
   - Um na pasta `app`  
   - Outro na pasta `apiAlunos/apiAlunos`  

2. Executar o comando nos dois terminais:  
   ```sh
   npm start

3. Acessar a [http](http://localhost:1406)
