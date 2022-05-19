const request = require('supertest');
const app = require('./app');

test('Get all employees request without token, expects 400', async () => {
    await request(app).get('/employees').expect(400);
    console.log(app.response.statusCode);
});

test('should get 409 conflit error if department we are trying to add is already exist', async () => {
    await request(app)
        .post('/departments')
        .send({
            dept_name: 'Engineering',
        })
        .expect(409);
});

test('Should get 200 if image named null exists in uploads folder', async () => {
    await request(app).get('/uploads/null').expect(200);
});

test('Should get 200 if the server is running perfectly', async () => {
    await request(app).get('/').expect(200);
});

test('Should get 200 res code if user registered successfully(first time)', async () => {
    await request(app)
        .post('/users/register')
        .send({
            email: 'testmail@mail.com',
            password: 'testpassword',
        })
        .expect(200);
});
test('Should get 409 conflict if user register again with same email', async () => {
    await request(app)
        .post('/users/register')
        .send({
            email: 'testmail@mail.com',
            password: 'testpassword',
        })
        .expect(409);
});
test('Should get 200 if user login successfully', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'testmail@mail.com',
            password: 'testpassword',
        })
        .expect(200);
});
