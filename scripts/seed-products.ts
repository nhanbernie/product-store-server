import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { Schema } from 'mongoose'

dotenv.config({ path: '.env.production' })

const productSchema = new Schema(
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
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Áo Thun',
    rating: 4.5,
    reviews: 128
  },
  {
    name: 'Quần Jeans Slim Fit',
    description: 'Quần jeans ôm hiện đại với chất liệu co giãn thoải mái.',
    price: 799000,
    imageUrl:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Quần Jeans',
    rating: 4.2,
    reviews: 89
  },
  {
    name: 'Váy Hoa Mùa Hè',
    description: 'Váy hoa nhẹ nhàng, thích hợp cho những ngày hè tươi mát.',
    price: 899000,
    imageUrl:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Váy',
    rating: 4.8,
    reviews: 156
  },
  {
    name: 'Áo Khoác Da Vintage',
    description: 'Áo khoác da cao cấp với thiết kế cổ điển.',
    price: 1999000,
    imageUrl:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Áo Khoác',
    rating: 4.6,
    reviews: 203
  },
  {
    name: 'Áo Sơ Mi Trắng Công Sở',
    description: 'Áo sơ mi trắng thanh lịch, phù hợp môi trường công sở.',
    price: 549000,
    imageUrl:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Áo Sơ Mi',
    rating: 4.7,
    reviews: 167
  },
  {
    name: 'Quần Tây Nam Đen',
    description: 'Quần tây đen basic, dễ phối đồ và lịch sự.',
    price: 699000,
    imageUrl:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Quần Tây',
    rating: 4.4,
    reviews: 92
  },
  {
    name: 'Áo Len Cổ Lọ',
    description: 'Áo len cổ lọ ấm áp cho mùa đông.',
    price: 799000,
    imageUrl:
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Áo Len',
    rating: 4.3,
    reviews: 145
  },
  {
    name: 'Đầm Dự Tiệc Đen',
    description: 'Đầm dự tiệc màu đen sang trọng và quyến rũ.',
    price: 1599000,
    imageUrl:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Đầm',
    rating: 4.9,
    reviews: 178
  },
  {
    name: 'Áo Polo Nam Thể Thao',
    description: 'Áo polo thể thao thoáng mát, thấm hút mồ hôi tốt.',
    price: 449000,
    imageUrl:
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Áo Polo',
    rating: 4.5,
    reviews: 134
  },
  {
    name: 'Quần Short Jean',
    description: 'Quần short jean năng động cho mùa hè.',
    price: 399000,
    imageUrl:
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Quần Short',
    rating: 4.3,
    reviews: 98
  },
  {
    name: 'Áo Khoác Bomber',
    description: 'Áo khoác bomber phong cách thể thao.',
    price: 1299000,
    imageUrl:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Áo Khoác',
    rating: 4.7,
    reviews: 165
  },
  {
    name: 'Chân Váy Xếp Ly',
    description: 'Chân váy xếp ly thanh lịch và nữ tính.',
    price: 599000,
    imageUrl:
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Chân Váy',
    rating: 4.6,
    reviews: 112
  },
  {
    name: 'Áo Blazer Nữ',
    description: 'Áo blazer nữ kiểu dáng hiện đại.',
    price: 1499000,
    imageUrl:
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Áo Blazer',
    rating: 4.8,
    reviews: 143
  },
  {
    name: 'Quần Culottes',
    description: 'Quần culottes rộng thoải mái và thời trang.',
    price: 699000,
    imageUrl:
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Quần',
    rating: 4.4,
    reviews: 87
  },
  {
    name: 'Áo Croptop Nữ',
    description: 'Áo croptop trẻ trung năng động.',
    price: 299000,
    imageUrl:
      'https://images.unsplash.com/photo-1598211686290-a8ef209d87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Áo',
    rating: 4.3,
    reviews: 156
  },
  {
    name: 'Quần Jogger Nam',
    description: 'Quần jogger thể thao nam năng động.',
    price: 499000,
    imageUrl:
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Quần Jogger',
    rating: 4.5,
    reviews: 198
  },
  {
    name: 'Áo Hoodie Basic',
    description: 'Áo hoodie basic đa năng dễ phối đồ.',
    price: 699000,
    imageUrl:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Áo Hoodie',
    rating: 4.6,
    reviews: 245
  },
  {
    name: 'Đầm Công Sở',
    description: 'Đầm công sở thanh lịch và chuyên nghiệp.',
    price: 899000,
    imageUrl:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Đầm',
    rating: 4.7,
    reviews: 167
  },
  {
    name: 'Set Đồ Thể Thao Nữ',
    description: 'Bộ đồ thể thao nữ năng động.',
    price: 799000,
    imageUrl:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Đồ Thể Thao',
    rating: 4.8,
    reviews: 189
  },
  {
    name: 'Áo Vest Nam',
    description: 'Áo vest nam lịch lãm cho các sự kiện quan trọng.',
    price: 2499000,
    imageUrl:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Áo Vest',
    rating: 4.9,
    reviews: 134
  }
]

async function seedProducts(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
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
