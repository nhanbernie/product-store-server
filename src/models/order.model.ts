import mongoose from 'mongoose'

interface IOrderItem {
  productId: mongoose.Types.ObjectId
  product?: any
  quantity: number
  price: number
}

interface ICustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  district: string
  ward: string
  notes?: string
}

interface IOrder extends mongoose.Document {
  orderId: string
  customerId: mongoose.Types.ObjectId
  customerInfo: ICustomerInfo
  items: IOrderItem[]
  subtotal: number
  shippingFee: number
  total: number
  status: 'pending' | 'confirmed' | 'preparing' | 'shipping' | 'delivered' | 'cancelled' | 'returned'
  paymentMethod: 'COD'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  estimatedDelivery?: Date
  deliveredAt?: Date
  trackingNumber?: string
  createdAt: Date
  updatedAt: Date
}

const customerInfoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    district: {
      type: String,
      required: true,
      trim: true
    },
    ward: {
      type: String,
      required: true,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    }
  },
  { _id: false }
)

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema<IOrder>(
  {
    orderId: {
      type: String,
      unique: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    customerInfo: {
      type: customerInfoSchema,
      required: true
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items: IOrderItem[]) {
          return items && items.length > 0
        },
        message: 'Order must have at least one item'
      }
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    shippingFee: {
      type: Number,
      required: true,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'shipping', 'delivered', 'cancelled', 'returned'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['COD'],
      default: 'COD'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    estimatedDelivery: {
      type: Date
    },
    deliveredAt: {
      type: Date
    },
    trackingNumber: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
)

// Generate unique order ID
orderSchema.pre('save', function (next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString()
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')
    this.orderId = `ORD${timestamp}${random}`
  }
  next()
})

// Index for better query performance
orderSchema.index({ customerId: 1, createdAt: -1 })
orderSchema.index({ orderId: 1 })
orderSchema.index({ status: 1 })

const Order = mongoose.model<IOrder>('Order', orderSchema)

export default Order
