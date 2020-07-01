const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Token';
const COLLECTION_NAME = 'Tokens';

const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true
    },
    token: {
      type: Schema.Types.String,
      required: true,
      index: true
    },
    type: {
      type: Schema.Types.String,
      required: true,
      index: true
    },
    expiredAt: {
      type: Date,
      required: true,
    },
    fingerprint: {
      type: Schema.Types.String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  });

module.exports = model(DOCUMENT_NAME, tokenSchema, COLLECTION_NAME);