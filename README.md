# 🎨 PixelPinch

<div align="center">

![PixelPinch Banner](https://raw.githubusercontent.com/ank920/PixelPinch/main/banner.png)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fank920%2FPixelPinch)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> 🚀 A premium file compression tool with a beautiful UI and powerful features

[Demo](https://pixelpinch.vercel.app) · [Report Bug](https://github.com/ank920/PixelPinch/issues) · [Request Feature](https://github.com/ank920/PixelPinch/issues)

</div>

---

## ✨ Features

<div align="center">
<table>
<tr>
<td>

### 📄 PDF Compression
- Lossless compression using Ghostscript
- Multiple quality presets
- Maintains document integrity
- Support for all PDF versions

</td>
<td>

### 🖼️ Image Processing
- JPEG, PNG, WebP support
- Smart compression algorithms
- Batch processing
- Quality control slider

</td>
</tr>
<tr>
<td>

### ⚡ Performance
- Real-time compression
- Progress tracking
- Size comparison
- Instant preview

</td>
<td>

### 🎯 User Experience
- Drag & drop interface
- Dark theme
- Responsive design
- Smooth animations

</td>
</tr>
</table>
</div>

## 🎥 Demo & Screenshots

<div align="center">
<img src="https://raw.githubusercontent.com/ank920/PixelPinch/main/demo.gif" alt="PixelPinch Demo" width="600"/>

| Dark Theme | Compression Results |
|------------|-------------------|
| ![Dark Theme](https://raw.githubusercontent.com/ank920/PixelPinch/main/dark.png) | ![Results](https://raw.githubusercontent.com/ank920/PixelPinch/main/results.png) |

</div>

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Tools |
|----------|---------|-------|
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) | ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) |
| ![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white) | ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) |
| ![Framer](https://img.shields.io/badge/Framer-black?style=for-the-badge&logo=framer&logoColor=blue) | ![Sharp](https://img.shields.io/badge/Sharp-99CC00?style=for-the-badge&logo=sharp&logoColor=white) | ![VS Code](https://img.shields.io/badge/VS_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white) |

</div>

## 🚀 Quick Start

### Prerequisites

```bash
# Check Node.js version
node --version  # Should be ≥ 14.0.0

# Install Ghostscript (macOS)
brew install ghostscript

# Install Ghostscript (Windows)
# Download from: https://ghostscript.com/releases/gsdnld.html
```

### Installation

1️⃣ Clone the repository
```bash
git clone https://github.com/ank920/PixelPinch.git
cd PixelPinch
```

2️⃣ Install dependencies
```bash
# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

3️⃣ Environment setup
```bash
# Create .env in backend directory
echo "PORT=3001
NODE_ENV=development" > .env
```

4️⃣ Start development servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🌟 Usage Examples

<div align="center">

### PDF Compression
```mermaid
graph LR
    A[Upload PDF] --> B[Select Quality]
    B --> C[Compress]
    C --> D[Download]
    style A fill:#93c5fd
    style B fill:#93c5fd
    style C fill:#93c5fd
    style D fill:#93c5fd
```

### Image Compression
```mermaid
graph LR
    A[Select Images] --> B[Adjust Settings]
    B --> C[Process]
    C --> D[Save]
    style A fill:#fca5a5
    style B fill:#fca5a5
    style C fill:#fca5a5
    style D fill:#fca5a5
```

</div>

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

Contributions make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- [Ghostscript](https://www.ghostscript.com/)
- [Sharp](https://sharp.pixelplumbing.com/)
- [Material-UI](https://mui.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

<div align="center">

Made with ❤️ by [ank920](https://github.com/ank920)

⭐️ Star this project if you find it helpful!

</div> 