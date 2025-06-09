require('dotenv').config({ path: '.env.production' })
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
)

const Product = mongoose.model('Product', productSchema)

const products = [
  {
    name: 'Áo Thun Cotton Cổ Điển',
    description: 'Áo thun cotton thoải mái, hoàn hảo cho việc mặc hàng ngày.',
    price: 299000,
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    category: 'Áo Thun',
    rating: 4.5,
    reviews: 128
  },
  {
    name: 'Quần Jeans Ôm',
    description: 'Quần jeans ôm hiện đại với chất liệu co giãn thoải mái.',
    price: 799000,
    imageUrl:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    category: 'Quần Jeans',
    rating: 4.2,
    reviews: 89
  },
  {
    name: 'Váy Hoa Mùa Hè',
    description: 'Váy hoa nhẹ nhàng, thích hợp cho những ngày hè tươi mát.',
    price: 899000,
    imageUrl:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    category: 'Váy',
    rating: 4.8,
    reviews: 156
  },
  {
    name: 'Áo Khoác Da',
    description: 'Áo khoác da cao cấp với thiết kế cổ điển.',
    price: 1999000,
    imageUrl:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    category: 'Áo Khoác',
    rating: 4.6,
    reviews: 203
  }
]

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB...')

    await Product.deleteMany({})
    console.log('Cleared existing products')

    await Product.insertMany(products)
    console.log('Products seeded successfully!')

    await mongoose.connection.close()
    console.log('Database connection closed')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding products:', error)
    process.exit(1)
  }
}

seedProducts()
