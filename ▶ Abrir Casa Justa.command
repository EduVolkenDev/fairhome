#!/bin/bash
cd "$(dirname "$0")"

echo "🧹 Parando servidores anteriores..."
pkill -f "next dev" 2>/dev/null
pkill -f "next-server" 2>/dev/null
sleep 1

echo "🗑️  Limpando cache..."
rm -rf .next/cache

echo "🚀 Iniciando Casa Justa..."
(sleep 3 && open http://localhost:3000) &
npm run dev
