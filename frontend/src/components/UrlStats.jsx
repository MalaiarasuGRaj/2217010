import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { log } from '../middleware/logger';

const STATISTICS_API_ENDPOINT = "http://20.244.56.144/evaluation-service/urls"; // Assuming this is your actual backend statistics API endpoint
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMjE3MDEwQG5lYy5lZHUuLmFjLmluIiwiZXhwIjoxNzU1NjY2NDAxLCJpYXQiOjE3NTU2NjU1MDEsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJhMjFmNDdhMi0wOWI5LTQ0MDAtOGI4NC1lNjM0MDNiMzRkMiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im1hbGFpYXJhc3UgZyIsInN1YiI6ImJmOWZjNmI3LWUxZWUtNDM0Ni04NTQ5LWI3Mzg1OTU4NTdkOCJ9LCJlbWFpbCI6IjIyMTcwMTBAbmVjLmVkdS5pbiIsIm5hbWUiOiJtYWxhaXRhcmFzdSBnIiwicm9sbE5vIjoiMjIxNzAxMCIsImFjY2Vzc0NvZGUiOiJ4c1pUVG4iLCJjbGllbnRJRCI6ImJmOWZjNmI3LWUxZWUtNDM0Ni04NTQ5LWI3Mzg1OTU4NTdkOCIsImNsaWVudFNlY3JldCI6IlVZakdYU1hnSmtaalhleSJ9.HS7e-nwYj4yGQgfT8WI3aMXW4FFXIjYmbV0oqONqQOQ"; // Your actual token

function UrlStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      log("frontend", "info", "UrlStats", "Attempting to fetch URL statistics");
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(STATISTICS_API_ENDPOINT, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        setStats(data);
        log("frontend", "info", "UrlStats", "Successfully fetched URL statistics");
      } catch (err) {
        setError(err.message);
        log("frontend", "error", "UrlStats", `Error fetching URL statistics: ${err.message}`);
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
