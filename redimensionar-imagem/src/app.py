from flask import Flask, request, send_file, send_from_directory
from io import BytesIO
from flask_cors import CORS
from PIL import Image
import os

app = Flask(__name__)
CORS(app)

@app.route('/redimensionar', methods=['POST'])
def redimensionar():
    try:
        arquivo = request.files['imagem']
        largura = int(request.form['largura'])
        altura = int(request.form['altura'])
        if largura <= 0 or altura <= 0:
            return {"erro": "Dimensões inválidas"}, 400

        imagem = Image.open(arquivo)
        imagem_redimensionada = imagem.resize((largura, altura))

        img_io = BytesIO()
        imagem_redimensionada.save(img_io, 'JPEG')
        img_io.seek(0)
        return send_file(img_io, mimetype='image/jpeg', download_name='imagem_redimensionada.jpg')
    except Exception as e:
        return {"erro": str(e)}, 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists("build/" + path):
        return send_from_directory('build', path)
    else:
        return send_from_directory('build', 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
