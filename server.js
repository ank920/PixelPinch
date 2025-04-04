const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // For image compression
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS with specific options
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app'] // Update this with your actual frontend domain
    : ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: false
}));

// Add headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Add test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ 
    status: 'Server is running',
    time: new Date().toISOString(),
    uploadsDir: fs.existsSync('uploads') ? 'exists' : 'missing'
  });
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'text/plain',
    'text/javascript',
    'text/css',
    'text/html',
    'application/json'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type: ' + file.mimetype), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

app.use(express.static('build'));

// Default Ghostscript paths for Windows
const gsPath = '"C:\\Program Files\\gs\\gs10.05.0\\bin\\gswin64c.exe"';

// Test Ghostscript availability
exec(`${gsPath} --version`, (error, stdout, stderr) => {
  if (error) {
    console.error('WARNING: Ghostscript not found or not working!');
    console.error('Ghostscript error:', error.message);
    console.error('Make sure Ghostscript is installed at:', gsPath);
  } else {
    console.log('Ghostscript version:', stdout.trim());
  }
});

// Function to get file extension
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

// Function to compress PDF
const compressPDF = async (inputPath, outputPath, quality) => {
  console.log('Starting PDF compression:', {
    inputPath,
    outputPath,
    quality
  });

  // Adjust Ghostscript settings based on quality
  let compressionSettings = [];
  
  if (quality > 70) {
    // High quality - prepress settings
    compressionSettings = [
      '-dPDFSETTINGS=/prepress',
      '-dCompatibilityLevel=1.4',
      '-dAutoFilterColorImages=false',
      '-dColorImageFilter=/FlateEncode',
      '-dAutoFilterGrayImages=false',
      '-dGrayImageFilter=/FlateEncode',
      '-dMonoImageFilter=/FlateEncode'
    ];
  } else if (quality > 40) {
    // Medium quality - ebook settings
    compressionSettings = [
      '-dPDFSETTINGS=/ebook',
      '-dCompatibilityLevel=1.4',
      '-dColorImageDownsampleType=/Bicubic',
      '-dColorImageResolution=150',
      '-dGrayImageDownsampleType=/Bicubic',
      '-dGrayImageResolution=150',
      '-dMonoImageDownsampleType=/Bicubic',
      '-dMonoImageResolution=150'
    ];
  } else {
    // Low quality - screen settings
    compressionSettings = [
      '-dPDFSETTINGS=/screen',
      '-dCompatibilityLevel=1.4',
      '-dColorImageDownsampleType=/Bicubic',
      '-dColorImageResolution=72',
      '-dGrayImageDownsampleType=/Bicubic',
      '-dGrayImageResolution=72',
      '-dMonoImageDownsampleType=/Bicubic',
      '-dMonoImageResolution=72'
    ];
  }

  const gsCommand = `${gsPath} -sDEVICE=pdfwrite ${compressionSettings.join(' ')} -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;
  console.log('Executing Ghostscript command:', gsCommand);

  return new Promise((resolve, reject) => {
    exec(gsCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('Ghostscript error:', error);
        console.error('Stderr:', stderr);
        reject({ error, stderr });
      } else {
        // Verify the output file exists and is smaller
        if (fs.existsSync(outputPath)) {
          const inputSize = fs.statSync(inputPath).size;
          const outputSize = fs.statSync(outputPath).size;
          
          if (outputSize >= inputSize) {
            console.log('Compression resulted in larger file, using original file instead');
            fs.copyFileSync(inputPath, outputPath);
          }
          
          console.log('PDF compression completed:', {
            inputSize: formatFileSize(inputSize),
            outputSize: formatFileSize(outputSize),
            reduction: ((1 - (outputSize / inputSize)) * 100).toFixed(2) + '%'
          });
        }
        resolve();
      }
    });
  });
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Function to compress image
const compressImage = async (inputPath, outputPath, quality) => {
  try {
    console.log('Starting image compression:', {
      inputPath,
      outputPath,
      quality
    });

    const image = sharp(inputPath);
    const metadata = await image.metadata();
    console.log('Image metadata:', metadata);

    // Calculate dimensions for resizing if image is very large
    let resizeOptions = {};
    if (metadata.width > 3000 || metadata.height > 3000) {
      const aspectRatio = metadata.width / metadata.height;
      if (metadata.width > metadata.height) {
        resizeOptions = {
          width: 3000,
          height: Math.round(3000 / aspectRatio),
          fit: 'inside'
        };
      } else {
        resizeOptions = {
          width: Math.round(3000 * aspectRatio),
          height: 3000,
          fit: 'inside'
        };
      }
    }

    switch (metadata.format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        await image
          .resize(resizeOptions)
          .jpeg({
            quality: Math.max(1, Math.min(100, quality)), // Ensure quality is between 1-100
            mozjpeg: true, // Use mozjpeg for better compression
            chromaSubsampling: quality > 90 ? '4:4:4' : '4:2:0', // Better color preservation for high quality
            force: false // Don't force JPEG if input is PNG with transparency
          })
          .toFile(outputPath);
        break;
      
      case 'png':
        const pngQuality = Math.max(1, Math.min(100, quality));
        await image
          .resize(resizeOptions)
          .png({
            compressionLevel: 9, // Maximum compression (0-9)
            adaptiveFiltering: true, // Use adaptive filtering
            quality: pngQuality,
            effort: 10, // Maximum compression effort
            palette: quality < 90, // Use palette for lower qualities
            colors: quality < 90 ? 256 : undefined // Reduce colors for lower qualities
          })
          .toFile(outputPath);
        break;
      
      case 'webp':
        await image
          .resize(resizeOptions)
          .webp({
            quality: Math.max(1, Math.min(100, quality)),
            lossless: quality >= 95, // Use lossless for very high quality
            effort: 6, // Maximum compression effort
            smartSubsample: true,
            reductionEffort: 6 // Maximum reduction effort
          })
          .toFile(outputPath);
        break;
      
      default:
        // For other formats, try to maintain quality while still compressing
        await image
          .resize(resizeOptions)
          .jpeg({
            quality: Math.max(1, Math.min(100, quality)),
            mozjpeg: true,
            chromaSubsampling: quality > 90 ? '4:4:4' : '4:2:0'
          })
          .toFile(outputPath);
    }

    // Get and log compression results
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    console.log('Image compression results:', {
      format: metadata.format,
      originalSize: inputStats.size,
      compressedSize: outputStats.size,
      compressionRatio: ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(2) + '%',
      dimensions: {
        original: `${metadata.width}x${metadata.height}`,
        compressed: resizeOptions.width ? 
          `${resizeOptions.width}x${resizeOptions.height}` : 
          'unchanged'
      }
    });

  } catch (error) {
    console.error('Image compression error:', error);
    throw error;
  }
};

// Function to compress text files
const compressText = async (inputPath, outputPath) => {
  try {
    const content = fs.readFileSync(inputPath, 'utf8');
    const compressed = content
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
      .replace(/^\s+|\s+$/gm, '')
      .replace(/\n\s*\n/g, '\n');
    fs.writeFileSync(outputPath, compressed);
  } catch (error) {
    console.error('Text compression error:', error);
    throw error;
  }
};

app.post('/api/compress', upload.single('file'), async (req, res) => {
  console.log('=== Compression Request Started ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  try {
    if (!req.file) {
      console.log('Error: No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    });
  
    const inputPath = req.file.path;
    const fileExt = getFileExtension(req.file.originalname);
    const quality = parseInt(req.body.quality) || 75;
    const outputPath = path.join('uploads', 'compressed-' + path.basename(req.file.path));

    console.log('Processing file:', {
      inputPath,
      outputPath,
      fileExt,
      quality
    });

    // Ensure input file exists
    if (!fs.existsSync(inputPath)) {
      throw new Error('Input file not found');
    }
    
    // Handle different file types
    switch (fileExt) {
      case '.pdf':
        await compressPDF(inputPath, outputPath, quality);
        break;
      case '.jpg':
      case '.jpeg':
      case '.png':
      case '.webp':
        await compressImage(inputPath, outputPath, quality);
        break;
      case '.txt':
      case '.js':
      case '.css':
      case '.html':
      case '.json':
        await compressText(inputPath, outputPath);
        break;
      default:
        throw new Error('Unsupported file type: ' + fileExt);
    }

    // Verify output file was created
    if (!fs.existsSync(outputPath)) {
      throw new Error('Compression failed: Output file not created');
    }

    // Get file sizes for comparison
    const inputSize = fs.statSync(inputPath).size;
    const outputSize = fs.statSync(outputPath).size;
    const compressionRatio = ((inputSize - outputSize) / inputSize * 100).toFixed(2);

    console.log('Compression complete:', {
      originalSize: inputSize,
      compressedSize: outputSize,
      ratio: compressionRatio,
      outputPath
    });

    res.json({
      success: true,
      originalSize: inputSize,
      compressedSize: outputSize,
      compressionRatio: compressionRatio,
      downloadPath: `/download/${path.basename(outputPath)}`,
      fileType: fileExt
    });

    // Clean up input file
    try {
      fs.unlinkSync(inputPath);
    } catch (err) {
      console.error('Error cleaning up input file:', err);
    }
  } catch (error) {
    console.error('Error during compression:', error);
    
    // Clean up files in case of error
    try {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }
    
    return res.status(500).json({
      error: 'Compression failed',
      details: error.message
    });
  }
});

// Download route with improved error handling
app.get('/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const file = path.join(__dirname, 'uploads', filename);
    
    console.log('Download requested for file:', file);
    
    if (!fs.existsSync(file)) {
      console.log('File not found:', file);
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=compressed-${filename}`);
    
    // Stream the file instead of loading it all into memory
    const fileStream = fs.createReadStream(file);
    fileStream.pipe(res);
    
    // Handle streaming errors
    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Download failed', details: error.message });
      }
    });
    
    // Clean up file after successful download
    fileStream.on('end', () => {
      try {
        fs.unlinkSync(file);
        console.log('File cleaned up after download:', file);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    });
  } catch (error) {
    console.error('Error in download route:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Download failed', details: error.message });
    }
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Server error occurred',
    details: err.message
  });
});

// Start server with error handling
const server = app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log(`Server running on port ${port}`);
  console.log('Server is accepting connections from all network interfaces');
  console.log('Test endpoint available at: http://localhost:3001/api/test');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Uploads directory:', uploadsDir);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
}); 