import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [imagem, setImagem] = useState(null);
  const [largura, setLargura] = useState('');
  const [altura, setAltura] = useState('');

  function handleSubmit() {
  const formData = new FormData();
  formData.append('imagem', imagem);
  formData.append('largura', largura);
  formData.append('altura', altura);

  fetch('http://localhost:5000/redimensionar', {
    method: 'POST',
    body: formData,
  })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'imagem_redimensionada.jpg';
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch(error => console.error('Erro ao redimensionar:', error));
}


  return (
    <div className="App">
      <header className="App-header">
        <h1>Redimensionar Imagem</h1>

        <img src={logo} className="App-logo" alt="logo" />

        {/* Inserir os arquivos */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagem(e.target.files[0])}
        />

        {/* Inserir a largura */}
        <input
          type="number"
          placeholder="Largura"
          onChange={(e) => setLargura(e.target.value)}
        />

        {/* Inserir a altura */}
        <input
          type="number"
          placeholder="Altura"
          onChange={(e) => setAltura(e.target.value)}
        />

        {/* Botão para redimensionar */}
        <button onClick={handleSubmit}>Redimensionar</button>
      </header>
    </div>
  );
}

export default App;
