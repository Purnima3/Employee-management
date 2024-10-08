import React from 'react';
import { Typography, LinearProgress, Box } from '@mui/material';

function CompletionPercentage({ modules, completedModulesCount }) {
    // Calculate completion percentage
    const completionPercentage = modules.length > 0 ? (completedModulesCount / modules.length) * 100 : 0;

    return (
        <>
            {/* Wrap LinearProgress in a Box for custom width if needed */}
            <Box sx={{ width: '100%', maxWidth: 400 }}> {/* Adjust maxWidth as needed */}
                <LinearProgress
                    variant="determinate"
                    value={completionPercentage}
                    sx={{
                        height: 10, // Adjust height
                    }}
                />
            </Box>
            <Typography variant="body1">Completion: {completionPercentage.toFixed(2)}%</Typography>
        </>
    );
}

export default CompletionPercentage;
