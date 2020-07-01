class DocumentFixture {
  constructor(role = 'READER',) {
    this._id = mongoose.Types.ObjectId();
    this.name = faker.name.findName();
    this.email = faker.internet.email().toLowerCase();
    this.password = `password_${ getRandomInt(1, 20) }`;
    this.role = role;
  }
}

const insertDocuments = async (documents) => {
  await UserModel.insertMany(documents.map((document) => {
    const hashedPassword = hashSync(user.password, genSaltSync(8));
    return { ...user, password: hashedPassword }
  }));
};

module.exports = {
  DocumentFixture,
  insertDocuments
};