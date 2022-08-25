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

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('#POST registers a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(testUser);
    const { email } = testUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });
  it('#POST /sessions returns 200 for existing users', async () => {
    const agent = request.agent(app);
    await agent
      .post('/api/v1/users')
      .send(testUser);

    const res = await agent.post('/api/v1/users/sessions').send(testUser);

    expect(res.status).toEqual(200);  
  });
  it('#GET /me should return authenticated users', async () => {
    
    const [agent, user] = await registerAndLogin();
    
    const me = await agent.get('/api/v1/users/me');
    expect(me.body).toEqual({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  afterAll(() => {
    pool.end();
  });
});
