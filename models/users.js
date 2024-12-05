const bcrypt = require('bcryptjs');

const users = []; // In-memory storage (use a database in production)

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  static async create(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(username, hashedPassword);
    users.push(newUser);
    return newUser;
  }

  static findByUsername(username) {
    return users.find(user => user.username === username);
  }

  async validatePassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

module.exports = User;
