const BaseJoi=require('joi')
const sanitizeHtml = require('sanitize-html');

const extension = function htmlStrip(joi) {
  return {
    type: 'string',
    base: joi.string(),
    messages: {
      'string.escapeHtml': 'Should not contain any html tags.',
    },
    rules:{
        escapeHtml:{
            validate(value, helpers) {
      const clean = sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {},
      });
      if (clean) {
        return clean;
      }
      return { value, errors: helpers.error('htmlStrip') };
    }
        }
    }
    
  };
};

const Joi= BaseJoi.extend(extension)
module.exports.campgroundSchema=  Joi.object({
        title: Joi.string().required().escapeHtml(),
        price:Joi.number().required().min(0),
        location: Joi.string().required().escapeHtml(),
        // image: Joi.string().required(),
        description:Joi.string().required().escapeHtml(),
        deleteImages: Joi.array()
    })

    module.exports.reviewSchema=Joi.object({
        rating:Joi.number().required().min(1).max(5),
        body:Joi.string().required()
    })