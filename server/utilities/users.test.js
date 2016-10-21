const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {
  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node Course'
    },
    {
      id: '2',
      name: 'Tom',
      room: 'React Course'
    },
    {
      id: '3',
      name: 'Kesandra',
      room: 'Node Course'
    }];
  });

  it('should add a new user', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'Todd',
      room: 'Fans of Fanboydom'
    };
    var resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    var userId = '1';
    var removedUser = users.removeUser(userId);
    expect(removedUser.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    var userId = '99';
    var removedUser = users.removeUser(userId);
    expect(removedUser).toNotExist();
    expect(users.users.length).toBe(3);
  });
  // test getUser()
  it('should find a user', () => {
    var userId = '2';
    var user = users.getUser('2');
    expect(user.id).toBe(userId);
  });

  it('should not find a user', () => {
    var userId = '50';
    var user = users.getUser('50');
    expect(user).toNotExist();
  });

  it('should return names for the Node Course', () => {
    var userList = users.getUserList('Node Course');
    expect(userList).toEqual(['Mike', 'Kesandra']);
  });

  it('should return names for the React Course', () => {
    var userList = users.getUserList('React Course');
    expect(userList).toEqual(['Tom']);
  });

});
