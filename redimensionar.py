from PIL import Image

def redimensionar_imagem(input_path, output_path, largura_cm, altura_cm, dpi=300):
    # Conversão de centímetros para polegadas
    cm_para_polegada = 0.393701
    largura_pol = largura_cm * cm_para_polegada
    altura_pol = altura_cm * cm_para_polegada

    # Tamanho em pixels
    largura_px = int(largura_pol * dpi)
    altura_px = int(altura_pol * dpi)

    # Abrir imagem
    imagem = Image.open(input_path)

    # Redimensionar
    imagem_redimensionada = imagem.resize((largura_px, altura_px), Image.Resampling.LANCZOS)

    # Salvar com 300 DPI
    imagem_redimensionada.save(output_path, dpi=(dpi, dpi))

    print(f"Imagem salva como '{output_path}' com tamanho {largura_cm}x{altura_cm} cm a {dpi} DPI.")

# Exemplo de uso
if __name__ == "__main__":
    caminho_entrada = "EXPO_DPT.jpg"
    caminho_saida = "EXPO_DPT_11x9.3cm_300dpi.jpg"
    redimensionar_imagem(caminho_entrada, caminho_saida, largura_cm=11, altura_cm=9.3)
