// userService.js

// Data Access Layer
const MongooseService = require('./mongooseService')
// Database Model
const UserModel = require('../model/userModel')

// Password hasher
const bcrypt = require('bcrypt')
const saltRounds = 10

const jwt = require('jsonwebtoken')
// Config for JWT secret key
const config = require('./../config')

class UserService {
  constructor () {
    this.MongooseServiceInstance = new MongooseService(UserModel)
  }

  async create (userToCreate) {
    try {
      const result = await this.MongooseServiceInstance.create(userToCreate)
      return { success: true, body: result }
    } catch (err) {
      return { success: false, error: err }
    }
  }

  async generateUserJwt (userId) {
    return jwt.sign({ id: userId }, config.api.token.secretKey, { expiresIn: config.api.token.expiresIn, algorithm: config.api.token.algorithm })
  }

  async getByUserId (userId) {
    return await this.MongooseServiceInstance.find({ _id: userId })
  }

  async getByUsername (username) {
    return await this.MongooseServiceInstance.find({ usernameNormal: username.trim().toLowerCase() })
  }

  async getByEmail (email) {
    return await this.MongooseServiceInstance.find({ email: email.trim().toLowerCase() })
  }

  async delete (userId) {
    const usernameResult = await this.getByUserId(userId)
    if (!usernameResult || !usernameResult.length) {
      return { success: false, error: 'Username not found.' }
    }
    usernameResult[0].isDeleted = true
    await usernameResult[0].save()
    return { success: true, body: usernameResult[0] }
  }

  async register (reqBody) {
    const validationResult = await this.validateRegistration(reqBody)
    if (!validationResult.success) {
      return validationResult
    }

    const user = await this.MongooseServiceInstance.new()
    user.username = reqBody.username.trim()
    user.usernameNormal = reqBody.username.trim().toLowerCase()
    user.email = reqBody.email.trim().toLowerCase()
    user.dateJoined = new Date()
    user.passwordHash = await bcrypt.hash(reqBody.password, saltRounds)

    const result = await this.create(user)
    user.passwordHash = '[REDACTED]'

    return result
  }

  async login (reqBody) {
    const usernameResult = await this.getByUsername(reqBody.username)
    if (!usernameResult || !usernameResult.length) {
      return { success: false, error: 'Username not found.' }
    }

    const isPasswordValid = bcrypt.compareSync(reqBody.password, usernameResult[0].passwordHash)
    if (!isPasswordValid) {
      return { success: false, error: 'Password incorrect.' }
    }
    return { success: true, body: usernameResult }
  }

  validateEmail (email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }

  async validateRegistration (reqBody) {
    if (!reqBody.password || (reqBody.password.length < 8)) {
      return { success: false, err: 'Password is too short.' }
    }

    if (!reqBody.passwordConfirm || (reqBody.password !== reqBody.passwordConfirm)) {
      return { success: false, err: 'Password and confirmation do not match.' }
    }

    if (!reqBody.username) {
      return { success: false, err: 'Username cannot be blank.' }
    }

    const tlUsername = reqBody.username.trim().toLowerCase()
    if (tlUsername.length === 0) {
      return { success: false, err: 'Username cannot be blank.' }
    }

    if (!reqBody.email) {
      return { success: false, err: 'Email cannot be blank.' }
    }

    const tlEmail = reqBody.email.trim().toLowerCase()

    if (tlEmail.length === 0) {
      return { success: false, err: 'Email cannot be blank.' }
    }

    if (!this.validateEmail(tlEmail)) {
      return { success: false, err: 'Invalid email format.' }
    }

    const usernameMatch = await this.getByUsername(tlUsername)
    if (usernameMatch.length > 0) {
      return { success: false, err: 'Username already in use.' }
    }

    const emailMatch = await this.getByEmail(tlEmail)
    if (emailMatch.length > 0) {
      return { success: false, err: 'Email already in use.' }
    }

    return { success: true }
  }
}

module.exports = UserService
