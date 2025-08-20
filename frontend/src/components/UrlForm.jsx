import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Card, CardContent } from '@mui/material';
import { log } from '../middleware/logger';

function UrlForm() {
  const [urls, setUrls] = useState([{
    originalUrl: '',
    validity: '',
    preferredShortcode: ''
  }]);
  const [shortenedUrls, setShortenedUrls] = useState([]);

  const handleUrlChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, {
        originalUrl: '',
        validity: '',
        preferredShortcode: ''
      }]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    log("frontend", "info", "UrlForm", "Attempting to shorten URLs");

    const results = [];
    for (const urlData of urls) {
      if (!urlData.originalUrl) continue;

      try {
        // Mock API call for demonstration
        const response = await new Promise(resolve => setTimeout(() => {
          const shortCode = urlData.preferredShortcode || Math.random().toString(36).substring(2, 8);
          resolve({
            originalUrl: urlData.originalUrl,
            shortenedUrl: `http://short.url/${shortCode}`,
            success: true
          });
        }, 500));

        if (response.success) {
          results.push(response);
          log("frontend", "info", "UrlForm", `Successfully shortened: ${response.originalUrl}`);
        } else {
          results.push({
            originalUrl: urlData.originalUrl,
            error: 'Failed to shorten',
            success: false
          });
          log("frontend", "error", "UrlForm", `Failed to shorten: ${response.originalUrl}`);
        }
      } catch (error) {
        results.push({
          originalUrl: urlData.originalUrl,
          error: error.message,
          success: false
        });
        log("frontend", "error", "UrlForm", `Error shortening ${urlData.originalUrl}: ${error.message}`);
      }
    }
    setShortenedUrls(results);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>Shorten URLs</Typography>
      {urls.map((url, index) => (
        <Box key={index} sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Original URL"
            variant="outlined"
            fullWidth
            value={url.originalUrl}
            onChange={(e) => handleUrlChange(index, 'originalUrl', e.target.value)}
            required
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
      <Button variant="contained" type="submit" fullWidth>
        Shorten
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
