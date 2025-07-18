import { Request, Response } from 'express'
import Order from '../../models/order.model.js'
import Product from '../../models/product.model.js'
import logger from '../../utils/logger.js'

const createResponse = (statusCode: number, data: any, message: string) => ({
  statusCode,
  data,
  message,
  timestamp: new Date().toISOString()
})

// Create new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.userId

    if (!customerId) {
      res.status(401).json(createResponse(401, [], 'User not authenticated'))
      return
    }

    const { customerInfo, items, subtotal, shippingFee, total, paymentMethod } = req.body

    // Validate products exist and prices match
    const productIds = items.map((item: any) => item.productId)
    const products = await Product.find({ _id: { $in: productIds } })

    if (products.length !== productIds.length) {
      res.status(400).json(createResponse(400, [], 'Some products not found'))
      return
    }

    // Validate prices (optional - for security)
    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.productId)
      if (!product) {
        res.status(400).json(createResponse(400, [], `Product ${item.productId} not found`))
        return
      }
      // You can add price validation here if needed
      // if (product.price !== item.price) {
      //   res.status(400).json(createResponse(400, [], 'Product price mismatch'))
      //   return
      // }
    }

    // Create order
    const order = new Order({
      customerId,
      customerInfo,
      items,
      subtotal,
      shippingFee,
      total,
      paymentMethod,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    })

    await order.save()

    // Populate product details for response
    await order.populate('items.productId', 'name description price imageUrl category')

    // Format response
    const responseData = {
      id: order._id,
      orderId: order.orderId,
      customerId: order.customerId,
      customerInfo: order.customerInfo,
      items: order.items.map((item: any) => ({
        id: item._id,
        product: {
          _id: item.productId._id,
          name: item.productId.name,
          description: item.productId.description,
          price: item.productId.price,
          imageUrl: item.productId.imageUrl,
          category: item.productId.category
        },
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }

    logger.info('Order created successfully', {
      orderId: order.orderId,
      customerId,
      total: order.total
    })

    res.status(201).json(createResponse(201, responseData, 'Order created successfully'))
  } catch (error) {
    logger.error('Error creating order', {
      error: error instanceof Error ? error.message : error,
      customerId: (req as any).user?.userId
    })
    res.status(500).json(createResponse(500, [], 'Error creating order'))
  }
}

// Get order history
export const getOrderHistory = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user.userId
    const { page = 1, limit = 10, status, dateFrom, dateTo, search } = req.query

    // Build query
    const query: any = { customerId }

    if (status) {
      query.status = status
    }

    if (dateFrom || dateTo) {
      query.createdAt = {}
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom as string)
      if (dateTo) query.createdAt.$lte = new Date(dateTo as string)
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'items.productId.name': { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)

    const orders = await Order.find(query)
      .populate('items.productId', 'name description price imageUrl category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await Order.countDocuments(query)

    // Format response
    const formattedOrders = orders.map((order) => ({
      id: order._id,
      orderId: order.orderId,
      customerId: order.customerId,
      customerInfo: order.customerInfo,
      items: order.items.map((item: any) => ({
        id: item._id,
        product: {
          _id: item.productId._id,
          name: item.productId.name,
          description: item.productId.description,
          price: item.productId.price,
          imageUrl: item.productId.imageUrl,
          category: item.productId.category
        },
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      estimatedDelivery: order.estimatedDelivery,
      deliveredAt: order.deliveredAt,
      trackingNumber: order.trackingNumber
    }))

    const responseData = {
      orders: formattedOrders,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }

    logger.info('Order history fetched', {
      customerId,
      count: orders.length,
      page: Number(page)
    })

    res.json(createResponse(200, responseData, 'Order history retrieved successfully'))
  } catch (error) {
    logger.error('Error fetching order history', { error, customerId: (req as any).user.userId })
    res.status(500).json(createResponse(500, [], 'Error fetching order history'))
  }
}

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user.userId
    const orderId = req.params.id

    const order = await Order.findOne({ _id: orderId, customerId }).populate(
      'items.productId',
      'name description price imageUrl category'
    )

    if (!order) {
      res.status(404).json(createResponse(404, [], 'Order not found'))
      return
    }

    // Format response
    const responseData = {
      id: order._id,
      orderId: order.orderId,
      customerId: order.customerId,
      customerInfo: order.customerInfo,
      items: order.items.map((item: any) => ({
        id: item._id,
        product: {
          _id: item.productId._id,
          name: item.productId.name,
          description: item.productId.description,
          price: item.productId.price,
          imageUrl: item.productId.imageUrl,
          category: item.productId.category
        },
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      estimatedDelivery: order.estimatedDelivery,
      deliveredAt: order.deliveredAt,
      trackingNumber: order.trackingNumber
    }

    logger.info('Order retrieved', { orderId: order.orderId, customerId })

    res.json(createResponse(200, responseData, 'Order retrieved successfully'))
  } catch (error) {
    logger.error('Error fetching order', { error, orderId: req.params.id, customerId: (req as any).user.userId })
    res.status(500).json(createResponse(500, [], 'Error fetching order'))
  }
}

// Cancel order
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user.userId
    const orderId = req.params.id

    const order = await Order.findOne({ _id: orderId, customerId })

    if (!order) {
      res.status(404).json(createResponse(404, [], 'Order not found'))
      return
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled', 'returned'].includes(order.status)) {
      res.status(400).json(createResponse(400, [], `Cannot cancel order with status: ${order.status}`))
      return
    }

    // Update order status
    order.status = 'cancelled'
    order.updatedAt = new Date()
    await order.save()

    // Populate for response
    await order.populate('items.productId', 'name description price imageUrl category')

    // Format response
    const responseData = {
      id: order._id,
      orderId: order.orderId,
      customerId: order.customerId,
      customerInfo: order.customerInfo,
      items: order.items.map((item: any) => ({
        id: item._id,
        product: {
          _id: item.productId._id,
          name: item.productId.name,
          description: item.productId.description,
          price: item.productId.price,
          imageUrl: item.productId.imageUrl,
          category: item.productId.category
        },
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      estimatedDelivery: order.estimatedDelivery,
      deliveredAt: order.deliveredAt,
      trackingNumber: order.trackingNumber
    }

    logger.info('Order cancelled', { orderId: order.orderId, customerId })

    res.json(createResponse(200, responseData, 'Order cancelled successfully'))
  } catch (error) {
    logger.error('Error cancelling order', { error, orderId: req.params.id, customerId: (req as any).user.userId })
    res.status(500).json(createResponse(500, [], 'Error cancelling order'))
  }
}

// Admin: Get all orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, dateFrom, dateTo, search } = req.query

    // Build query
    const query: any = {}

    if (status) {
      query.status = status
    }

    if (dateFrom || dateTo) {
      query.createdAt = {}
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom as string)
      if (dateTo) query.createdAt.$lte = new Date(dateTo as string)
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'customerInfo.name': { $regex: search, $options: 'i' } },
        { 'customerInfo.email': { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)

    const orders = await Order.find(query)
      .populate('items.productId', 'name description price imageUrl category')
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await Order.countDocuments(query)

    const responseData = {
      orders,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }

    logger.info('All orders fetched by admin', {
      adminId: (req as any).user.userId,
      count: orders.length,
      page: Number(page)
    })

    res.json(createResponse(200, responseData, 'Orders retrieved successfully'))
  } catch (error) {
    logger.error('Error fetching all orders', { error, adminId: (req as any).user.userId })
    res.status(500).json(createResponse(500, [], 'Error fetching orders'))
  }
}

// Admin: Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status, trackingNumber } = req.body
    const orderId = req.params.id
    const adminId = (req as any).user.userId

    const validStatuses = ['pending', 'confirmed', 'preparing', 'shipping', 'delivered', 'cancelled', 'returned']
    if (!validStatuses.includes(status)) {
      res.status(400).json(createResponse(400, [], 'Invalid status'))
      return
    }

    const order = await Order.findById(orderId)

    if (!order) {
      res.status(404).json(createResponse(404, [], 'Order not found'))
      return
    }

    // Update order
    order.status = status
    if (trackingNumber) order.trackingNumber = trackingNumber
    if (status === 'delivered') order.deliveredAt = new Date()
    order.updatedAt = new Date()

    await order.save()

    logger.info('Order status updated by admin', {
      orderId: order.orderId,
      newStatus: status,
      adminId
    })

    res.json(createResponse(200, order, 'Order status updated successfully'))
  } catch (error) {
    logger.error('Error updating order status', { error, orderId: req.params.id, adminId: (req as any).user.userId })
    res.status(500).json(createResponse(500, [], 'Error updating order status'))
  }
}
