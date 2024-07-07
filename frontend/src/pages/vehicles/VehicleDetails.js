import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container, Grid, Card, CardContent, Typography, Divider, Box, Button,
  useMediaQuery, useTheme, CircularProgress, Paper
} from '@mui/material';
import axiosInstance from '../utilities/axiosInstance';
import Header from '../utilities/Header';
import Rating from '@mui/material/Rating';

const VehicleDetails = () => {
  const { vehicle_id } = useParams();
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicleDetails() {
      try {
        const res = await axiosInstance.get(`/vehicles/${vehicle_id}`);
        setVehicleDetails(res.data);
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicleDetails();
  }, [vehicle_id]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!vehicleDetails) {
    return <Typography variant="h6" align="center" color="error">Error loading vehicle details.</Typography>;
  }

  const image = vehicleDetails.img
    ? `data:${vehicleDetails.img.contentType};base64,${vehicleDetails.img.data}`
    : "logofinal.png"; // Placeholder image

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Grid container spacing={isSmallScreen ? 2 : 4} alignItems="stretch">
            {/* Image Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                  className="d-block w-100"
                  src={image}
                  alt={`${vehicleDetails.make} ${vehicleDetails.model}`}
                  style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover' }}
                />
              </Card>
            </Grid>
            {/* Details Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent>
                  <Typography variant="h4" component="div" align="center" gutterBottom>
                    {vehicleDetails.make} {vehicleDetails.model}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Rating name="read-only" value={4.5} precision={0.5} readOnly />
                  </Box>
                  <Typography variant="body1" color="text.secondary" align="center" gutterBottom>
                    {vehicleDetails.fuelType} | {vehicleDetails.year}
                  </Typography>
                  <Typography variant="h5" align="center" gutterBottom>
                    ${vehicleDetails.rentPerHrs} per hour
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body1" align="center" paragraph>
                    {vehicleDetails.description || "No additional details available."}
                  </Typography>
                </CardContent>
                <Box sx={{ textAlign: 'center', pb: 2 }}>
                  <Button variant="contained" color="primary" component={Link} to={`/vehicles/${vehicle_id}/reviews`} sx={{ m: 1 }}>
                    Check all reviews
                  </Button>
                  <Button variant="outlined" component={Link} to="/vehicles" sx={{ m: 1 }}>
                    Back to Listings
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default VehicleDetails;
