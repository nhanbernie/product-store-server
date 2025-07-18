import { Request, Response } from 'express'
import Product from '../../models/product.model.js'
import logger from '../../utils/logger.js'

const createResponse = (statusCode: number, data: any, message: string) => ({
  statusCode,
  data,
  message,
  timestamp: new Date().toISOString()
})

// Get all products (public)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({})
    logger.info('Products fetched successfully', { count: products.length })
    res.json(createResponse(200, products, 'Products fetched successfully'))
  } catch (error) {
    logger.error('Error fetching products', { error })
    res.status(500).json(createResponse(500, [], 'Error fetching products'))
  }
}

// Get single product by ID (public)
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      res.status(404).json(createResponse(404, [], 'Product not found'))
      return
    }
    res.json(createResponse(200, [product], 'Product fetched successfully'))
  } catch (error) {
    logger.error('Error fetching product', { error, productId: req.params.id })
    res.status(500).json(createResponse(500, [], 'Error fetching product'))
  }
}

// Create new product (admin only)
export const createProduct = async (req: Request, res: Response) => {
  try {
    // Lấy thông tin admin từ request (đã được set bởi middleware)
    const adminId = (req as any).user.userId

    const product = new Product(req.body)
    const savedProduct = await product.save()

    logger.info('Product created successfully', {
      productId: savedProduct._id,
      adminId: adminId,
      productName: savedProduct.name
    })

    res.status(201).json(createResponse(201, [savedProduct], 'Product created successfully'))
  } catch (error) {
    logger.error('Error creating product', { error })
    res.status(400).json(createResponse(400, [], 'Error creating product'))
  }
}

// Update product (admin only)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    // Lấy thông tin admin từ request (đã được set bởi middleware)
    const adminId = (req as any).user.userId

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!product) {
      res.status(404).json(createResponse(404, [], 'Product not found'))
      return
    }

    logger.info('Product updated successfully', {
      productId: req.params.id,
      adminId: adminId,
      productName: product.name
    })

    res.json(createResponse(200, [product], 'Product updated successfully'))
  } catch (error) {
    logger.error('Error updating product', { error, productId: req.params.id })
    res.status(400).json(createResponse(400, [], 'Error updating product'))
  }
}

// Delete product (admin only)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    // Lấy thông tin admin từ request (đã được set bởi middleware)
    const adminId = (req as any).user.userId

    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      res.status(404).json(createResponse(404, [], 'Product not found'))
      return
    }

    logger.info('Product deleted successfully', {
      productId: req.params.id,
      adminId: adminId,
      productName: product.name
    })

    res.json(createResponse(200, [], 'Product deleted successfully'))
  } catch (error) {
    logger.error('Error deleting product', { error, productId: req.params.id })
    res.status(500).json(createResponse(500, [], 'Error deleting product'))
  }
}
