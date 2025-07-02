#!/bin/bash

echo "🚀 Building and Testing Virtual UI CLI"
echo "=================================="

# Navigate to CLI directory
cd cli

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building CLI..."
npm run build

echo "🔗 Linking CLI globally for testing..."
npm link

echo "✅ CLI built and linked successfully!"
echo ""
echo "Test commands:"
echo "  virtual-ui --help"
echo "  virtual-ui list"
echo "  virtual-ui init --help"
echo "  virtual-ui add --help"
echo ""
echo "To test in a project:"
echo "  mkdir test-project && cd test-project"
echo "  npm init -y"
echo "  npx create-next-app@latest . --typescript --tailwind --eslint --app"
echo "  virtual-ui init"
echo "  virtual-ui add parallax-card"
echo ""
echo "To unlink when done testing:"
echo "  npm unlink -g virtual-ui" 