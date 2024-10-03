import React, { useEffect, useState } from 'react';
import { Grid, Box, Paper, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';

export default function Dashboard() {
  const [topEmployees, setTopEmployees] = useState([]);
  const [departmentScores, setDepartmentScores] = useState([]);
  const [topFeedbackMaterial, setTopFeedbackMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all dashboard data
    const fetchData = async () => {
      try {
        const [employeesResponse, departmentResponse, feedbackResponse] = await Promise.all([
          axios.get('http://localhost:3001/dashboard/top-employees'),
          axios.get('http://localhost:3001/dashboard/department-scores'),
          axios.get('http://localhost:3001/dashboard/top-feedback-material'),
        ]);

        setTopEmployees(employeesResponse.data);
        setDepartmentScores(departmentResponse.data);
        setTopFeedbackMaterial(feedbackResponse.data[0]); // Assuming response is an array with a single object
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Data for department scores bar chart with light and slightly darker blue shades
  const departmentChartData = {
    labels: departmentScores.map((dept) => dept.department),
    datasets: [
      {
        label: 'Average Score',
        data: departmentScores.map((dept) => dept.averageScore),
        backgroundColor: [
          'rgba(173, 216, 230, 0.6)', // Light blue
          'rgba(135, 206, 250, 0.6)', // Slightly darker blue
          'rgba(100, 149, 237, 0.6)', // Cornflower blue
        ],
        borderColor: [
          'rgba(173, 216, 230, 1)',
          'rgba(135, 206, 250, 1)',
          'rgba(100, 149, 237, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data for top employees chart (pie chart) with a range of blue shades
  const topEmployeesData = {
    labels: topEmployees.map((emp) => `${emp.firstName} ${emp.lastName}`),
    datasets: [
      {
        label: 'Total Scores',
        data: topEmployees.map((emp) => emp.totalScore),
        backgroundColor: [
          'rgba(173, 216, 230, 0.6)', // Light blue
          'rgba(135, 206, 250, 0.6)', // Slightly darker blue
          'rgba(100, 149, 237, 0.6)', // Cornflower blue
          'rgba(70, 130, 180, 0.6)', // Steel blue
          'rgba(65, 105, 225, 0.6)', // Royal blue
          'rgba(30, 144, 255, 0.6)', // Dodger blue
          'rgba(0, 191, 255, 0.6)',  // Deep sky blue
          'rgba(25, 25, 112, 0.6)',  // Midnight blue
          'rgba(0, 0, 205, 0.6)',    // Medium blue
          'rgba(0, 0, 139, 0.6)',    // Dark blue
        ],
        borderColor: [
          'rgba(173, 216, 230, 1)',
          'rgba(135, 206, 250, 1)',
          'rgba(100, 149, 237, 1)',
          'rgba(70, 130, 180, 1)',
          'rgba(65, 105, 225, 1)',
          'rgba(30, 144, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(25, 25, 112, 1)',
          'rgba(0, 0, 205, 1)',
          'rgba(0, 0, 139, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={1}>
      {/* KPI Cards */}
      <Grid container spacing={6} marginBottom={4} marginLeft={9}>
        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1c74d4',color:'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                Top Scorer
              </Typography>
              {topEmployees[0] ? (
                <Typography variant="h8">{`${topEmployees[0].firstName} ${topEmployees[0].lastName}`}</Typography>
              ) : (
                'N/A'
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center',backgroundColor: '#1c74d4',color:'white'}}>
            <CardContent>
              <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                Total Departments
              </Typography>
              <Typography variant="h8">{departmentScores.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1c74d4', color:'white'}}>
            <CardContent>
              <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                Top Feedback Material
              </Typography>
              <Typography variant="h8">{topFeedbackMaterial?.title || 'N/A'}</Typography>
              <Typography>Feedbacks: {topFeedbackMaterial?.totalFeedbacks || 0}</Typography>
              <Typography>Avg Rating: {topFeedbackMaterial?.averageRating.toFixed(2) || 'N/A'}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={4}>
        {/* Department Scores Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px', height: '400px' }}>
            <Typography variant="h6" align="center" gutterBottom  style={{ fontWeight: 'bold' }}> 
              Department-wise Average Scores
            </Typography>
            <Box height="300px" width="100%">
              <Bar data={departmentChartData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>

        {/* Top Employees Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px', height: '400px' }}>
            <Typography variant="h6" align="center" gutterBottom   style={{ fontWeight: 'bold' }}>
              Top 10 Employees by Total Scores
            </Typography>
            <Box height="300px" width="100%">
              <Pie data={topEmployeesData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
