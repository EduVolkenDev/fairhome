#!/bin/bash
cd "$(dirname "$0")"

echo "🧹 Parando servidores anteriores..."
pkill -f "next" 2>/dev/null
sleep 1

echo "📦 Fazendo build de produção (aguarde ~1 min)..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build falhou. Verifique os erros acima."
  read -p "Pressione Enter para fechar..."
  exit 1
fi

echo "🚀 Iniciando servidor de produção..."
(sleep 2 && open http://localhost:3000) &
npm run start
