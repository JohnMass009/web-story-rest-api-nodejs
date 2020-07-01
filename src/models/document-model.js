const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Document';
const COLLECTION_NAME = 'documents';

const documentSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true,
      minlength: 3,
      maxlength: 500,
      trim: true
    },
    text: {
      type: Schema.Types.String,
      required: false,
      select: false
    },
    draftText: {
      type: Schema.Types.String,
      required: false,
      select: false
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
      select: false
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
      index: true
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false
    },
    createdAt: {
      type: Date,
      required: true,
      select: false,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      required: true,
      select: false,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

module.exports = model(DOCUMENT_NAME, documentSchema, COLLECTION_NAME);