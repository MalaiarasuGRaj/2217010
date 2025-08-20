import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { log } from '../middleware/logger';

// const SHORTEN_API_ENDPOINT = "http://20.244.56.144/evaluation-service/urls"; // Removed as backend is no longer being built
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMjE3MDEwQG5lYy5lZHUuLmFjLmluIiwiZXhwIjoxNzU1NjY2NDAxLCJpYXQiOjE3NTU2NjU1MDEsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJhMjFmNDdhMi0wOWI5LTQ0MDAtOGI4NC1lNjM0MDNiMzRkMiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im1hbGFpYXJhc3UgZyIsInN1YiI6ImJmOWZjNmI3LWUxZWUtNDM0Ni04NTQ5LWI3Mzg1OTU4NTdkOCJ9LCJlbWFpbCI6IjIyMTcwMTBAbmVjLmVkdS5pbiIsIm5hbWUiOiJtYWxhaXRhcmFzdSBnIiwicm9sbE5vIjoiMjIxNzAxMCIsImFjY2Vzc0NvZGUiOiJ4c1pUVG4iLCJjbGllbnRJRCI6ImJmOWZjNmI3LWUxZWUtNDM0Ni04NTQ5LWI3Mzg1OTU4NTdkOCIsImNsaWVudFNlY3JldCI6IlVZakdYU1hnSmtaalhleSJ9.HS7e-nwYj4yGQgfT8WI3aMXW4FFXIjYmbV0oqONqQOQ"; // Your actual token

function UrlForm() {
  const [urls, setUrls] = useState([{
    originalUrl: '',
    validity: '',
    preferredShortcode: ''
  }]);
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [overallError, setOverallError] = useState(null);

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
    setLoading(true);
    setOverallError(null);

    const results = [];
    for (const urlData of urls) {
      if (!urlData.originalUrl) continue;

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
    if (results.some(r => !r.success)) {
      setOverallError("Some URLs failed to shorten. Check individual errors above.");
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
      <Button variant="contained" type="submit" fullWidth disabled={loading}>
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
