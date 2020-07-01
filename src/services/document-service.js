const { DocumentModel } = require('../models');

const DOCUMENT_ALL_DATA = '+text +draftText +status +createdBy +updatedBy';
const DOCUMENT_INFO_EXTRA = '+createdBy +updatedBy';

const create = async (document) => {
  const now = new Date();
  document.createdAt = now;
  document.updatedAt = now;
  const createdDocument = await DocumentModel.create(document);
  return createdDocument.toObject();
}

const update = (document) => {
  document.updatedAt = new Date();
  return DocumentModel.updateOne(
    { _id: document._id },
    { $set: { ...document } })
    .lean()
    .exec();
}

const findById = (id) => {
  return DocumentModel.findOne({ _id: id, status: true })
    .lean()
    .exec();
}

const findWithTextAndDraftTextById = (id) => {
  return DocumentModel.findOne({ _id: id, status: true })
    .select('+text +draftText +status')
    .lean()
    .exec();
}

const findDocumentAllDataById = (id) => {
  return DocumentModel.findOne({ _id: id, status: true })
    .select(DOCUMENT_ALL_DATA)
    .lean()
    .exec();
}

const findUrlIfExists = (documentUrl) => {
  return DocumentModel.findOne({ blogUrl: documentUrl })
    .lean()
    .exec();
}

const findWithTitleByUser = (userId) => {
  return DocumentModel.findOne({ createdBy: userId, status: true })
    .select('+title')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
    .sort({ createdAt: -1 })
    .lean()
    .exec();
}

const findDetailedDocuments = (query) => {
  return DocumentModel.find(query)
    .select(DOCUMENT_INFO_EXTRA)
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
};

const searchSimilarDocuments = (document, limit) => {
  return DocumentModel.find(
    {
      $text: { $search: document.title, $caseSensitive: false },
      status: true,
      isPublished: true,
      _id: { $ne: document._id }
    })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .lean()
    .exec();
};

module.exports = {
  create,
  update,
  findById,
  findUrlIfExists,
  findWithTitleByUser,
  findWithTextAndDraftTextById,
  findDocumentAllDataById,
  findDetailedDocuments,
  searchSimilarDocuments,
};