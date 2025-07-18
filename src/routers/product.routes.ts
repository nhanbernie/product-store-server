import { Router } from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../modules/product/product.controller.js'
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js'

const router = Router()

// Public routes - không cần authentication
// GET /api/products - Xem tất cả sản phẩm (public)
router.get('/', getProducts)

// GET /api/products/:id - Xem chi tiết sản phẩm (public)
router.get('/:id', getProductById)

// Admin-only routes - cần authentication và admin role
// POST /api/products - Tạo sản phẩm mới (chỉ admin)
router.post('/', authenticateToken, requireAdmin, createProduct)

// PUT /api/products/:id - Cập nhật sản phẩm (chỉ admin)
router.put('/:id', authenticateToken, requireAdmin, updateProduct)

// DELETE /api/products/:id - Xóa sản phẩm (chỉ admin)
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct)

export default router
