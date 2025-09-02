import React, { useState } from 'react';
import { Box, Button, Paper, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Calculator = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [result, setResult] = useState('0');

  // Safe mathematical expression evaluator without eval
  const calculateResult = (expression) => {
    try {
      // Replace × with * and ÷ with / for evaluation
      const cleanExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
      
      // Use a safer approach with Function constructor
      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + cleanExpression)();
      
      // Check if result is finite and valid
      if (!isFinite(result) || isNaN(result)) {
        throw new Error('Invalid result');
      }
      
      return result.toString();
    } catch (error) {
      return 'Error';
    }
  };

  const handleClick = (value) => {
    if (value === '=') {
      try {
        const calculatedResult = calculateResult(input);
        setResult(calculatedResult);
        setInput(calculatedResult === 'Error' ? input : calculatedResult);
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('0');
    } else if (value === '⌫') {
      setInput(input.slice(0, -1));
    } else {
      setInput(input + value);
    }
  };

  const buttons = [
    '7', '8', '9', '⌫',
    '4', '5', '6', '×',
    '1', '2', '3', '÷',
    '0', '.', '=', '+',
    'C', '(', ')', '-'
  ];

  return (
    <Box sx={{ maxWidth: 400, margin: '40px auto', padding: 2 }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to Home
      </Button>
      
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
        <Typography 
          variant="h5" 
          align="right" 
          sx={{ 
            p: 2, 
            mb: 2, 
            minHeight: '32px',
            border: '1px solid #ddd',
            borderRadius: 1,
            backgroundColor: 'white',
            wordWrap: 'break-word'
          }}
        >
          {input || '0'}
        </Typography>
        
        <Typography 
          variant="h4" 
          align="right" 
          sx={{ 
            p: 2, 
            mb: 3, 
            minHeight: '48px',
            border: '1px solid #ddd',
            borderRadius: 1,
            backgroundColor: 'white',
            fontWeight: 'bold'
          }}
        >
          {result}
        </Typography>

        <Grid container spacing={1}>
          {buttons.map((btn) => (
            <Grid item xs={3} key={btn}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleClick(btn)}
                sx={{
                  height: '60px',
                  fontSize: '1.2rem',
                  backgroundColor: 
                    btn === '=' ? '#1976d2' : 
                    btn === 'C' ? '#f44336' : 
                    btn === '⌫' ? '#ff9800' :
                    'white',
                  color: 
                    btn === '=' || btn === 'C' || btn === '⌫' ? 'white' : 'black',
                  '&:hover': {
                    backgroundColor: 
                      btn === '=' ? '#1565c0' : 
                      btn === 'C' ? '#d32f2f' : 
                      btn === '⌫' ? '#f57c00' :
                      '#f0f0f0',
                  },
                }}
              >
                {btn}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Calculator;
