#!/bin/bash

echo "🚀 Setting up Job Application Tracker..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies  
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Copy environment files
echo "📋 Setting up environment files..."
cp server/.env.example server/.env
cp client/.env.local.example client/.env.local

echo "✅ Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Update server/.env with your MongoDB URI"
echo "2. Update client/.env.local with your Google OAuth credentials"
echo "3. Start MongoDB service"
echo "4. Run 'npm run dev' to start both frontend and backend"
echo ""
echo "📚 Check README.md for detailed setup instructions"