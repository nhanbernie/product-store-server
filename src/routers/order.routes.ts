import { Router } from 'express'
import {
  createOrder,
  getOrderHistory,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} from '../modules/order/order.controller.js'
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js'
import { validateOrder } from '../middlewares/validation.middleware.js'

const router = Router()

// All order routes require authentication
router.use(authenticateToken)

// POST /api/orders - Create new order
router.post('/', validateOrder.create, createOrder)

// GET /api/orders/history - Get order history with filters
router.get('/history', getOrderHistory)

// GET /api/orders/:id - Get order by ID
router.get('/:id', validateOrder.validateId, getOrderById)

// PUT /api/orders/:id/cancel - Cancel order
router.put('/:id/cancel', validateOrder.validateId, cancelOrder)

// Admin routes - require admin role
// GET /api/orders/admin/all - Get all orders (admin only)
router.get('/admin/all', requireAdmin, getAllOrders)

// PUT /api/orders/:id/status - Update order status (admin only)
router.put('/:id/status', requireAdmin, validateOrder.validateId, updateOrderStatus)

export default router
