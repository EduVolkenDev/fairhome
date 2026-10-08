#!/bin/bash
# ─────────────────────────────────────────────────
#  Casa Justa — Instalador do Protetor de Tela
#  Roda este script no Terminal para instalar e
#  configurar o protetor de tela em 30 segundos.
# ─────────────────────────────────────────────────

set -e

SAVER_DIR="$HOME/Library/Screen Savers"
HTML_PATH="$HOME/casa-justa/screensaver.html"
ZIP_URL="https://github.com/liquidx/webviewscreensaver/releases/download/v2.4/WebViewScreenSaver.zip"
TMP_DIR=$(mktemp -d)

echo ""
echo "🖥  Casa Justa — Instalador do Protetor de Tela"
echo "──────────────────────────────────────────────"
echo ""

# 1. Check HTML file exists
if [ ! -f "$HTML_PATH" ]; then
  echo "❌  Arquivo não encontrado: $HTML_PATH"
  echo "   Certifique-se de que a pasta casa-justa está em ~/casa-justa"
  exit 1
fi
echo "✓  screensaver.html encontrado"

# 2. Create Screen Savers folder if needed
mkdir -p "$SAVER_DIR"

# 3. Download WebViewScreenSaver
echo "⬇  Baixando WebViewScreenSaver v2.4..."
curl -L --progress-bar "$ZIP_URL" -o "$TMP_DIR/WebViewScreenSaver.zip"

if [ ! -s "$TMP_DIR/WebViewScreenSaver.zip" ]; then
  echo "❌  Download falhou. Verifique sua conexão e tente novamente."
  exit 1
fi
echo "✓  Download concluído"

# 4. Extract
echo "📦  Extraindo..."
unzip -q "$TMP_DIR/WebViewScreenSaver.zip" -d "$TMP_DIR/"

# Find the .saver file
SAVER_FILE=$(find "$TMP_DIR" -name "*.saver" | head -1)
if [ -z "$SAVER_FILE" ]; then
  echo "❌  Não foi possível encontrar o arquivo .saver no zip."
  exit 1
fi
echo "✓  Arquivo .saver encontrado: $(basename $SAVER_FILE)"

# 5. Install (copy to Screen Savers folder)
DEST="$SAVER_DIR/$(basename $SAVER_FILE)"
rm -rf "$DEST"
cp -r "$SAVER_FILE" "$DEST"
echo "✓  Instalado em: $DEST"

# 6. Configure WebViewScreenSaver to use our HTML file
BUNDLE_ID="com.liquidx.WebViewScreenSaver"
defaults write "$BUNDLE_ID" url "file://$HTML_PATH" 2>/dev/null || true
echo "✓  URL configurada: file://$HTML_PATH"

# 7. Set as active screensaver
defaults write com.apple.screensaver moduleDict -dict \
  moduleName "WebViewScreenSaver" \
  path "$DEST" \
  type 0
echo "✓  WebViewScreenSaver definido como protetor ativo"

# 8. Cleanup
rm -rf "$TMP_DIR"

echo ""
echo "────────────────────────────────────────────────────"
echo "✅  Instalação concluída!"
echo ""
echo "Próximos passos (1 minuto):"
echo "  1. Abra: Ajustes do Sistema → Protetor de Tela"
echo "     (WebViewScreenSaver já deve estar selecionado)"
echo ""
echo "  2. Abra: Ajustes do Sistema → Tela de Bloqueio"
echo "     Ative: 'Exigir senha após início do protetor de tela'"
echo "     Defina: 'Imediatamente' ou '5 segundos'"
echo ""
echo "  Para testar agora, rode:"
echo "  open -a ScreenSaverEngine"
echo "────────────────────────────────────────────────────"
echo ""
