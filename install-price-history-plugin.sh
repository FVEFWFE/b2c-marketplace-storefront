#!/bin/bash

# Installation script for Medusa Price History Plugin

echo "🚀 Installing Medusa Price History Plugin..."

# Check if we're in a Medusa project
if [ ! -f "medusa-config.ts" ] && [ ! -f "medusa-config.js" ]; then
    echo "❌ Error: This doesn't appear to be a Medusa project directory."
    echo "Please run this script from your Medusa project root."
    exit 1
fi

# Extract the plugin
echo "📦 Extracting plugin files..."
tar -xzf medusa-price-history-plugin.tar.gz

# Move to plugins directory (create if doesn't exist)
mkdir -p src/plugins
mv medusa-price-history-plugin src/plugins/

# Navigate to plugin directory
cd src/plugins/medusa-price-history-plugin

# Install dependencies
echo "📥 Installing plugin dependencies..."
npm install

# Build the plugin
echo "🔨 Building plugin..."
npm run build

# Return to project root
cd ../../..

echo "✅ Plugin installed successfully!"
echo ""
echo "Next steps:"
echo "1. Add the plugin to your medusa-config.ts:"
echo ""
echo "  plugins: ["
echo "    {"
echo "      resolve: \"./src/plugins/medusa-price-history-plugin\","
echo "      options: {"
echo "        enableAutoUpdate: true,"
echo "        updateInterval: 24,"
echo "        priceConstraints: {"
echo "          minDiscountPercent: 10,"
echo "          maxDiscountPercent: 70,"
echo "          maxDailyChangePercent: 15"
echo "        }"
echo "      }"
echo "    }"
echo "  ]"
echo ""
echo "2. Run migrations: npx medusa db:migrate"
echo "3. Restart your Medusa server"
echo ""
echo "📚 See src/plugins/medusa-price-history-plugin/README.md for full documentation"