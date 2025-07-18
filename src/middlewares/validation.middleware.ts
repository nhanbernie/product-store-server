import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'

const createResponse = (statusCode: number, data: any, message: string) => ({
  statusCode,
  data,
  message,
  timestamp: new Date().toISOString()
})

export const validateAuth = {
  register: (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      name: Joi.string().min(2).required()
    })

    const { error } = schema.validate(req.body)
    if (error) {
      res.status(400).json(createResponse(400, [], error.details[0].message))
      return
    }
    next()
  },

  login: (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })

    const { error } = schema.validate(req.body)
    if (error) {
      res.status(400).json(createResponse(400, [], error.details[0].message))
      return
    }
    next()
  },

  forgotPassword: (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      email: Joi.string().email().required()
    })

    const { error } = schema.validate(req.body)
    if (error) {
      res.status(400).json(createResponse(400, [], error.details[0].message))
      return
    }
    next()
  },

  resetPassword: (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      resetId: Joi.string().required(),
      resetCode: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required(),
      newPassword: Joi.string().min(6).required()
    })

    const { error } = schema.validate(req.body)
    if (error) {
      res.status(400).json(createResponse(400, [], error.details[0].message))
      return
    }
    next()
  },

  verifyResetCode: (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      resetId: Joi.string().required(),
      resetCode: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
    })

    const { error } = schema.validate(req.body)
    if (error) {
      res.status(400).json(createResponse(400, [], error.details[0].message))
      return
    }
    next()
  },

  refreshToken: (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      refreshToken: Joi.string().required()
    })

    const { error } = schema.validate(req.body)
    if (error) {
      res.status(400).json(createResponse(400, [], error.details[0].message))
      return
    }
    next()
  }
}

export const validateProfile = {
  update: (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      name: Joi.string().min(2).max(100).optional(),
      email: Joi.string().email().optional(),
      phone: Joi.string().min(10).max(15).optional(),
      avatar: Joi.string().uri().optional(),
      address: Joi.object({
        street: Joi.string().max(200).optional(),
        city: Joi.string().max(50).optional(),
        district: Joi.string().max(50).optional(),
        ward: Joi.string().max(50).optional(),
        postalCode: Joi.string().max(10).optional()
      }).optional(),
      currentPassword: Joi.string().min(6).when('newPassword', {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.optional()
      }),
      newPassword: Joi.string().min(6).optional()
    }).with('newPassword', 'currentPassword')

    const { error } = schema.validate(req.body)
    if (error) {
      res.status(400).json(createResponse(400, [], error.details[0].message))
      return
    }
    next()
  }
}

export const validateOrder = {
  create: (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      customerInfo: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().min(10).max(15).required(),
        address: Joi.string().min(10).max(200).required(),
        city: Joi.string().min(2).max(50).required(),
        district: Joi.string().min(2).max(50).required(),
        ward: Joi.string().min(2).max(50).required(),
        notes: Joi.string().max(500).allow('').optional()
      }).required(),
      items: Joi.array()
        .items(
          Joi.object({
            productId: Joi.string()
              .pattern(/^[0-9a-fA-F]{24}$/)
              .required(),
            quantity: Joi.number().integer().min(1).required(),
            price: Joi.number().positive().required()
          })
        )
        .min(1)
        .required(),
      subtotal: Joi.number().min(0).required(),
      shippingFee: Joi.number().min(0).required(),
      total: Joi.number().min(0).required(),
      paymentMethod: Joi.string().valid('COD').required()
    })

    const { error } = schema.validate(req.body)
    if (error) {
      res.status(400).json(createResponse(400, [], error.details[0].message))
      return
    }
    next()
  },

  validateId: (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
    })

    const { error } = schema.validate(req.params)
    if (error) {
      res.status(400).json(createResponse(400, [], 'Invalid order ID format'))
      return
    }
    next()
  }
}
