#!/bin/bash
cd "$(dirname "$0")"

echo "🛑 Parando todos os processos Node..."
pkill -9 -f "next" 2>/dev/null
pkill -9 -f "node" 2>/dev/null
sleep 2

echo "🗑️  Limpando .next corrompido..."
rm -rf .next

echo "📦 Reinstalando dependências..."
npm install

echo "🚀 Iniciando servidor limpo..."
(sleep 4 && open http://localhost:3000) &
npm run dev
