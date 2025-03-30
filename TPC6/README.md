# TPC6

## Identificação  
**Autor:** Rafael Pereira  
**Nº:** 104095  
**Foto:** ![Rafael Pereira](../rafael.jpeg)  

## Propósito  
Esta pasta contém o TPC6 de Engenharia Web, referente à semana de 24 a 31 de março de 2025.  

O objetivo deste trabalho foi desenvolver um serviço em **Node.js** que consome dados armazenados numa base de dados **MongoDB**, permitindo a gestão de uma lista de contratos e entidades.  

## Implementação  
O servidor foi desenvolvido utilizando as seguintes tecnologias:  
- **Express** (Framework para Node.js)  
- **MongoDB** (Base de dados)  
- **Pug** (Motor de templates para a interface)  

### Passos principais:  
- Configurar a base de dados **MongoDB** para armazenar as informações dos contratos e entidades.  
- Criar os **templates Pug** na pasta `views` da pasta `Contrato` para estruturar a interface.  
- Implementar as **rotas no Express** para manipular os dados da base de dados.  

## Resumo do Sistema  

### 1. **Página Inicial (`paginaInicial.pug`)**  
- Exibe uma **lista de contratos** com informações básicas como ID, objeto, data de celebração, preço contratual, NIPC da entidade comunicante e nome da entidade.  
- O campo **ID do contrato** é um **link para a página de detalhes do contrato**.  
- O campo **NIPC da entidade** é um **link para a página da entidade comunicante**.  

### 2. **Página de Detalhes do Contrato (`/contrato/:id`)**  
- Exibe informações detalhadas sobre um **contrato específico**, com base no ID fornecido na URL.  
- Contém um **link para voltar à página principal**.  

### 3. **Página da Entidade (`/entidade/:id`)**  
- Exibe informações sobre a **entidade comunicante**, incluindo o NIPC e o nome da entidade.  
- Exibe uma **tabela com contratos relacionados a essa entidade**.  
- Exibe o **somatório do valor dos contratos** da entidade.  
- Contém um **link para voltar à página principal**.  


## Estrutura do Código  

### Ficheiros principais:  
- **[`routes/index.js`](./Contrato/routes/contrato.js)** → Define as **rotas** para a aplicação.  
- **[`views/`](./Contrato/views/)** → Contém os templates em **Pug**.
- **[`API`](./apiContratos)** → Contém a API de dados.


## Como executar?  

1. Abrir **dois terminais**:  
   - Um na pasta `Contrato`  
   - Outro na pasta `apiContratos`  

2. Executar o comando nos dois terminais:  
   ```sh
   npm install

3. Executar o comando nos dois terminais:  
   ```sh
   npm start
