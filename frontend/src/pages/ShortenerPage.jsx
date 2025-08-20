import React from 'react';
import UrlForm from '../components/UrlForm';
import { Typography, Box } from '@mui/material';
import { log } from '../middleware/logger';

function ShortenerPage() {
  React.useEffect(() => {
    log("frontend", "info", "ShortenerPage", "Shortener page loaded");
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        URL Shortener
      </Typography>
      <UrlForm />
    </Box>
  );
}

export default ShortenerPage;
