const express = require("express");
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const RoleController = require('../controllers/RoleController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Admin Account Management - Chỉ Super Admin mới được access
router.post('/create', authMiddleware, AdminController.createAdminAccount);
router.get('/get-all', authMiddleware, AdminController.getAllAdminAccounts);
router.get('/get-details/:id', authMiddleware, AdminController.getAdminById);
router.put('/update/:id', authMiddleware, AdminController.updateAdminAccount);
router.delete('/delete/:id', authMiddleware, AdminController.deleteAdminAccount);
router.put('/change-password/:id', authMiddleware, AdminController.changeAdminPassword);

// Role Management
router.get('/roles/templates', authMiddleware, RoleController.getAllRoleTemplates);
router.get('/roles/permissions/:roleKey', authMiddleware, RoleController.getPermissionsByRole);
router.put('/roles/update-permissions/:userId', authMiddleware, RoleController.updateUserPermissions);

module.exports = router;