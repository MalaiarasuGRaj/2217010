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

const isValidShortcode = (shortcode) => {
  // Alphanumeric, 4-10 characters (example length constraint)
  return /^[a-zA-Z0-9]{4,10}$/.test(shortcode);
};

function UrlForm() {
  const [urls, setUrls] = useState(() => {
    const savedUrls = localStorage.getItem('shortenerFormUrls'); // Changed key
    return savedUrls ? JSON.parse(savedUrls) : [{
      originalUrl: '',
      validity: '',
      preferredShortcode: '',
      error: null,
      shortcodeError: null,
    }];
  });
  const [shortenedUrls, setShortenedUrls] = useState(() => {
    const savedShortenedUrls = localStorage.getItem('shortenedResults'); // Changed key
    return savedShortenedUrls ? JSON.parse(savedShortenedUrls) : [];
  });
  const [loading, setLoading] = useState(false);
  const [overallError, setOverallError] = useState(null);

  useEffect(() => {
    localStorage.setItem('shortenerFormUrls', JSON.stringify(urls));
  }, [urls]);

  useEffect(() => {
    localStorage.setItem('shortenedResults', JSON.stringify(shortenedUrls));
  }, [shortenedUrls]);

  const handleUrlChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    if (field === 'originalUrl') {
      newUrls[index].error = isValidUrl(value) ? null : 'Invalid URL format';
    } else if (field === 'preferredShortcode') {
        newUrls[index].shortcodeError = (value && !isValidShortcode(value)) ? 'Alphanumeric, 4-10 chars' : null;
    }
    setUrls(newUrls);
  };

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, {
        originalUrl: '',
        validity: '',
        preferredShortcode: '',
        error: null,
        shortcodeError: null,
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
      if (!urlData.originalUrl) {
        if (urlData.preferredShortcode) { // If only shortcode is provided without original URL
            results.push({
                originalUrl: 'Missing Original URL',
                error: 'Original URL is required for custom shortcode',
                success: false
            });
            hasError = true;
        }
        continue;
      }

      if (urlData.error || urlData.shortcodeError) {
        hasError = true;
        results.push({
          originalUrl: urlData.originalUrl,
          error: urlData.error || urlData.shortcodeError,
          success: false
        });
        continue; // Skip processing invalid URL or shortcode
      }

      try {
        let generatedShortcode = urlData.preferredShortcode;
        let shortcodeCollision = false;

        if (generatedShortcode) {
            // Check for uniqueness of preferred shortcode
            const existingShortcode = shortenedUrls.find(item => item.shortCode === generatedShortcode);
            if (existingShortcode) {
                shortcodeCollision = true;
                hasError = true;
                results.push({
                    originalUrl: urlData.originalUrl,
                    error: `Preferred shortcode '${generatedShortcode}' already exists.`,
                    success: false
                });
                log("frontend", "warn", "UrlForm", `Preferred shortcode collision: ${generatedShortcode}`);
            }
        }

        if (!generatedShortcode || shortcodeCollision) {
            // Generate unique shortcode if not provided or if preferred shortcode collides
            do {
                generatedShortcode = Math.random().toString(36).substring(2, 8);
            } while (shortenedUrls.some(item => item.shortCode === generatedShortcode));
            log("frontend", "info", "UrlForm", `Generated unique shortcode: ${generatedShortcode}`);
        }

        const validityMinutes = urlData.validity ? parseInt(urlData.validity) : 30; // Default to 30 minutes
        const expiresAt = new Date(Date.now() + validityMinutes * 60 * 1000).toISOString();

        // Simulate API call for demonstration
        await new Promise(resolve => setTimeout(() => {
          results.push({
            originalUrl: urlData.originalUrl,
            shortenedUrl: `http://mock.short.url/${generatedShortcode}`,
            shortCode: generatedShortcode,
            expiresAt: expiresAt,
            success: true
          });
          resolve();
        }, 500));
        log("frontend", "info", "UrlForm", `Successfully simulated shortening: ${urlData.originalUrl} with shortcode ${generatedShortcode}`);
      } catch (error) {
        results.push({
          originalUrl: urlData.originalUrl,
          error: error.message,
          success: false
        });
        log("frontend", "error", "UrlForm", `Error simulating shortening ${urlData.originalUrl}: ${error.message}`);
      }
    }
    setShortenedUrls(prev => [...prev, ...results]); // Append new results
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
            error={!!url.shortcodeError}
            helperText={url.shortcodeError}
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
      <Button variant="contained" type="submit" fullWidth disabled={loading || urls.some(url => url.error || url.shortcodeError || !url.originalUrl)}>
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
                    Shortened: <a href={`/${result.shortCode}`} target="_blank" rel="noopener noreferrer">{result.shortenedUrl}</a>
                  </Typography>
                ) : (
                  <Typography variant="body1" color="error">
                    Error: {result.error}
                  </Typography>
                )}
                {result.success && result.expiresAt && (
                  <Typography variant="body2" color="text.secondary">
                    Expires: {new Date(result.expiresAt).toLocaleString()}
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
