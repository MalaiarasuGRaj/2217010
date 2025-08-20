import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { log } from '../middleware/logger';

// const STATISTICS_API_ENDPOINT = "http://20.244.56.144/evaluation-service/urls"; // Removed as backend is no longer being built
// const ACCESS_TOKEN = "YOUR_ACCESS_TOKEN"; // No longer needed for this component without backend

function UrlStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      log("frontend", "info", "UrlStats", "Simulating fetching URL statistics with mock data");
      try {
        setLoading(true);
        setError(null);
        
        // Mock API call for demonstration
        const mockData = [
          {
            originalUrl: "https://www.example.com/url1",
            shortenedUrl: "http://short.url/abcde",
            clicks: Math.floor(Math.random() * 500),
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            originalUrl: "https://www.anothersite.org/page2",
            shortenedUrl: "http://short.url/fghij",
            clicks: Math.floor(Math.random() * 500),
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            originalUrl: "https://www.test.net/path/to/resource",
            shortenedUrl: "http://short.url/klmno",
            clicks: Math.floor(Math.random() * 500),
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];

        await new Promise(resolve => setTimeout(() => resolve(), 1000)); // Simulate network delay
        setStats(mockData);
        log("frontend", "info", "UrlStats", "Successfully loaded mock URL statistics");
      } catch (err) {
        setError(err.message);
        log("frontend", "error", "UrlStats", `Error loading mock URL statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Loading statistics...</Typography>
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
      <Typography variant="h5" gutterBottom>URL Statistics</Typography>
      {stats.length > 0 ? (
        stats.map((stat, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body1">
                Original URL: {stat.originalUrl}
              </Typography>
              <Typography variant="body1" color="primary">
                Shortened URL: <a href={stat.shortenedUrl} target="_blank" rel="noopener noreferrer">{stat.shortenedUrl}</a>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Clicks: {stat.clicks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created At: {new Date(stat.createdAt).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1">No statistics available.</Typography>
      )}
    </Box>
  );
}

export default UrlStats;
