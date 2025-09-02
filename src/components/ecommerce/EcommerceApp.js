import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Badge, Container, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import Home from './Home';
import Products from './Products';
import Cart from './Cart';

const EcommerceApp = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" sx={{ mb: 4 }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <StoreIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              component={Link}
              to="/ecommerce"
              sx={{
                flexGrow: 1,
                fontWeight: 'bold',
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  color: 'inherit',
                },
              }}
            >
              TechStore
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/ecommerce"
                startIcon={<HomeIcon />}
              >
                Home
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/ecommerce/products"
                startIcon={<StoreIcon />}
              >
                Products
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/ecommerce/cart"
                startIcon={
                  <Badge badgeContent={cartItemCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                }
              >
                Cart
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flex: 1, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/products" 
            element={
              <Products 
                addToCart={addToCart} 
              />
            } 
          />
          <Route 
            path="/cart" 
            element={
              <Cart 
                cartItems={cartItems} 
                updateQuantity={updateQuantity} 
                removeFromCart={removeFromCart} 
              />
            } 
          />
        </Routes>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 3, mt: 'auto', backgroundColor: 'grey.100' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} TechStore. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default EcommerceApp;
