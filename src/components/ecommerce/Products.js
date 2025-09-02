import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Stack
} from '@mui/material';

const products = [
  { 
    id: 1, 
    name: 'Sony WH-1000XM4', 
    price: 349.99, 
    category: 'Audio', 
    image: 'https://images.unsplash.com/photo-1618366712010-f4e9c593b70e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Industry-leading noise cancellation and exceptional sound quality.'
  },
  { 
    id: 2, 
    name: 'Apple Watch Series 8', 
    price: 399.99, 
    category: 'Wearables', 
    image: 'https://images.unsplash.com/photo-1677442135136-760c81388f98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Stay connected with advanced health and fitness features.'
  },
  { 
    id: 3, 
    name: 'JBL Flip 6', 
    price: 129.99, 
    category: 'Audio', 
    image: 'https://images.unsplash.com/photo-1605464315542-ba3b7c352ce7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Portable Bluetooth speaker with powerful sound and deep bass.'
  },
  { 
    id: 4, 
    name: 'SwissGear Backpack', 
    price: 89.99, 
    category: 'Accessories', 
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Durable and spacious backpack for all your tech essentials.'
  },
  { 
    id: 5, 
    name: 'Logitech MX Master 3', 
    price: 99.99, 
    category: 'Accessories', 
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Advanced wireless mouse for precision and comfort.'
  },
  { 
    id: 6, 
    name: 'Keychron K2', 
    price: 99.99, 
    category: 'Accessories', 
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b188?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Mechanical keyboard with hot-swappable switches.'
  },
  { 
    id: 7, 
    name: 'Samsung T7 Shield', 
    price: 149.99, 
    category: 'Storage', 
    image: 'https://images.unsplash.com/photo-1597871040916-001375c803c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: '1TB Portable SSD with rugged design and fast transfer speeds.'
  },
  { 
    id: 8, 
    name: 'Bose QuietComfort 45', 
    price: 329.99, 
    category: 'Audio', 
    image: 'https://images.unsplash.com/photo-1639754398964-c5a0508666b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Premium noise cancelling headphones with crystal-clear audio.'
  },
];

const categories = ['All', ...new Set(products.map(product => product.category))];

const Products = ({ addToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Our Products
      </Typography>
      
      {/* Search and Filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          label="Search products"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="category-filter-label">Category</InputLabel>
          <Select
            labelId="category-filter-label"
            value={category}
            label="Category"
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Products Grid */}
      {paginatedProducts.length > 0 ? (
        <>
          <Grid container spacing={4}>
            {paginatedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {product.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 2 }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Stack spacing={2}>
                <Pagination 
                  count={pageCount} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                />
              </Stack>
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No products found matching your criteria.
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => {
              setSearchTerm('');
              setCategory('All');
            }}
          >
            Clear Filters
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Products;
