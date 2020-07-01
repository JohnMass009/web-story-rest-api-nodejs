const { Schema, model } = require('mongoose');
const { getRoles } = require('../helpers/role-helper')

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'users';

const roles = getRoles();

const UserSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: Schema.Types.String,
    },
    role: {
      type: Schema.Types.String,
      enum: roles,
      required: true,
      default: 'reader',
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false
    },
    status: {
      type: Schema.Types.Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      select: false,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      select: false,
      default: Date.now
    }
  },
  {
    versionKey: false
  });

module.exports = model(DOCUMENT_NAME, UserSchema, COLLECTION_NAME);