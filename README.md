# PixelPinch: Premium File Compression Tool 🚀

<div align="center">

![PixelPinch Banner](https://raw.githubusercontent.com/ank920/PixelPinch/main/banner.png)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fank920%2FPixelPinch)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> 🚀 A premium file compression tool with a beautiful UI and powerful features

[Demo](https://pixelpinch.vercel.app) · [Report Bug](https://github.com/ank920/PixelPinch/issues) · [Request Feature](https://github.com/ank920/PixelPinch/issues)

</div>

## 🌟 Features

- 📄 Lossless PDF compression using Ghostscript
- 🖼️ High-quality image compression with Sharp
- 🎨 Modern, responsive dark theme UI
- 📱 Drag-and-drop file upload interface
- ⚡ Real-time compression progress
- 📊 File size comparison
- 🔒 Secure file handling

## 🎥 Demo & Screenshots

<div align="center">
<img src="https://raw.githubusercontent.com/ank920/PixelPinch/main/demo.gif" alt="PixelPinch Demo" width="600"/>

| Dark Theme | Compression Results |
|------------|-------------------|
| ![Dark Theme](https://raw.githubusercontent.com/ank920/PixelPinch/main/dark.png) | ![Results](https://raw.githubusercontent.com/ank920/PixelPinch/main/results.png) |

</div>

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Ghostscript
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ank920/pixelpinch.git
   cd pixelpinch
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   node server.js
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Frontend:**
  - React.js
  - Material-UI
  - Framer Motion
  - Axios

- **Backend:**
  - Node.js
  - Express.js
  - Multer
  - Sharp
  - Ghostscript

## 🌟 Usage Examples

<div align="center">

### PDF Compression
```mermaid
flowchart LR
    A([Upload PDF]):::blue --> B([Select Quality]):::blue
    B --> C([Compress]):::blue
    C --> D([Download]):::blue
    
    classDef blue fill:#1976D2,stroke:#90CAF9,stroke-width:2px,color:white,font-weight:bold
    classDef pink fill:#e91e63,stroke:#f48fb1,stroke-width:2px,color:white,font-weight:bold
```

### Image Compression
```mermaid
flowchart LR
    A([Select Images]):::pink --> B([Adjust Settings]):::pink
    B --> C([Process]):::pink
    C --> D([Save]):::pink
    
    classDef blue fill:#1976D2,stroke:#90CAF9,stroke-width:2px,color:white,font-weight:bold
    classDef pink fill:#e91e63,stroke:#f48fb1,stroke-width:2px,color:white,font-weight:bold
```

</div>

### Step-by-Step Guide

#### PDF Compression:
1. **Upload PDF** 📄
   - Drag and drop your PDF file
   - Or click to select from your computer
   
2. **Select Quality** ⚙️
   - High (Prepress) - Best quality
   - Medium (eBook) - Balanced
   - Low (Screen) - Maximum compression
   
3. **Compress** 🔄
   - Click "Compress" button
   - Wait for processing
   
4. **Download** ⬇️
   - Get your compressed file
   - Compare size reduction

#### Image Compression:
1. **Select Images** 🖼️
   - Support for JPEG, PNG, WebP
   - Multiple files supported
   
2. **Adjust Settings** ⚙️
   - Quality slider (0-100)
   - Format conversion options
   
3. **Process** 🔄
   - Real-time compression
   - Progress tracking
   
4. **Save** 💾
   - Download compressed images
   - View compression stats

## 📦 Deployment

### Deploy on Vercel

1. Click the "Deploy with Vercel" button above
2. Configure your deployment settings:
   ```env
   NODE_ENV=production
   CORS_ORIGIN=your-frontend-url
   ```
3. Deploy and enjoy! 🎉

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/ank920/pixelpinch/issues).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ankit Verma**
- LinkedIn: [Ankit Verma](https://www.linkedin.com/in/ankit-verma-a71255278/)
- GitHub: [@ank920](https://github.com/ank920)
- Email: reachankexplore@gmail.com

## 🙏 Acknowledgments

- [Ghostscript](https://www.ghostscript.com/)
- [Sharp](https://sharp.pixelplumbing.com/)
- [Material-UI](https://mui.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

<div align="center">

Made with ❤️ by Ankit Verma

⭐️ Star this project if you find it helpful!

</div> 