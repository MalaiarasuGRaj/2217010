import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { log } from '../middleware/logger';

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

function UrlForm() {
  const [urls, setUrls] = useState(() => {
    const savedUrls = localStorage.getItem('shortenedUrls');
    return savedUrls ? JSON.parse(savedUrls) : [{
      originalUrl: '',
      validity: '',
      preferredShortcode: '',
      error: null
    }];
  });
  const [shortenedUrls, setShortenedUrls] = useState(() => {
    const savedShortenedUrls = localStorage.getItem('displayedShortenedUrls');
    return savedShortenedUrls ? JSON.parse(savedShortenedUrls) : [];
  });
  const [loading, setLoading] = useState(false);
  const [overallError, setOverallError] = useState(null);

  useEffect(() => {
    localStorage.setItem('shortenedUrls', JSON.stringify(urls));
  }, [urls]);

  useEffect(() => {
    localStorage.setItem('displayedShortenedUrls', JSON.stringify(shortenedUrls));
  }, [shortenedUrls]);

  const handleUrlChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    if (field === 'originalUrl') {
      newUrls[index].error = isValidUrl(value) ? null : 'Invalid URL format';
    }
    setUrls(newUrls);
  };

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, {
        originalUrl: '',
        validity: '',
        preferredShortcode: '',
        error: null
      }]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    log("frontend", "info", "UrlForm", "Attempting to shorten URLs");
    setLoading(true);
    setOverallError(null);

    const results = [];
    let hasError = false;
    for (const urlData of urls) {
      if (!urlData.originalUrl) continue;

      if (urlData.error) {
        hasError = true;
        results.push({
          originalUrl: urlData.originalUrl,
          error: urlData.error,
          success: false
        });
        continue; // Skip processing invalid URL
      }

      try {
        // Simulate API call for demonstration
        await new Promise(resolve => setTimeout(() => {
          const shortCode = urlData.preferredShortcode || Math.random().toString(36).substring(2, 8);
          results.push({
            originalUrl: urlData.originalUrl,
            shortenedUrl: `http://mock.short.url/${shortCode}`,
            success: true
          });
          resolve();
        }, 500));
        log("frontend", "info", "UrlForm", `Successfully simulated shortening: ${urlData.originalUrl}`);
      } catch (error) {
        results.push({
          originalUrl: urlData.originalUrl,
          error: error.message,
          success: false
        });
        log("frontend", "error", "UrlForm", `Error simulating shortening ${urlData.originalUrl}: ${error.message}`);
      }
    }
    setShortenedUrls(results);
    setLoading(false);
    if (hasError || results.some(r => !r.success)) {
      setOverallError("Some URLs failed to shorten. Check individual errors above.");
    } else if (results.length > 0) {
        setOverallError(null); // Clear overall error if all successful
    }

  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>Shorten URLs</Typography>
      {overallError && <Alert severity="error" sx={{ mb: 2 }}>{overallError}</Alert>}
      {urls.map((url, index) => (
        <Box key={index} sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Original URL"
            variant="outlined"
            fullWidth
            value={url.originalUrl}
            onChange={(e) => handleUrlChange(index, 'originalUrl', e.target.value)}
            required
            error={!!url.error}
            helperText={url.error}
          />
          <TextField
            label="Validity (minutes)"
            variant="outlined"
            type="number"
            value={url.validity}
            onChange={(e) => handleUrlChange(index, 'validity', e.target.value)}
            sx={{ width: '150px' }}
          />
          <TextField
            label="Preferred Shortcode"
            variant="outlined"
            value={url.preferredShortcode}
            onChange={(e) => handleUrlChange(index, 'preferredShortcode', e.target.value)}
            sx={{ width: '200px' }}
          />
        </Box>
      ))}
      <Button
        variant="outlined"
        onClick={addUrlField}
        disabled={urls.length >= 5}
        sx={{ mb: 2 }}
      >
        Add another URL
      </Button>
      <Button variant="contained" type="submit" fullWidth disabled={loading || urls.some(url => url.error || !url.originalUrl)}>
        {loading ? <CircularProgress size={24} /> : "Shorten"}
      </Button>

      {shortenedUrls.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>Shortened URLs</Typography>
          {shortenedUrls.map((result, index) => (
            <Card key={index} sx={{ mb: 1, backgroundColor: result.success ? '#e8f5e9' : '#ffebee' }}>
              <CardContent>
                <Typography variant="body1">
                  Original: {result.originalUrl}
                </Typography>
                {result.success ? (
                  <Typography variant="body1" color="primary">
                    Shortened: <a href={result.shortenedUrl} target="_blank" rel="noopener noreferrer">{result.shortenedUrl}</a>
                  </Typography>
                ) : (
                  <Typography variant="body1" color="error">
                    Error: {result.error}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default UrlForm;
