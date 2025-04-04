const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and images are allowed.'));
    }
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok' });
});

// Compression endpoint
app.post('/api/compress', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const inputPath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    const quality = parseInt(req.body.quality) || 75;
    const outputPath = path.join('uploads', `compressed-${path.basename(req.file.filename)}`);

    console.log('Processing file:', {
      inputPath,
      outputPath,
      fileExt,
      quality
    });

    let result;
    if (fileExt === '.pdf') {
      // PDF compression logic here
      result = await compressPDF(inputPath, outputPath, quality);
    } else {
      // Image compression
      result = await compressImage(inputPath, outputPath, quality);
    }

    res.json(result);
  } catch (error) {
    console.error('Compression error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Download endpoint
app.get('/api/download', (req, res) => {
  const filePath = req.query.file;
  if (!filePath) {
    return res.status(400).json({ error: 'No file specified' });
  }

  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(fullPath, (err) => {
    if (err) {
      console.error('Download error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error downloading file' });
      }
    }
    
    // Clean up the file after download
    fs.unlink(fullPath, (unlinkErr) => {
      if (unlinkErr) console.error('Error deleting file:', unlinkErr);
    });
  });
});

// Image compression function
async function compressImage(inputPath, outputPath, quality) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log('Image metadata:', metadata);

    const compressedImage = await image
      .jpeg({ quality: quality })
      .toFile(outputPath);

    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const ratio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);

    return {
      format: metadata.format,
      originalSize,
      compressedSize,
      ratio,
      outputPath
    };
  } catch (error) {
    console.error('Image compression error:', error);
    throw new Error('Failed to compress image');
  }
}

// Serve any remaining requests with the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log('Server is accepting connections from all network interfaces');
  console.log(`Test endpoint available at: http://localhost:${port}/api/test`);
}); 