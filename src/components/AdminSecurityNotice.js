import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  Shield as ShieldIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const AdminSecurityNotice = () => {
  const securityFeatures = [
    {
      icon: <LockIcon />,
      title: 'Role-based Access Control',
      description: 'Only admin users can access this panel'
    },
    {
      icon: <SecurityIcon />,
      title: 'Audit Logging',
      description: 'All admin actions are logged and monitored'
    },
    {
      icon: <ShieldIcon />,
      title: 'Rate Limiting',
      description: 'Protection against excessive API requests'
    },
    {
      icon: <WarningIcon />,
      title: 'Action Restrictions',
      description: 'Cannot modify your own account or delete admin users'
    }
  ];

  return (
    <Card sx={{ mb: 3, border: '2px solid', borderColor: 'warning.main' }}>
      <CardContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <AlertTitle>Admin Panel Security Notice</AlertTitle>
          You have administrative privileges. Please use these powers responsibly.
        </Alert>
        
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SecurityIcon color="primary" />
          Active Security Features
        </Typography>
        
        <List dense>
          {securityFeatures.map((feature, index) => (
            <ListItem key={index}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {React.cloneElement(feature.icon, { color: 'primary', fontSize: 'small' })}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" fontWeight="medium">
                      {feature.title}
                    </Typography>
                    <Chip label="ACTIVE" size="small" color="success" variant="outlined" />
                  </Box>
                }
                secondary={feature.description}
              />
            </ListItem>
          ))}
        </List>
        
        <Box mt={2} p={2} sx={{ backgroundColor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            ⚠️ All administrative actions are logged with timestamps, IP addresses, and user details for security auditing purposes.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdminSecurityNotice;