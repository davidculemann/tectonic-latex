#!/bin/bash

# Quick Start Script for Tectonic LaTeX Microservice
# This script helps you get the service running quickly

set -e

echo "🚀 Tectonic LaTeX Microservice - Quick Start"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if tectonic is available
if command -v tectonic &> /dev/null; then
    echo "✅ Tectonic found: $(tectonic --version)"
    echo ""
    echo "🎯 Starting service locally..."
    echo "   The service will be available at: http://localhost:5000"
    echo "   Health check: http://localhost:5000/health"
    echo "   Compile endpoint: POST http://localhost:5000/compile"
    echo ""
    echo "Press Ctrl+C to stop the service"
    echo ""
    npm start
else
    echo "⚠️  Tectonic not found locally"
    echo ""
    echo "You have two options:"
    echo ""
    echo "Option 1: Install Tectonic locally"
    echo "   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    echo "   source ~/.cargo/env"
    echo "   cargo install tectonic"
    echo "   Then run this script again"
    echo ""
    echo "Option 2: Use Docker (recommended)"
    echo "   docker-compose up --build"
    echo ""
    echo "Which option would you like to use?"
    echo "1. Install Tectonic locally"
    echo "2. Use Docker"
    echo "3. Exit"
    echo ""
    read -p "Enter your choice (1-3): " choice
    
    case $choice in
        1)
            echo "Installing Rust and Tectonic..."
            curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
            source ~/.cargo/env
            cargo install tectonic
            echo "✅ Tectonic installed successfully!"
            echo "🎯 Starting service..."
            npm start
            ;;
        2)
            echo "Starting with Docker..."
            if command -v docker &> /dev/null; then
                docker-compose up --build
            else
                echo "❌ Docker is not installed. Please install Docker Desktop first."
                exit 1
            fi
            ;;
        3)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid choice. Exiting..."
            exit 1
            ;;
    esac
fi 