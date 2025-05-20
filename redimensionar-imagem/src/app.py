# importar bibliotecas (flask, os, PIL, BytesIO, CORS)
from flask import Flask, request, send_file
from io import BytesIO
from flask_cors import CORS

# importar biblioteca PIL
from PIL import Image

# Definir app flask
app = Flask(__name__)
CORS(app)

# Definir rota para redimensionar imagem
@app.route('/redimensionar', methods=['POST'])

def redimensionar():
    # Obter arquivo da requisição
    arquivo = request.files['imagem']
    
    # Obter largura e altura da requisição
    largura = int(request.form['largura'])
    altura = int(request.form['altura'])

    # Abrir imagem com PIL
    imagem = Image.open(arquivo)

    # Redimensionar imagem
    imagem_redimensionada = imagem.resize((largura, altura))

    # Salvar imagem em memória
    img_io = BytesIO()
    imagem_redimensionada.save(img_io, 'JPEG')
    img_io.seek(0)
    
    # Retornar imagem redimensionada
    return send_file(img_io, mimetype='image/jpeg', download_name='imagem_redimensionada.jpg')