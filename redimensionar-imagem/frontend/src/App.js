import './App.css';
import { useState } from 'react';

function App() {
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [largura, setLargura] = useState('');
  const [altura, setAltura] = useState('');
  const [formato, setFormato] = useState('jpeg');
  const [qualidade, setQualidade] = useState(90);
  const [proporcional, setProporcional] = useState(true);
  const [loading, setLoading] = useState(false);

  const presets = [
    { grupo: 'Web', nome: 'Web Standard', largura: 1920, altura: 1080 },
    { grupo: 'Web', nome: 'HD', largura: 1280, altura: 720 },
    { grupo: 'Web', nome: 'Miniatura', largura: 200, altura: 200 },
    { grupo: 'Redes Sociais', nome: 'Instagram Post', largura: 1080, altura: 1080 },
    { grupo: 'Redes Sociais', nome: 'Facebook Post', largura: 1200, altura: 630 },
    { grupo: 'Redes Sociais', nome: 'Facebook Cover', largura: 820, altura: 312 },
    { grupo: 'Redes Sociais', nome: 'LinkedIn Banner', largura: 1584, altura: 396 },
    { grupo: 'Impressão', nome: 'A4', largura: 2480, altura: 3508 },
    { grupo: 'Impressão', nome: 'Foto 10x15', largura: 1200, altura: 1800 },
  ];

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    setImagem(file);
    setPreview(URL.createObjectURL(file));
  };

  const aplicarPreset = (preset) => {
    setLargura(preset.largura);
    setAltura(preset.altura);
  };

  const handlePresetChange = (e) => {
    const selected = presets.find(p => `${p.grupo}-${p.nome}` === e.target.value);
    if (selected) aplicarPreset(selected);
  };

  const handleRedimensionar = () => {
    if (!imagem || !largura || !altura) {
      alert('Selecione uma imagem e defina largura e altura.');
      return;
    }
    setLoading(true);
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
        setPreview(url);
      })
      .finally(() => setLoading(false));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = preview;
    link.download = `imagem_redimensionada.${formato}`;
    link.click();
  };

  const handlePagamento = async () => {
    const pref = await criarPagamento('Redimensionamento de Imagem', 10.0);
    window.open(pref.init_point, '_blank');
  };

  return (
    <div className="container">
      <h1>Redimensionador de Imagens</h1>
      <div className="main-content">
        <div className="upload-area">
          {!preview ? (
            <label className="upload-box">
              <p>Arraste e solte ou clique para upload</p>
              <input type="file" accept="image/*" onChange={handleImagemChange} hidden />
            </label>
          ) : (
            <img src={preview} alt="Preview" className="preview" />
          )}
        </div>

        <div className="sidebar">
          <h2>Configurações</h2>

          {/* Dimensões */}
          <label className="dimension-label">Dimensões (px)</label>
          <div className="dimension-column">
            <input
              type="number"
              placeholder="Largura (px)"
              value={largura}
              onChange={(e) => setLargura(e.target.value)}
              className="dimension-input"
            />
            <input
              type="number"
              placeholder="Altura (px)"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              className="dimension-input"
            />
          </div>

          {/* Predefinições */}
          <label className="preset-label">Tamanhos Predefinidos</label>
          <select
            onChange={handlePresetChange}
            defaultValue=""
            style={{
              width: '100%',
              padding: '10px 12px',
              marginTop: '8px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              backgroundColor: '#f1f1f1',
              fontSize: '0.9rem'
            }}
          >
            <option value="">Selecione um tamanho...</option>
            {['Web', 'Redes Sociais', 'Impressão'].map(grupo => (
              <optgroup key={grupo} label={grupo}>
                {presets
                  .filter(p => p.grupo === grupo)
                  .map(preset => (
                    <option
                      key={`${preset.grupo}-${preset.nome}`}
                      value={`${preset.grupo}-${preset.nome}`}
                    >
                      {preset.nome} ({preset.largura}×{preset.altura}px)
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>

          {/* Formato */}
          <label className="format-label">Formato de Saída</label>
          <div className="format-buttons">
            <button
              onClick={() => setFormato('jpeg')}
              style={{
                marginRight: '10px',
                padding: '8px 14px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                background: '#f1f1f1',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              JPEG
            </button>
            <button
              onClick={() => setFormato('png')}
              style={{
                marginRight: '10px',
                padding: '8px 14px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                background: '#f1f1f1',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              PNG
            </button>
            <button
              onClick={() => setFormato('webp')}
              style={{
                marginRight: '10px',
                padding: '8px 14px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                background: '#f1f1f1',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              WebP
            </button>
          </div>

          {/* Qualidade */}
          <div className="qualidade">
            <label>Qualidade: {qualidade}%</label>
            <input
              type="range"
              min="10"
              max="100"
              value={qualidade}
              onChange={(e) => setQualidade(e.target.value)}
              className="custom-slider"
            />
          </div>

          {/* Ações */}
          <button
            onClick={handleRedimensionar}
            className="redimensionar"
            disabled={loading}
          >
            {loading ? 'Processando...' : 'Redimensionar'}
          </button>

          <button className="baixar" onClick={handleDownload}>
            Baixar
            <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginLeft: 8 }}>
              download
            </span>
          </button>

          <button className="pagar" onClick={handlePagamento}>
            Pagar com Mercado Pago
            <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginLeft: 8 }}>
              payment
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Exemplo em src/App.js ou em um arquivo utils/api.js
async function criarPagamento(titulo, valor) {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/criar-pagamento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, valor })
    });

    if (!response.ok) throw new Error('Erro ao criar pagamento');

    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao iniciar pagamento.');
    return {};
  }
}

export default App;
