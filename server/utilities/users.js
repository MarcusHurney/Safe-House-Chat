class Users {
  constructor() {
    this.users = [];
  }
  addUser (id, name, room) {
    var user = { id, name, room };
    this.users.push(user);
    return user;
  }
  removeUser (id) {
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter(user => {
        return user.id !== id;
      });
    }
    return user;
  }
  getUser (id) {
    return this.users.filter(user => user.id === id)[0];
  }
  // returns an array of user names
  getUserList (room) {
    var users = this.users.filter(user => {
      // if user's room property matches the room paramter
      // the user will stay in the list
      return user.room === room;
    });
    var namesArray = users.map(user => {
      return user.name;
    });
    return namesArray;
  }
}

module.exports = { Users };
