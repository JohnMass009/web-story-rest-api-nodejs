const { UserModel } = require('../models');

const findById = (id) => {
  return UserModel.findOne({ _id: id, status: true })
    .select('+_id +email +password +role')
    .lean();
}

const findByEmail = (email) => {
  return UserModel.findOne({ email: email, status: true })
    .select('+email +password +role')
    .lean();
}

const findProfileById = (id) => {
  return UserModel.findOne({ _id: id, status: true })
    .select('+role')
    .lean();
}

const findPublicProfileById = (id) => {
  return UserModel.findOne({ _id: id, status: true }).lean();
}

const create = async (user) => {
  return await UserModel.create(user);
}

const update = async (user, accessTokenKey, refreshTokenKey) => {
  user.updatedAt = new Date();
  const result = await UserModel.updateOne({ _id: user._id }, { $set: { ...user }, }).lean().exec();
  const keystore = await tokenService.create(user._id, accessTokenKey, refreshTokenKey);
  return { user: user, keystore: keystore };
}

const updateInfo = (user) => {
  user.updatedAt = new Date();
  return UserModel.updateOne({ _id: user._id }, { $set: { ...user }, }).lean();
}

module.exports = {
  findById,
  findByEmail,
  findProfileById,
  findPublicProfileById,
  create,
  update,
  updateInfo
};