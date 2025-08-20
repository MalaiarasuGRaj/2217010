import React from 'react';
import UrlStats from '../components/UrlStats';
import { Typography, Box } from '@mui/material';
import { log } from '../middleware/logger';

function StatisticsPage() {
  React.useEffect(() => {
    log("frontend", "info", "StatisticsPage", "Statistics page loaded");
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        URL Statistics
      </Typography>
      <UrlStats />
    </Box>
  );
}

export default StatisticsPage;
