import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';

const featuredProducts = [
  {
    id: 1,
    name: 'Sony WH-1000XM4',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1618366712010-f4e9c593b70e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Industry-leading noise cancellation',
    category: 'Audio'
  },
  {
    id: 2,
    name: 'Apple Watch Series 8',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1677442135136-760c81388f98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Advanced health and fitness features',
    category: 'Wearables'
  },
  {
    id: 3,
    name: 'Samsung T7 Shield',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1597871040916-001375c803c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: '1TB Portable SSD with rugged design',
    category: 'Storage'
  },
];

const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box 
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          p: 6,
          borderRadius: 2,
          textAlign: 'center',
          mb: 6,
          backgroundImage: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to TechStore
        </Typography>
        <Typography variant="h6" component="p" gutterBottom>
          Discover amazing deals on the latest tech gadgets
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          size="large" 
          component={Link} 
          to="/ecommerce/products"
          sx={{ mt: 3 }}
        >
          Shop Now
        </Button>
      </Box>

      {/* Featured Products */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        Featured Products
      </Typography>
      
      <Grid container spacing={4}>
        {featuredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.category}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: '0.8rem', mb: 1 }}>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${product.price.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', mt: 8, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Ready to shop?
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          component={Link} 
          to="/ecommerce/products"
          sx={{ mt: 2 }}
        >
          View All Products
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
