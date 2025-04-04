import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  Chip,
  Tooltip,
  Paper,
  useTheme
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Code as CodeIcon,
  Psychology as PsychologyIcon,
  Cloud as CloudIcon,
  Storage as StorageIcon,
  DataObject as DataIcon,
  Security as SecurityIcon,
  Api as ApiIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const skills = [
  { name: 'Python', category: 'Languages', icon: <CodeIcon /> },
  { name: 'TensorFlow', category: 'AI/ML', icon: <PsychologyIcon /> },
  { name: 'React.js', category: 'Frontend', icon: <CodeIcon /> },
  { name: 'GCP & AWS', category: 'Cloud', icon: <CloudIcon /> },
  { name: 'MongoDB', category: 'Database', icon: <StorageIcon /> },
  { name: 'Machine Learning', category: 'AI/ML', icon: <PsychologyIcon /> },
  { name: 'Docker', category: 'DevOps', icon: <CloudIcon /> },
  { name: 'Data Structures', category: 'Core', icon: <DataIcon /> },
  { name: 'Cybersecurity', category: 'Security', icon: <SecurityIcon /> },
  { name: 'REST APIs', category: 'Backend', icon: <ApiIcon /> }
];

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <MotionPaper
          elevation={24}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{
            p: 4,
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #90caf9, #1976d2, #90caf9)',
              backgroundSize: '200% 100%',
              animation: 'gradient 8s linear infinite'
            },
            '@keyframes gradient': {
              '0%': { backgroundPosition: '0% 0%' },
              '100%': { backgroundPosition: '200% 0%' }
            }
          }}
        >
          <Grid container spacing={4}>
            {/* Personal Info Section */}
            <Grid item xs={12} md={4}>
              <MotionBox
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    textShadow: '0 0 10px rgba(144, 202, 249, 0.3)'
                  }}
                >
                  Ankit Verma
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 500,
                    background: 'linear-gradient(90deg, #90caf9, #64b5f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  MCA in Machine Learning & AI
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon fontSize="small" color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    Dehradun, Uttarakhand
                  </Typography>
                </Box>
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Tooltip title="GitHub">
                    <IconButton
                      component={motion.a}
                      href="https://github.com/ank920"
                      target="_blank"
                      whileHover={{ 
                        scale: 1.2,
                        boxShadow: '0 0 8px rgba(144, 202, 249, 0.5)'
                      }}
                      whileTap={{ scale: 0.9 }}
                      sx={{
                        bgcolor: 'rgba(144, 202, 249, 0.1)',
                        '&:hover': { bgcolor: 'rgba(144, 202, 249, 0.2)' }
                      }}
                    >
                      <GitHubIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="LinkedIn">
                    <IconButton
                      component={motion.a}
                      href="https://www.linkedin.com/in/ankit-verma-a71255278/"
                      target="_blank"
                      whileHover={{ 
                        scale: 1.2,
                        boxShadow: '0 0 8px rgba(144, 202, 249, 0.5)'
                      }}
                      whileTap={{ scale: 0.9 }}
                      sx={{
                        bgcolor: 'rgba(144, 202, 249, 0.1)',
                        '&:hover': { bgcolor: 'rgba(144, 202, 249, 0.2)' }
                      }}
                    >
                      <LinkedInIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Email">
                    <IconButton
                      component={motion.a}
                      href="mailto:reachankexplore@gmail.com"
                      whileHover={{ 
                        scale: 1.2,
                        boxShadow: '0 0 8px rgba(144, 202, 249, 0.5)'
                      }}
                      whileTap={{ scale: 0.9 }}
                      sx={{
                        bgcolor: 'rgba(144, 202, 249, 0.1)',
                        '&:hover': { bgcolor: 'rgba(144, 202, 249, 0.2)' }
                      }}
                    >
                      <EmailIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Phone">
                    <IconButton
                      component={motion.a}
                      href="tel:+917505948319"
                      whileHover={{ 
                        scale: 1.2,
                        boxShadow: '0 0 8px rgba(144, 202, 249, 0.5)'
                      }}
                      whileTap={{ scale: 0.9 }}
                      sx={{
                        bgcolor: 'rgba(144, 202, 249, 0.1)',
                        '&:hover': { bgcolor: 'rgba(144, 202, 249, 0.2)' }
                      }}
                    >
                      <PhoneIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </MotionBox>
            </Grid>

            {/* Skills Section */}
            <Grid item xs={12} md={8}>
              <MotionBox
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&::after': {
                      content: '""',
                      flex: 1,
                      height: '2px',
                      background: 'linear-gradient(90deg, #90caf9 0%, transparent 100%)'
                    }
                  }}
                >
                  Technologies & Expertise
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1.5, 
                    mt: 3,
                    justifyContent: 'flex-start'
                  }}
                >
                  {skills.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Chip
                        label={skill.name}
                        icon={skill.icon}
                        variant="outlined"
                        sx={{
                          borderColor: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'rgba(144, 202, 249, 0.1)',
                            transform: 'translateY(-2px)',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </motion.div>
                  ))}
                </Box>
              </MotionBox>
            </Grid>
          </Grid>

          <Divider 
            sx={{ 
              my: 4, 
              opacity: 0.1,
              '&::before, &::after': {
                borderColor: 'primary.main',
              }
            }} 
          />

          <MotionBox
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            sx={{ textAlign: 'center' }}
          >
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                '& span': {
                  color: 'primary.main',
                  fontWeight: 500
                }
              }}
            >
              © {new Date().getFullYear()} <span>PixelPinch</span>. Crafted with ❤️ by <span>Ankit Verma</span>
            </Typography>
            <Typography 
              variant="caption" 
              display="block" 
              sx={{ 
                mt: 1,
                color: 'rgba(144, 202, 249, 0.6)',
                fontStyle: 'italic'
              }}
            >
              Transforming the future with AI & Machine Learning
            </Typography>
          </MotionBox>
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default Footer; 