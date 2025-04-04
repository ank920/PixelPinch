# PixelPinch - Premium File Compression Tool

A modern web application for lossless compression of PDFs, images, and text files. Built with React, Node.js, and Material-UI.

## Features

- 🎯 Lossless PDF compression using Ghostscript
- 🖼️ High-quality image compression (JPEG, PNG, WebP)
- 📝 Text file minification
- ⚡ Real-time compression progress
- 🎨 Modern, responsive UI with animations
- 🌓 Dark theme
- 📊 Size comparison and statistics

## Tech Stack

- Frontend:
  - React
  - Material-UI
  - Framer Motion
  - React Dropzone

- Backend:
  - Node.js
  - Express
  - Multer
  - Sharp
  - Ghostscript

## Prerequisites

- Node.js >= 14.0.0
- Ghostscript (for PDF compression)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ank920/PixelPinch.git
   cd PixelPinch
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory:
   ```
   PORT=3001
   NODE_ENV=development
   ```

4. Start the development servers:
   ```bash
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend server (from frontend directory)
   npm start
   ```

## Deployment

The application is configured for deployment on Vercel:

1. Fork this repository
2. Sign up on [Vercel](https://vercel.com)
3. Import your forked repository
4. Configure environment variables
5. Deploy!

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 