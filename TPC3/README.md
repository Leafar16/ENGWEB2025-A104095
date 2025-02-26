
# TPC2

## Identificação
**Autor:** Rafael Pereira
**Nº:** 104095  
**Foto**:![Rafael Pereira](../rafael.jpeg)

## Propósito 
Esta pasta serve para armazenar o TPC3 de Engenharia Web, que decorreu na semana de 24 de fevereiro a 3 de março de 2025.

## Requisitos
**Era necessário o serviço ter:**

- **Página Principal**: Apresenta listas de alunos.
- **Página de Alunos**: Exibe uma tabela com informações sobre os alunos. Ao clicar numa linha, o usuário é redirecionado para a página específica do aluno.
- **Página de Registo de Aluno**: Permite adicionar um novo aluno ao sistema.
- **Página de Edição de Aluno**: Permite editar informações de um aluno existente.
- **Página de Eliminação de Aluno**: Permite eliminar um aluno do sistema.

## Resumo do Sistema

### 1. Página Inicial (`/alunos`)
- Apresenta uma lista de alunos com as seguintes colunas: ID, Nome, GitHub e Ações.
- Permite adicionar um novo aluno.

### 2. Página de Aluno (`/alunos/:id`)
- Exibe os detalhes de um aluno específico, incluindo ID, Nome e GitHub.

### 3. Página de Registo de Aluno (`/alunos/registo`)
- Contém um formulário para adicionar um novo aluno ao sistema.

### 4. Página de Edição de Aluno (`/alunos/edit/:id`)
- Permite editar informações de um aluno existente.

### 5. Página de Eliminação de Aluno (`/alunos/delete/:id`)
- Remove um aluno do sistema.

## Estrutura do Código

### [`alunos_server.js`](./alunos_server_skeleton.js)
1. **Imports**:
    - `http`: Para criar o servidor HTTP.
    - `axios`: Para realizar requisições HTTP e obter dados da API.
    - `querystring`: Para processar dados de formulários.
    - [`templates.js`](./templates.js): Contém funções para gerar as páginas HTML.
    - `static.js`: Para servir ficheiros estáticos.

2. **Configuração do Servidor**:
    - Responde a diferentes rotas HTTP:
        - **`/alunos`**: Lista de alunos, obtida da API.
        - **`/alunos/:id`**: Página de detalhes de um aluno.
        - **`/alunos/registo`**: Página de registo de aluno.
        - **`/alunos/edit/:id`**: Página de edição de aluno.
        - **`/alunos/delete/:id`**: Elimina um aluno.

3. **Tratamento de Erros**:
    - Retorna mensagens de erro adequadas para requisições inválidas.

---

### [`templates.js`](./templates.js)
- Contém funções que geram as páginas HTML para:
    - **Lista de alunos (`studentsListPage`)**
    - **Formulário de registo de aluno (`studentFormPage`)**
    - **Formulário de edição de aluno (`studentFormEditPage`)**
    - **Página de um aluno (`studentPage`)**
    - **Página de erro (`errorPage`)**

---

### [`alunos.json`](./alunos.json)
- Contém os dados dos alunos, incluindo:
    - ID
    - Nome
    - Link do GitHub
    - Trabalhos de casa (TPCs) entregues

---

## Como executar?
1. Executar o comando:
   ```sh
   json-server -w alunos.json
   ```
2. De seguida, executar:
   ```sh
   node alunos_server.js
   ```
3. Aceder ao URL:
   ```
   http://localhost:7777/alunos
   ```

---

