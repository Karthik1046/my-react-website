import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminSecurityNotice from './AdminSecurityNotice';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
  Avatar,
  Tooltip,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  SupervisorAccount as SupervisorIcon
} from '@mui/icons-material';

function formatDate(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

const AdminPanel = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = React.useState([]);
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, userId: null, userName: '' });
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const token = React.useMemo(() => localStorage.getItem('movieflix_token'), []);

  const fetchAll = React.useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const usersJson = await usersRes.json();
      const statsJson = await statsRes.json();
      if (usersJson.success) setUsers(usersJson.users || []);
      if (statsJson.success) setStats(statsJson.stats || null);
    } catch (e) {
      // noop
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Filter users based on search term
  React.useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm]);

  const updateRole = async (userId, role) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      const result = await response.json();
      if (result.success) {
        setSnackbar({ open: true, message: `User role updated to ${role}`, severity: 'success' });
        await fetchAll();
      } else {
        setSnackbar({ open: true, message: 'Failed to update user role', severity: 'error' });
      }
    } catch (e) {
      setSnackbar({ open: true, message: 'Error updating user role', severity: 'error' });
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
        setDeleteDialog({ open: false, userId: null, userName: '' });
        await fetchAll();
      } else {
        setSnackbar({ open: true, message: 'Failed to delete user', severity: 'error' });
      }
    } catch (e) {
      setSnackbar({ open: true, message: 'Error deleting user', severity: 'error' });
    }
  };

  const handleDeleteClick = (userId, userName) => {
    setDeleteDialog({ open: true, userId, userName });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <Box p={3}>
        <Typography variant="h6">Access denied</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AdminIcon color="primary" />
          Admin Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchAll}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>
      
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      
      <AdminSecurityNotice />
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="inherit" gutterBottom variant="body2">
                    Total Users
                  </Typography>
                  <Typography variant="h4">{stats?.totalUsers ?? (loading ? '...' : 0)}</Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="inherit" gutterBottom variant="body2">
                    Admin Users
                  </Typography>
                  <Typography variant="h4">{stats?.admins ?? (loading ? '...' : 0)}</Typography>
                </Box>
                <SupervisorIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="inherit" gutterBottom variant="body2">
                    Active Users (7d)
                  </Typography>
                  <Typography variant="h4">{stats?.activeUsers ?? (loading ? '...' : 0)}</Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#333' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="inherit" gutterBottom variant="body2">
                    New Users (30d)
                  </Typography>
                  <Typography variant="h4">{stats?.recentRegistrations ?? (loading ? '...' : 0)}</Typography>
                </Box>
                <PersonIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon />
                Recent User Activity
              </Typography>
              <Stack spacing={2}>
                {(stats?.latestUsers || []).slice(0, 5).map((u) => (
                  <Box key={u._id} display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar 
                        src={u.avatar} 
                        sx={{ width: 32, height: 32 }}
                      >
                        {u.name?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {u.name || u.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {u.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Box textAlign="right">
                      <Chip 
                        label={u.role} 
                        size="small" 
                        color={u.role === 'admin' ? 'secondary' : 'default'}
                      />
                      <Typography variant="caption" color="text.secondary" display="block">
                        Joined: {formatDate(u.joinDate || u.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                {!stats && loading && <Typography>Loading...</Typography>}
                {stats && !stats.latestUsers?.length && (
                  <Typography color="text.secondary">No recent activity</Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Paper>
          <Box p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon />
                User Management ({filteredUsers.length} users)
              </Typography>
              <TextField
                size="small"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 250 }}
              />
            </Box>
            <Divider />
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Avatar</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u._id} hover>
                    <TableCell>
                      <Avatar 
                        src={u.avatar} 
                        sx={{ width: 32, height: 32 }}
                      >
                        {u.name?.[0]}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">{u.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {u._id.slice(-6)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.role}
                        color={u.role === 'admin' ? 'secondary' : 'default'}
                        size="small"
                        icon={u.role === 'admin' ? <AdminIcon /> : <PersonIcon />}
                      />
                    </TableCell>
                    <TableCell>{formatDate(u.joinDate || u.createdAt)}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(u.lastLoginAt)}
                      </Typography>
                      {u.lastLoginAt && (
                        <Typography variant="caption" color="text.secondary">
                          {Math.floor((Date.now() - new Date(u.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title={u.role === 'admin' ? 'Already admin' : 'Make admin'}>
                          <span>
                            <IconButton
                              size="small"
                              color="secondary"
                              disabled={u.role === 'admin' || u._id === currentUser._id}
                              onClick={() => updateRole(u._id, 'admin')}
                            >
                              <AdminIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title={u.role === 'user' ? 'Already user' : 'Make user'}>
                          <span>
                            <IconButton
                              size="small"
                              color="default"
                              disabled={u.role === 'user' || u._id === currentUser._id}
                              onClick={() => updateRole(u._id, 'user')}
                            >
                              <PersonIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Delete user">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={u._id === currentUser._id}
                              onClick={() => handleDeleteClick(u._id, u.name)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {!filteredUsers.length && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      {loading ? 'Loading users...' : searchTerm ? 'No users match your search' : 'No users found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, userId: null, userName: '' })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user "{deleteDialog.userName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, userId: null, userName: '' })}>
            Cancel
          </Button>
          <Button 
            onClick={() => deleteUser(deleteDialog.userId)} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPanel;


