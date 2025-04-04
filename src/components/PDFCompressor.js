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
  CircularProgress
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

function FileCompressor() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [quality, setQuality] = useState(75);
  const [estimatedSize, setEstimatedSize] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) {
      setError('Please upload a supported file type');
      return;
    }
    setFile(file);
    setError(null);
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: SUPPORTED_FORMATS,
    multiple: false
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
    setProcessing(true);
    setError(null);

    try {
      // First check if server is available with timeout
      const serverCheck = await Promise.race([
        fetch(`${API_URL}/api/test`),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Server connection timeout')), 5000)
        )
      ]).catch(error => {
        console.error('Server check failed:', error);
        throw new Error('Cannot connect to server. Please check your internet connection and try again.');
      });

      if (!serverCheck) {
        throw new Error('Server is not responding. Please try again later.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('quality', quality.toString());

      console.log('Sending file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        quality
      });

      const response = await fetch(`${API_URL}/api/compress`, {
        method: 'POST',
        body: formData,
        credentials: 'omit',
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Server error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Compression response:', data);
      setResult(data);
    } catch (err) {
      console.error('Compression error:', err);
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.downloadPath) return;
    
    setError(null);
    
    try {
      console.log('Starting download from:', result.downloadPath);
      
      const response = await fetch(`${API_URL}${result.downloadPath}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream',
        },
      });

      if (!response.ok) {
        console.error('Download failed with status:', response.status);
        const errorData = await response.json().catch(() => ({ error: 'Download failed' }));
        throw new Error(errorData.error || 'Failed to download the file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed-${file.name}`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
    } catch (err) {
      console.error('Download error:', err);
      setError(err.message || 'Failed to download the compressed file');
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
    <AnimatePresence mode="wait">
      <MotionBox
        key="container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}
      >
        <MotionPaper
          elevation={24}
          sx={{
            p: 4,
            textAlign: 'center',
            background: 'linear-gradient(145deg, #132f4c 0%, #0a1929 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
          }}
        >
          <MotionTypography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            File Compressor Pro
          </MotionTypography>

          <MotionTypography
            variant="subtitle1"
            color="text.secondary"
            gutterBottom
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Compress PDF, Images, and Code files without losing quality
          </MotionTypography>

          <AnimatePresence mode="wait">
            {!file && (
              <MotionBox
                key="dropzone"
                {...getRootProps()}
                component={motion.div}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  mt: 4,
                  p: 6,
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'grey.500',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'rgba(33, 150, 243, 0.08)',
                  },
                }}
              >
                <input {...getInputProps()} />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                </motion.div>
                <Typography variant="h6">
                  {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supported formats: PDF, JPG, PNG, JS, CSS, HTML, TXT, JSON
                </Typography>
              </MotionBox>
            )}

            {file && !result && (
              <MotionCard
                key="compression-card"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                sx={{ mt: 4 }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    {getFileIcon(file.type)}
                    <Box sx={{ flexGrow: 1, textAlign: 'left', ml: 2 }}>
                      <Typography variant="subtitle1" noWrap>{file.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                    <Tooltip title="Remove file">
                      <IconButton onClick={handleReset} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Typography id="quality-slider" gutterBottom>
                      {getQualityLabel()}
                    </Typography>
                    <Slider
                      value={quality}
                      onChange={(_, newValue) => setQuality(newValue)}
                      aria-labelledby="quality-slider"
                      valueLabelDisplay="auto"
                      step={5}
                      marks={[
                        { value: 0, label: 'Min' },
                        { value: 40, label: '40%' },
                        { value: 70, label: '70%' },
                        { value: 100, label: 'Max' }
                      ]}
                      min={0}
                      max={100}
                    />
                    {estimatedSize && (
                      <Typography variant="body2" color="text.secondary">
                        Estimated size after compression: {formatFileSize(estimatedSize)}
                      </Typography>
                    )}
                    {getCompressionTips()}
                  </Stack>

                  {processing ? (
                    <MotionBox
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      sx={{ textAlign: 'center', py: 3 }}
                    >
                      <CircularProgressWithLabel value={quality} />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Compressing your file...
                      </Typography>
                    </MotionBox>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<CompressIcon />}
                      onClick={handleCompress}
                      disabled={processing}
                      fullWidth
                      component={motion.button}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Compress File
                    </Button>
                  )}
                </CardContent>
              </MotionCard>
            )}

            {result && (
              <MotionCard
                key="result-card"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                sx={{ mt: 4 }}
              >
                <CardContent>
                  <MotionBox
                    variants={successVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <CheckCircleIcon 
                      sx={{ 
                        fontSize: 48, 
                        color: 'success.main',
                        mb: 2
                      }} 
                    />
                  </MotionBox>
                  
                  <Typography variant="h6" gutterBottom color="primary">
                    Compression Complete!
                  </Typography>
                  
                  <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    sx={{ my: 2 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Original size: {formatFileSize(result.originalSize)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Compressed size: {formatFileSize(result.compressedSize)}
                    </Typography>
                    <Typography variant="body1" color="primary" sx={{ mt: 1, fontWeight: 600 }}>
                      Saved {result.compressionRatio}% of original size
                    </Typography>
                  </MotionBox>

                  <Stack 
                    direction="row" 
                    spacing={2} 
                    justifyContent="center"
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownload}
                      component={motion.button}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Download Compressed File
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      onClick={handleReset}
                      component={motion.button}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Compress Another File
                    </Button>
                  </Stack>
                </CardContent>
              </MotionCard>
            )}
          </AnimatePresence>

          {error && (
            <MotionTypography
              color="error"
              sx={{ mt: 2 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </MotionTypography>
          )}
        </MotionPaper>
      </MotionBox>
    </AnimatePresence>
  );
}

export default FileCompressor; 