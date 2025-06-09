import { Request, Response } from 'express'
import Product from '../../models/product.model'
import logger from '../../utils/logger'

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({})
    logger.info('Products fetched successfully', { count: products.length })
    res.json(products)
  } catch (error) {
    logger.error('Error fetching products', { error })
    res.status(500).json({ message: 'Error fetching products', error })
  }
}

// Get single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error })
  }
}

// Create new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body)
    const savedProduct = await product.save()
    res.status(201).json(savedProduct)
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error })
  }
}

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error })
  }
}

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error })
  }
}
