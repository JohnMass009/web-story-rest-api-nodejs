const mongoose = require('mongoose');
const { hashSync, genSaltSync } = require('bcrypt');
const faker = require('faker');
const { UserModel } = require('../../src/models');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

class UserFixture {
  constructor(role = 'reader',) {
    this._id = mongoose.Types.ObjectId();
    this.name = faker.name.findName();
    this.email = faker.internet.email().toLowerCase();
    this.password = `password_${ getRandomInt(1, 20) }`;
    this.role = role;
  }
}

const insertUsers = async (users) => {
  await UserModel.insertMany(users.map((user) => {
    const hashedPassword = hashSync(user.password, genSaltSync(8));
    return { ...user, password: hashedPassword }
  }));
};

module.exports = {
  UserFixture,
  insertUsers
};