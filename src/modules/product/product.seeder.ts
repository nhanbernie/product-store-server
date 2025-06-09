import dotenv from 'dotenv'
import connectDB from '../../config/db'
import Product from '../../models/product.model'
import config from '../../config'

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
})

const products = [
  {
    name: 'Áo Thun Cotton Cổ Điển',
    description: 'Áo thun cotton thoải mái, hoàn hảo cho việc mặc hàng ngày.',
    price: 29.99,
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    category: 'Áo Thun',
    rating: 4.5,
    reviews: 128
  },
  {
    name: 'Quần Jeans Ôm',
    description: 'Quần jeans ôm hiện đại với chất liệu co giãn thoải mái.',
    price: 79.99,
    imageUrl:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    category: 'Quần Jeans',
    rating: 4.2,
    reviews: 89
  },
  {
    name: 'Váy Hoa Mùa Hè',
    description: 'Váy mùa hè nhẹ nhàng với họa tiết hoa xinh đẹp.',
    price: 89.99,
    imageUrl:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    category: 'Váy',
    rating: 4.8,
    reviews: 156
  },
  {
    name: 'Áo Khoác Da',
    description: 'Áo khoác da cao cấp với thiết kế cổ điển.',
    price: 199.99,
    imageUrl:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    category: 'Áo Khoác',
    rating: 4.6,
    reviews: 203
  }
]

const seedProducts = async () => {
  try {
    await connectDB()

    // Clear existing products
    await Product.deleteMany({})
    console.log('Cleared existing products')

    // Insert new products
    await Product.insertMany(products)
    console.log('Products seeded successfully!')

    process.exit(0)
  } catch (error) {
    console.error('Error seeding products:', error)
    process.exit(1)
  }
}

seedProducts()
