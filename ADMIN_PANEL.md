# 🔐 Admin Panel Documentation

## Overview

The MovieFlix Admin Panel is a comprehensive dashboard for managing users, monitoring analytics, and performing administrative tasks with advanced security features.

## Features

### 📊 **Analytics Dashboard**
- **Total Users**: Complete user count across the platform
- **Admin Users**: Number of administrators
- **Active Users**: Users who logged in within the last 7 days  
- **New Registrations**: User sign-ups in the last 30 days
- **Recent Activity**: Latest user registrations with avatars and details

### 👥 **User Management**
- **User List**: Complete table of all users with search functionality
- **Role Management**: Promote users to admin or demote to regular user
- **User Deletion**: Remove users from the system (with restrictions)
- **Search & Filter**: Find users by name, email, or role
- **User Details**: View user avatars, join dates, last login times

### 🔒 **Security Features**
- **Role-based Access Control**: Only admin users can access the panel
- **Audit Logging**: All admin actions are logged with timestamps and details
- **Rate Limiting**: Protection against excessive API requests (30 requests/minute)
- **Action Restrictions**: 
  - Cannot modify your own account
  - Cannot delete admin users (must demote first)
  - Cannot delete your own account
- **IP Tracking**: All admin actions include IP address logging

### 🎨 **User Interface**
- **Modern Design**: Material-UI components with gradient cards
- **Responsive Layout**: Works on desktop and mobile devices
- **Real-time Updates**: Live data with refresh functionality
- **Interactive Elements**: Tooltips, dialogs, and snackbar notifications
- **Security Notice**: Warning banner with active security features

## Getting Started

### 1. **Start the Application**
```bash
# Install dependencies
npm install
cd server && npm install

# Start both frontend and backend
npm run dev
```

### 2. **Create an Admin User**
```bash
# Navigate to server directory
cd server

# Make a user admin (replace with actual email)
node scripts/makeAdmin.js user@example.com
```

### 3. **Access Admin Panel**
1. Sign up for an account or log in
2. Use the script above to make your account admin
3. Log out and log back in
4. Navigate to `/admin` or click "Admin" in the header

## API Endpoints

### **User Management**
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get analytics statistics

### **Authentication Required**
All admin endpoints require:
- Valid JWT token in Authorization header
- User must have `role: 'admin'`

## Security Considerations

### **Audit Logging**
All admin actions are logged to the console with:
- Admin user ID
- Action performed
- Target user (if applicable)
- Timestamp
- Additional details (old/new values, etc.)
- IP address

Example log entry:
```
[AUDIT LOG] Admin 647abc123def456789 performed action: DELETE_USER {
  timestamp: '2024-01-15T10:30:00.000Z',
  adminId: '647abc123def456789',
  action: 'DELETE_USER',
  targetUserId: '647def456abc789123',
  details: {
    deletedUserEmail: 'user@example.com',
    deletedUserName: 'John Doe',
    deletedUserRole: 'user',
    ip: '192.168.1.100'
  }
}
```

### **Rate Limiting**
- 30 requests per minute per admin user
- Automatically clears old requests
- Returns 429 status when limit exceeded

### **Action Restrictions**
- ✅ Admins can promote/demote other users
- ✅ Admins can delete regular users
- ❌ Admins cannot modify their own role
- ❌ Admins cannot delete their own account
- ❌ Admins cannot delete other admin users (must demote first)

## File Structure

```
src/components/
├── AdminPanel.js              # Main admin dashboard
├── AdminSecurityNotice.js     # Security warning component
└── Header.js                  # Navigation with admin link

server/
├── routes/
│   └── admin.js              # Admin API endpoints
├── middleware/
│   └── auth.js               # Authentication & authorization
├── models/
│   └── User.js               # User schema with role field
└── scripts/
    └── makeAdmin.js          # Script to promote users
```

## Customization

### **Adding New Stats**
1. Update the stats endpoint in `server/routes/admin.js`
2. Add new stat cards to `AdminPanel.js`
3. Update the analytics section with new metrics

### **Adding New User Actions**
1. Create new API endpoint in admin routes
2. Add corresponding frontend function
3. Include audit logging
4. Update security restrictions as needed

### **Modifying Security**
- Rate limits can be adjusted in `admin.js`
- Audit log format can be customized
- Additional restrictions can be added to specific actions

## Troubleshooting

### **"Access Denied" Error**
- Ensure user has `role: 'admin'` in database
- Check JWT token is valid and included in requests
- Verify admin middleware is working

### **Rate Limit Exceeded**
- Wait 1 minute for rate limit to reset
- Reduce frequency of admin actions
- Check for excessive refresh clicks

### **Admin Link Not Showing**
- Confirm user role is 'admin'
- Check Header.js conditional rendering
- Verify authentication state

## Production Considerations

1. **Database Audit Logs**: Store audit logs in database instead of console
2. **Email Notifications**: Notify on critical admin actions
3. **IP Restrictions**: Limit admin access to specific IP ranges
4. **Session Management**: Implement admin session timeouts
5. **Backup Strategy**: Regular backups before user deletions

## Support

For technical issues or questions about the admin panel:
1. Check server console logs for detailed error messages
2. Verify database connection and user permissions  
3. Test API endpoints directly using tools like Postman
4. Review audit logs for security-related issues

---

**⚠️ Important**: Always use admin privileges responsibly. All actions are logged and monitored for security purposes.