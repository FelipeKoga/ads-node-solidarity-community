import { User } from '@models/User';

test('it should be ok', () => {
  const user = new User();

  user.name = 'Felipe';
  user.email = 'felipe.koga@hotmail.com';

  expect(user.name).toEqual('Felipe');
});
