import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Paper, 
  Typography, 
  Button, 
  Box, 
  LinearProgress, 
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Slider,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Compress as CompressIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

// Premium animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 }
  }
};

const successVariants = {
  hidden: { scale: 0 },
  visible: { 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const SUPPORTED_FORMATS = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'text/plain': ['.txt'],
  'text/javascript': ['.js'],
  'text/css': ['.css'],
  'text/html': ['.html'],
  'application/json': ['.json']
};

// API URL configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function PDFCompressor() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [quality, setQuality] = useState(75);
  const [estimatedSize, setEstimatedSize] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
  });

  // Calculate estimated size based on quality slider
  useEffect(() => {
    if (file) {
      const originalSize = file.size;
      let estimatedRatio;
      
      if (file.type === 'application/pdf') {
        // More conservative PDF estimation based on content type
        const isPDFLikelyScanned = originalSize / 1024 > 1000; // Over 1MB might be scanned
        if (isPDFLikelyScanned) {
          // Scanned PDFs compress better
          if (quality > 70) estimatedRatio = 0.4;
          else if (quality > 40) estimatedRatio = 0.25;
          else estimatedRatio = 0.15;
        } else {
          // Regular PDFs
          if (quality > 70) estimatedRatio = 0.8;
          else if (quality > 40) estimatedRatio = 0.6;
          else estimatedRatio = 0.4;
        }
      } else if (file.type.startsWith('image/')) {
        if (file.type === 'image/png') {
          // PNG compression is more conservative
          estimatedRatio = quality > 90 ? 0.95 : quality > 70 ? 0.85 : 0.75;
        } else if (file.type === 'image/jpeg') {
          // JPEG can be compressed more aggressively
          estimatedRatio = Math.max(0.3, (quality * 0.8) / 100);
        } else {
          estimatedRatio = Math.max(0.4, quality / 100);
        }
      } else {
        // Text files
        estimatedRatio = 0.6; // More conservative estimate
      }
      
      // Ensure we never estimate a size larger than the original
      const estimatedCompressedSize = Math.min(
        originalSize,
        Math.max(Math.round(originalSize * estimatedRatio), 1024) // Minimum 1KB
      );
      
      setEstimatedSize(estimatedCompressedSize);
      
      // Log estimation details for debugging
      console.log('Size estimation:', {
        originalSize: formatFileSize(originalSize),
        estimatedSize: formatFileSize(estimatedCompressedSize),
        estimatedRatio: `${((1 - estimatedRatio) * 100).toFixed(1)}%`,
        fileType: file.type,
        quality
      });
    }
  }, [file, quality]);

  const handleCompress = async () => {
    if (!file) return;

    setProcessing(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality);

    try {
      const response = await fetch(`${API_URL}/api/compress`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      setResult(result);
    } catch (err) {
      console.error('Compression error:', err);
      setError('Failed to compress file. Please make sure the server is running on port 3001.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.outputPath) return;

    try {
      const response = await fetch(`${API_URL}/api/download?file=${result.outputPath}`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed-${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download the compressed file.');
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setQuality(75);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) {
      return <ImageIcon />;
    } else if (fileType === 'application/pdf') {
      return <PdfIcon />;
    } else if (fileType?.startsWith('text/') || fileType === 'application/json') {
      return <CodeIcon />;
    }
    return <FileIcon />;
  };

  const getCompressionTips = () => {
    if (!file) return null;

    if (file.type.startsWith('image/')) {
      return (
        <Box sx={{ mt: 2, textAlign: 'left', bgcolor: 'rgba(0,0,0,0.1)', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Image Compression Tips:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • PNG: Lossless compression with palette optimization
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • JPEG: High-quality compression with color preservation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • WebP: Modern format with superior compression
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const getQualityLabel = () => {
    if (!file) return '';
    
    const compressionPercent = estimatedSize ? 
      ((1 - (estimatedSize / file.size)) * 100).toFixed(0) : 0;
    
    if (file.type.startsWith('image/')) {
      if (quality >= 90) return `Maximum Quality - Est. ${compressionPercent}% reduction`;
      if (quality >= 70) return `High Quality - Est. ${compressionPercent}% reduction`;
      if (quality >= 40) return `Balanced - Est. ${compressionPercent}% reduction`;
      return `Maximum Compression - Est. ${compressionPercent}% reduction`;
    }
    
    if (file.type === 'application/pdf') {
      if (quality > 70) return `Prepress Quality - Est. ${compressionPercent}% reduction`;
      if (quality > 40) return `eBook Quality - Est. ${compressionPercent}% reduction`;
      return `Screen Quality - Est. ${compressionPercent}% reduction`;
    }
    
    return `Compression Quality: ${quality}% - Est. ${compressionPercent}% reduction`;
  };

  // Custom progress animation
  const CircularProgressWithLabel = (props) => (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} size={80} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Stack spacing={3}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          background: 'linear-gradient(145deg, #132f4c 0%, #0a1929 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          PixelPinch
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Compress your files without losing quality
        </Typography>

        <Box
          {...getRootProps()}
          sx={{
            mt: 3,
            p: 3,
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'rgba(144, 202, 249, 0.08)',
            },
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            {isDragActive
              ? 'Drop the file here...'
              : 'Drag & drop a file here, or click to select'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Supported formats: PDF, JPEG, PNG, WebP (Max 50MB)
          </Typography>
        </Box>

        {file && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Selected file: {file.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
            </Typography>

            <Box sx={{ px: 4, mt: 3 }}>
              <Typography gutterBottom>Quality: {quality}%</Typography>
              <Slider
                value={quality}
                onChange={(_, newValue) => setQuality(newValue)}
                aria-labelledby="quality-slider"
                valueLabelDisplay="auto"
                min={1}
                max={100}
                sx={{ maxWidth: 300, mx: 'auto' }}
              />
            </Box>

            <Button
              variant="contained"
              startIcon={<CompressIcon />}
              onClick={handleCompress}
              disabled={processing}
              sx={{ mt: 3 }}
            >
              {processing ? 'Compressing...' : 'Compress'}
            </Button>
          </Box>
        )}

        {processing && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Paper sx={{ mt: 3, p: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              Compression Results
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Original size: {(result.originalSize / (1024 * 1024)).toFixed(2)} MB
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Compressed size: {(result.compressedSize / (1024 * 1024)).toFixed(2)} MB
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Reduction: {result.ratio}%
            </Typography>

            <IconButton
              color="primary"
              onClick={handleDownload}
              sx={{ mt: 1 }}
              title="Download compressed file"
            >
              <DownloadIcon />
            </IconButton>
          </Paper>
        )}
      </Paper>
    </Stack>
  );
}

export default PDFCompressor; 