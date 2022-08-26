const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const testUser = {
  email: 'abc@123',
  password: 'abc123'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? testUser.password;

  const agent = request.agent(app);

  const [, user] = await UserService.create({ ...testUser, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('todos routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('#GET /api/v1/todos should return a list of all todos associated with authenticated user', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/todos');
    console.log(res.body);
    expect(res.status).toEqual(200);
    expect(res.body[0]).toEqual({
      
    });
  });
  afterAll(() => {
    pool.end();
  });
});

