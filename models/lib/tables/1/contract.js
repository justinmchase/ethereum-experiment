import Joi from 'joi'
import vogels from 'vogels'
import debug from 'debug'

let log = debug('models')

export let ContractSchema = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  version: Joi.string(),
  source: Joi.string(),
  compiled: Joi.object(),
  address: Joi.string(),
  deprecated: Joi.boolean()
})

export let Contract = vogels.define('Contract', {
  hashKey: 'id',
  timestamps: true,
  schema: ContractSchema,
  indexes: [
    {
      name: 'ContractIndex',
      hashKey: 'id',
      type: 'global'
    }
  ]
})

// Contract.get = function (name, version, callback) {
//   log('Contract.get')
//   Contract
//     .query(name)
//     .usingIndex('ContractIndex')
//     .limit(1)
//     .exec((err, result) => {
//       if (err) return callback(err)
//       if (!result.Items.length) return callback(null, null)
//       return callback(null, result.Items[0])
//     })
// }

