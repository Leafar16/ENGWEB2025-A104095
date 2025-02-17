# TPC1

## Identificação
**Autor:** Rafael Pereira
**Nº:** 104095  
**Foto**:![Rafael Pereira](../rafael.jpeg)

## Propósito 
Esta pasta serve para armazenar o TPC1 de Engenharia Web, que decorreu na semana de 10 a 17 de fevereiro de 2025.

## Resumo
- Este trabalho consiste em construir um serviço em nodejs, que consuma a API de dados servida pelo json-server da oficina de reparações e responda com as páginas web do site.

# Método de Resolução (Resumo)

O código implementa um **servidor HTTP em Node.js** que responde a requisições `GET`, fornecendo dados sobre **reparações, carros e intervenções**. Ele segue os seguintes passos:

1. **Criação do Servidor:**  
   - Utiliza `http.createServer()` para processar requisições na porta `1234`.

2. **Requisição de Dados:**  
   - Usa `axios.get()` para buscar informações da API (`http://localhost:3000/reparacoes`).

3. **Rotas Disponíveis:**
   - **`/reparacoes`** → Lista todas as reparações com detalhes do cliente e viatura.
   - **`/carros`** → Exibe uma lista única de modelos de carros das reparações.
   - **`/intervencoes`** → Mostra uma lista ordenada de todos os tipos intervenções.
   - **Página Inicial (`/`)** → Exibe links para as rotas disponíveis.

4. **Tratamento de Erros:**
   - Retorna **erro 500** caso a requisição à API falhe.

5. **Envio de Resposta:**  
   - Os dados são formatados em **HTML** e enviados ao cliente.


## Ficheiros
- [Código-fonte](tpc1.js)
- [Exemplo de entrada](dataset_reparacoes.json)

## Como executar?
- Executar o comando "json-server -w dataset_reparacoes.json"
- De seguida executar o ficheiro "tpc1.js"
- Aceder ao url "http://localhost:1234"
