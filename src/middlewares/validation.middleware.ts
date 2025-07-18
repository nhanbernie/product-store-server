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
