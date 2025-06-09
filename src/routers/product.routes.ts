import { Router, Request, Response } from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../modules/product/product.controller'

const router = Router()

// GET /api/products Get all products
router.get('/', async (req: Request, res: Response) => {
  await getProducts(req, res)
})

// GET /api/products/:id - Get single product
router.get('/:id', async (req: Request, res: Response) => {
  await getProductById(req, res)
})

// POST /api/products - Create new product
router.post('/', async (req: Request, res: Response) => {
  await createProduct(req, res)
})

// PUT /api/products/:id - Update product
router.put('/:id', async (req: Request, res: Response) => {
  await updateProduct(req, res)
})

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req: Request, res: Response) => {
  await deleteProduct(req, res)
})

export default router
