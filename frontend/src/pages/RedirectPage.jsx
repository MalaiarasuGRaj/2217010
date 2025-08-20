import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import { log } from '../middleware/logger';

function RedirectPage() {
  const { shortcode } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    log("frontend", "info", "RedirectPage", `Attempting to redirect for shortcode: ${shortcode}`);
    const storedShortenedUrls = JSON.parse(localStorage.getItem('shortenedResults')) || [];
    const storedStatistics = JSON.parse(localStorage.getItem('urlStatistics')) || [];

    const allShortenedUrls = [...storedShortenedUrls, ...storedStatistics];
    const foundUrl = allShortenedUrls.find(item => item.shortCode === shortcode);

    if (foundUrl) {
      setOriginalUrl(foundUrl.originalUrl);
      log("frontend", "info", "RedirectPage", `Found original URL for ${shortcode}: ${foundUrl.originalUrl}`);
      // In a real application, you would perform an actual redirect here:
      // window.location.href = foundUrl.originalUrl;
    } else {
      setError("Shortened URL not found or expired.");
      log("frontend", "error", "RedirectPage", `Shortcode not found: ${shortcode}`);
    }
    setLoading(false);
  }, [shortcode]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Looking up original URL...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error">Error: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>Redirection</Typography>
      {originalUrl ? (
        <Typography variant="body1">
          Redirecting to original URL: <a href={originalUrl} target="_blank" rel="noopener noreferrer">{originalUrl}</a>
        </Typography>
      ) : (
        <Typography variant="body1">Shortened URL not found.</Typography>
      )}
    </Box>
  );
}

export default RedirectPage;
