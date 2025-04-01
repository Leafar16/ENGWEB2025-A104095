import json
import re

# Função para processar os dados
def process_data(dataset):
    # Para cada item do dataset
    for book in dataset:
        # 1. Listas como strings, vamos corrigir o formato das strings para listas JSON válidas
        book["genres"] = fix_json_string(book["genres"])
        book["characters"] = fix_json_string(book["characters"])
        book["awards"] = fix_json_string(book["awards"])
        book["ratingsByStars"] = fix_json_string(book["ratingsByStars"])
        book["setting"] = fix_json_string(book["setting"])

        # 2. Alterando 'bookId' para '_id'
        book["_id"] = book.pop("bookId")

        # 3. Definindo preço como 0 se vazio
        if book["price"] == "":
            book["price"] = 0

        # 4. Alterando 'pages' para um número inteiro
        pages = book["pages"]
        match = re.match(r"(\d+)\s*pages?", pages)
        if match:
            book["pages"] = int(match.group(1))
        
        # 5. Garantindo que o campo 'author' seja uma lista
        book["author"] = fix_author_field(book["author"])
    
    return dataset

# Função para corrigir o formato da string (substituindo aspas simples por aspas duplas)
def fix_json_string(value):
    if isinstance(value, str):
        # Substituir aspas simples por aspas duplas e garantir que a string seja um JSON válido
        value = value.replace("'", '"')
        try:
            return json.loads(value)  # Converte para lista ou dicionário
        except json.JSONDecodeError:
            return value  # Caso não consiga converter, retorna o valor original (não era uma lista JSON válida)
    return value

# Função para corrigir o campo 'author', garantindo que seja uma lista
def fix_author_field(value):
    if isinstance(value, str):
        # Se for uma string com nomes separados por vírgula, converte para lista
        authors_list = [author.strip() for author in value.split(",")]
        return authors_list
    return value

# Carregar o dataset a partir de um arquivo JSON
def load_dataset(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

# Salvar o dataset processado em um novo arquivo JSON
def save_processed_dataset(file_path, dataset):
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(dataset, file, indent=4)

# Caminho para o seu arquivo dataset.json
input_file_path = 'dataset.json'
output_file_path = 'processed_dataset.json'

# Carregar o dataset original
dataset = load_dataset(input_file_path)

# Processar o dataset
processed_data = process_data(dataset)

# Salvar o dataset processado
save_processed_dataset(output_file_path, processed_data)

print(f"Dataset processado salvo em: {output_file_path}")
