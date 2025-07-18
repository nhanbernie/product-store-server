import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

interface IUser extends mongoose.Document {
  email: string
  password: string
  name: string
  role: string
  isVerified: boolean
  phone?: string
  avatar?: string
  address?: {
    street?: string
    city?: string
    district?: string
    ward?: string
    postalCode?: string
  }
  refreshToken?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      trim: true
    },
    address: {
      street: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      },
      district: {
        type: String,
        trim: true
      },
      ward: {
        type: String,
        trim: true
      },
      postalCode: {
        type: String,
        trim: true
      }
    },
    refreshToken: {
      type: String
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model<IUser>('User', userSchema)
export default User
