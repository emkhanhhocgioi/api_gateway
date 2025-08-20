const jwt = require('jsonwebtoken');
const axios = require('axios');
const { TRIP_SERVICE_URL } = require('../config/env');

// Middleware to verify admin JWT token
const verifyAdminToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token không được cung cấp'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin_secret_key');
    
    // Verify admin exists and is active by calling Trip Service
    try {
      const response = await axios.get(`${TRIP_SERVICE_URL}/api/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.success) {
        return res.status(401).json({
          success: false,
          message: 'Admin không tồn tại hoặc đã bị vô hiệu hóa'
        });
      }

      // Add admin info to request
      req.admin = response.data.admin;
      next();
    } catch (serviceError) {
      if (serviceError.response && serviceError.response.status === 401) {
        return res.status(401).json({
          success: false,
          message: 'Admin không tồn tại hoặc đã bị vô hiệu hóa'
        });
      }
      throw serviceError;
    }

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn'
      });
    }
    
    console.error('Admin auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server nội bộ'
    });
  }
};

// Middleware to check permissions
const checkPermission = (resource, action) => {
  return (req, res, next) => {
    try {
      const { permissions } = req.admin;
      
      if (!permissions[resource] || !permissions[resource][action]) {
        return res.status(403).json({
          success: false,
          message: `Bạn không có quyền ${action} cho ${resource}`
        });
      }
      
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server nội bộ'
      });
    }
  };
};

// Middleware to check if admin is super admin
const requireSuperAdmin = (req, res, next) => {
  try {
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ super admin mới có thể thực hiện hành động này'
      });
    }
    next();
  } catch (error) {
    console.error('Super admin check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server nội bộ'
    });
  }
};

module.exports = {
  verifyAdminToken,
  checkPermission,
  requireSuperAdmin
};
