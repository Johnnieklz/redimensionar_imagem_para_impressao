# Importa as bibliotecas necessárias
from flask import Flask, request, send_file, send_from_directory  # Flask para API e envio de arquivos
from io import BytesIO  # Para manipular arquivos em memória
from flask_cors import CORS  # Para permitir chamadas de outros domínios (CORS)
from PIL import Image  # Biblioteca para manipular imagens
import os  # Para acesso a variáveis de ambiente e caminhos de arquivos
import mercadopago  # SDK oficial do Mercado Pago
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# Cria a aplicação Flask
app = Flask(__name__)

# Habilita o CORS (Cross-Origin Resource Sharing), necessário para comunicação com o frontend
CORS(app)

# Inicializa o SDK do Mercado Pago com o token de acesso obtido da variável de ambiente
sdk = mercadopago.SDK(os.environ.get("MERCADO_PAGO_ACCESS_TOKEN"))

# Rota para redimensionar uma imagem enviada via formulário
@app.route('/redimensionar', methods=['POST'])
def redimensionar():
    try:
        # Pega o arquivo enviado com o campo 'imagem'
        arquivo = request.files['imagem']

        # Obtém largura e altura desejadas, convertendo para inteiro
        largura = int(request.form['largura'])
        altura = int(request.form['altura'])

        # Verifica se os valores são válidos
        if largura <= 0 or altura <= 0:
            return {"erro": "Dimensões inválidas"}, 400

        # Abre a imagem usando a biblioteca PIL
        imagem = Image.open(arquivo)

        # Redimensiona a imagem para as novas dimensões
        imagem_redimensionada = imagem.resize((largura, altura))

        # Cria um objeto em memória para armazenar a imagem
        img_io = BytesIO()

        # Salva a imagem no formato JPEG dentro do objeto em memória
        imagem_redimensionada.save(img_io, 'JPEG')
        img_io.seek(0)  # Volta ao início do buffer

        # Retorna a imagem como resposta para download
        return send_file(
            img_io,
            mimetype='image/jpeg',
            download_name='imagem_redimensionada.jpg'
        )

    except Exception as e:
        # Retorna erro genérico com a mensagem da exceção
        return {"erro": str(e)}, 500

# Rota para criar um pagamento com o Mercado Pago
@app.route('/criar-pagamento', methods=['POST'])
def criar_pagamento():
    # Lê os dados enviados em JSON
    dados = request.json

    # Cria os dados da preferência de pagamento
    preference_data = {
        "items": [
            {
                "title": dados.get("titulo", "Produto"),  # Nome do produto (ou "Produto" se não enviado)
                "quantity": 1,  # Quantidade fixa como 1
                "currency_id": "BRL",  # Moeda brasileira
                "unit_price": float(dados.get("valor", 10.0))  # Valor do produto (ou 10.0 padrão)
            }
        ]
    }

    # Cria a preferência usando o SDK
    preference_response = sdk.preference().create(preference_data)

    # Retorna a resposta da API do Mercado Pago (inclui ID, links, etc.)
    return preference_response["response"]

# Rota para servir os arquivos estáticos do frontend (React ou outro) a partir da pasta build
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    # Se o arquivo solicitado existir na pasta build, retorna ele
    if path != "" and os.path.exists("build/" + path):
        return send_from_directory('build', path)
    else:
        # Se não existir, retorna o index.html (para aplicações SPA como React)
        return send_from_directory('build', 'index.html')

# Inicia o servidor local em modo debug
if __name__ == '__main__':
    app.run(debug=True)
