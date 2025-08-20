import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { log } from '../middleware/logger';

// const STATISTICS_API_ENDPOINT = "http://20.244.56.144/evaluation-service/urls"; // Removed as backend is no longer being built
// const ACCESS_TOKEN = "YOUR_ACCESS_TOKEN"; // No longer needed for this component without backend

function UrlStats() {
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('urlStatistics'); // New key for statistics
    return savedStats ? JSON.parse(savedStats) : [];
  });
  // Initialize loading based on whether data was found in localStorage
  const [loading, setLoading] = useState(stats.length === 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('urlStatistics', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    const fetchStats = async () => {
      log("frontend", "info", "UrlStats", "Simulating fetching URL statistics with mock data");
      try {
        setLoading(true);
        setError(null);
        
        // Enhanced Mock API call for demonstration
        const generateRandomShortcode = () => Math.random().toString(36).substring(2, 8);
        const generateRandomClicks = () => Math.floor(Math.random() * 1000) + 50; // Between 50 and 1049 clicks
        const generateSpecificDate = () => {
          const baseDate = new Date('2025-08-20T11:00:00Z'); // August 20, 2025, 11:00 AM UTC
          const minutesOffset = Math.floor(Math.random() * 30); // Random minutes between 0 and 29
          baseDate.setUTCMinutes(baseDate.getUTCMinutes() + minutesOffset);
          return baseDate.toISOString();
        };

        const generateRandomExpiry = () => {
            const base = new Date();
            const daysInFuture = Math.floor(Math.random() * 365) + 30; // 30 days to 395 days in future
            base.setDate(base.getDate() + daysInFuture);
            return base.toISOString();
        };

        const generateDetailedClicks = () => {
            const clicks = [];
            const numClicks = Math.floor(Math.random() * 5) + 1; // 1 to 5 detailed clicks
            for (let i = 0; i < numClicks; i++) {
                const clickDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Clicks in last 7 days
                clicks.push({
                    timestamp: clickDate.toISOString(),
                    source: `Source-${Math.floor(Math.random() * 10) + 1}`,
                    location: `City-${Math.floor(Math.random() * 5) + 1}`,
                });
            }
            return clicks.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
        };

        const mockData = [
          {
            originalUrl: "https://www.google.com/search?q=url+shortener+best+practices",
            shortenedUrl: `http://mock.short.url/${generateRandomShortcode()}`,
            clicks: generateRandomClicks(),
            createdAt: generateSpecificDate(),
            expiresAt: generateRandomExpiry(),
            detailedClicks: generateDetailedClicks(),
          },
          {
            originalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            shortenedUrl: `http://mock.short.url/${generateRandomShortcode()}`,
            clicks: generateRandomClicks(),
            createdAt: generateSpecificDate(),
            expiresAt: generateRandomExpiry(),
            detailedClicks: generateDetailedClicks(),
          },
          {
            originalUrl: "https://react.dev/learn",
            shortenedUrl: `http://mock.short.url/${generateRandomShortcode()}`,
            clicks: generateRandomClicks(),
            createdAt: generateSpecificDate(),
            expiresAt: generateRandomExpiry(),
            detailedClicks: generateDetailedClicks(),
          },
          {
            originalUrl: "https://mui.com/material-ui/react-components/button/",
            shortenedUrl: `http://mock.short.url/${generateRandomShortcode()}`,
            clicks: generateRandomClicks(),
            createdAt: generateSpecificDate(),
            expiresAt: generateRandomExpiry(),
            detailedClicks: generateDetailedClicks(),
          },
          {
            originalUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
            shortenedUrl: `http://mock.short.url/${generateRandomShortcode()}`,
            clicks: generateRandomClicks(),
            createdAt: generateSpecificDate(),
            expiresAt: generateRandomExpiry(),
            detailedClicks: generateDetailedClicks(),
          },
          {
            originalUrl: "https://github.com/trending",
            shortenedUrl: `http://mock.short.url/${generateRandomShortcode()}`,
            clicks: generateRandomClicks(),
            createdAt: generateSpecificDate(),
            expiresAt: generateRandomExpiry(),
            detailedClicks: generateDetailedClicks(),
          },
          {
            originalUrl: "https://stackoverflow.com/questions/tagged/reactjs",
            shortenedUrl: `http://mock.short.url/${generateRandomShortcode()}`,
            clicks: generateRandomClicks(),
            createdAt: generateSpecificDate(),
            expiresAt: generateRandomExpiry(),
            detailedClicks: generateDetailedClicks(),
          },
        ];

        // await new Promise(resolve => setTimeout(() => resolve(), 1000)); // Removed simulated network delay
        setStats(mockData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // Sort by most recent
        log("frontend", "info", "UrlStats", "Successfully loaded enhanced mock URL statistics");
      } catch (err) {
        setError(err.message);
        log("frontend", "error", "UrlStats", `Error loading mock URL statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch mock data if stats are not already loaded (e.g., from localStorage)
    if (stats.length === 0) {
      fetchStats();
    }
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
                Shortened URL: <a href={`/${stat.shortCode}`} target="_blank" rel="noopener noreferrer">{stat.shortenedUrl}</a>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Clicks: {stat.clicks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created At: {new Date(stat.createdAt).toLocaleString()}
              </Typography>
              {stat.expiresAt && (
                <Typography variant="body2" color="text.secondary">
                  Expires At: {new Date(stat.expiresAt).toLocaleString()}
                </Typography>
              )}
              {stat.detailedClicks && stat.detailedClicks.length > 0 && (
                <Box sx={{ mt: 1, ml: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Detailed Clicks:</Typography>
                  {stat.detailedClicks.map((click, clickIndex) => (
                    <Typography key={clickIndex} variant="caption" display="block">
                      - {new Date(click.timestamp).toLocaleString()} from {click.source} ({click.location})
                    </Typography>
                  ))}
                </Box>
              )}
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
