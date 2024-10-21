import React from 'react';
import { Typography, LinearProgress, Box } from '@mui/material';

function CompletionPercentage({ modules, completedModulesCount }) {
 
    const completionPercentage = modules.length > 0 ? (completedModulesCount / modules.length) * 100 : 0;

    return (
        <>
            <Box sx={{ width: '100%', maxWidth: 400 }}> 
                <LinearProgress
                    variant="determinate"
                    value={completionPercentage}
                    sx={{
                        height: 10, 
                    }}
                />
            </Box>
            <Typography variant="body1">Completion: {completionPercentage.toFixed(2)}%</Typography>
        </>
    );
}

export default CompletionPercentage;
