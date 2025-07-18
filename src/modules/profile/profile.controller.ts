import { Request, Response } from 'express'
import User from '../../models/user.model.js'
import logger from '../../utils/logger.js'
import cloudinary from '../../config/cloudinary.js'

const createResponse = (statusCode: number, data: any, message: string) => ({
  statusCode,
  data,
  message,
  timestamp: new Date().toISOString()
})

// GET /api/profile - Xem thông tin profile của user hiện tại
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId

    const user = await User.findById(userId).select('-password -refreshToken -resetPasswordToken -resetPasswordExpires')

    if (!user) {
      res.status(404).json(createResponse(404, [], 'User not found'))
      return
    }

    logger.info('Profile fetched successfully', { userId })

    res.json(createResponse(200, [user], 'Profile fetched successfully'))
  } catch (error) {
    logger.error('Error fetching profile', { error })
    res.status(500).json(createResponse(500, [], 'Error fetching profile'))
  }
}

// PUT /api/profile - Cập nhật thông tin profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId
    const { name, email, phone, avatar, address, currentPassword, newPassword } = req.body

    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json(createResponse(404, [], 'User not found'))
      return
    }

    // Kiểm tra nếu email mới đã tồn tại (nếu có thay đổi email)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        res.status(400).json(createResponse(400, [], 'Email already exists'))
        return
      }
    }

    // Kiểm tra mật khẩu hiện tại nếu muốn đổi mật khẩu
    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json(createResponse(400, [], 'Current password is required to change password'))
        return
      }

      const isCurrentPasswordValid = await user.comparePassword(currentPassword)
      if (!isCurrentPasswordValid) {
        res.status(400).json(createResponse(400, [], 'Current password is incorrect'))
        return
      }

      // Cập nhật mật khẩu mới
      user.password = newPassword
    }

    // Cập nhật các thông tin khác
    if (name) user.name = name
    if (email) user.email = email
    if (phone) user.phone = phone
    if (avatar) user.avatar = avatar

    // Cập nhật địa chỉ
    if (address) {
      if (!user.address) user.address = {}
      if (address.street !== undefined) user.address.street = address.street
      if (address.city !== undefined) user.address.city = address.city
      if (address.district !== undefined) user.address.district = address.district
      if (address.ward !== undefined) user.address.ward = address.ward
      if (address.postalCode !== undefined) user.address.postalCode = address.postalCode
    }

    await user.save()

    // Trả về thông tin user đã cập nhật (không bao gồm password)
    const updatedUser = await User.findById(userId).select(
      '-password -refreshToken -resetPasswordToken -resetPasswordExpires'
    )

    logger.info('Profile updated successfully', {
      userId,
      updatedFields: {
        name: !!name,
        email: !!email,
        phone: !!phone,
        avatar: !!avatar,
        address: !!address,
        password: !!newPassword
      }
    })

    res.json(createResponse(200, [updatedUser], 'Profile updated successfully'))
  } catch (error) {
    logger.error('Error updating profile', { error })
    res.status(500).json(createResponse(500, [], 'Error updating profile'))
  }
}

// POST /api/profile/avatar - Upload avatar
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId

    if (!req.file) {
      res.status(400).json(createResponse(400, [], 'No image file provided'))
      return
    }

    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json(createResponse(404, [], 'User not found'))
      return
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'avatars',
      public_id: `avatar_${userId}`,
      overwrite: true,
      transformation: [{ width: 300, height: 300, crop: 'fill' }, { quality: 'auto' }]
    })

    // Update user avatar
    user.avatar = result.secure_url
    await user.save()

    // Return updated user info
    const updatedUser = await User.findById(userId).select(
      '-password -refreshToken -resetPasswordToken -resetPasswordExpires'
    )

    logger.info('Avatar uploaded successfully', { userId, avatarUrl: result.secure_url })

    res.json(createResponse(200, [{ user: updatedUser, avatarUrl: result.secure_url }], 'Avatar uploaded successfully'))
  } catch (error) {
    logger.error('Error uploading avatar', { error })
    res.status(500).json(createResponse(500, [], 'Error uploading avatar'))
  }
}
