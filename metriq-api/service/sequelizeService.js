// sequelizeService.js

class SequelizeService {
  constructor (Collection) {
    this.Collection = Collection
  }

  async new () {
    return this.Collection.build({})
  }

  async create (data) {
    return await data.save()
  }

  async findAll (keyValuePair) {
    return await this.Collection.findAll({ where: keyValuePair })
  }

  async findAllEager (keyValuePair, keys) {
    return await this.Collection.findAll({ where: keyValuePair, include: keys })
  }

  async findOne (keyValuePair) {
    return await this.Collection.findOne({ where: keyValuePair })
  }

  async projectAll (attributes) {
    return await this.Collection.findAll({ attributes: attributes })
  }

  async findAndProject (keyValuePair, attributes) {
    return await this.Collection.findAll({ where: keyValuePair, attributes: attributes })
  }

  async findAndSort (keyValuePair, sortValues, startIndex, count) {
    return await this.Collection.findAll({ where: keyValuePair, order: sortValues, offset: startIndex, limit: count })
  }

  async distinctAll (attribute) {
    return await this.Collection.aggregate(attribute, 'DISTINCT', { plain: false })
  }
}

module.exports = SequelizeService
