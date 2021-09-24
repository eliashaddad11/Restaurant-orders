import mongoose from 'mongoose';
import supertest from 'supertest';
import Address from '../models/address';
import { app } from '../app';

let token;

beforeAll((done) => {

  supertest(app)
    .post('/api/auth/login')
    .send({
      email: 'elias@gmail.com',
      password: 'password',
    })
    .end((err, response) => {
      token = response.body.jwtToken; // save the token!
      done();
    });
    
});


test("GET /api/address/list", async () => {
  
  const address = await Address.create({ title: "Address 1", description: "Lorem ipsum",coord:[-123,12312],creator: mongoose.Types.ObjectId() });

  await supertest(app).get("/api/address/list")
    .set('Authorization', 'abc123')
    .expect(200)
    .then((response) => {
      // Check type and length
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toEqual(1);

      // Check data
      expect(response.body[0]._id).toBe(address._id);
      expect(response.body[0].title).toBe(address.title);
      expect(response.body[0].description).toBe(address.description);
      expect(response.body[0].coord).toBe(address.coord);
      expect(response.body[0].creator).toBe(address.creator);
    });
});

