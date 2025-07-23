# Redimensionar Imagem para Impressão

Este projeto permite redimensionar imagens facilmente para diversos formatos, tanto para web quanto para impressão, usando uma interface React e um backend Flask.

## Funcionalidades

- Upload de imagens (arraste e solte ou clique)
- Seleção de dimensões personalizadas ou predefinidas
- Escolha do formato de saída (JPEG, PNG, WebP)
- Ajuste de qualidade
- Download da imagem redimensionada

## Como rodar localmente

### 1. Clone o repositório

```sh
git clone https://github.com/seu-usuario/redimensionar-imagem-para-impressao.git
cd redimensionar-imagem-para-impressao
```

### 2. Instale as dependências do backend

```sh
cd backend
python -m venv venv
venv\Scripts\activate   # No Windows. No Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
```

### 3. Instale as dependências do frontend

```sh
cd ../frontend
npm install
```

### 4. Execute o backend

No terminal (com o ambiente virtual ativado):

```sh
cd backend
python app.py
```

### 5. Execute o frontend

Abra outro terminal, navegue até a pasta `frontend` e rode:

```sh
cd frontend
npm start
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## Build para produção

Para servir tudo pelo Flask:

1. Gere o build do React:
   ```sh
   cd frontend
   npm run build
   ```
2. Configure o Flask para servir os arquivos estáticos do build.

---

## Licença

MIT
