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

/*test("POST /api/posts", async () => {
  const data = { title: "Post 1", content: "Lorem ipsum" };

  await supertest(app).post("/api/posts")
    .send(data)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body._id).toBeTruthy();
      expect(response.body.title).toBe(data.title);
      expect(response.body.content).toBe(data.content);

      // Check data in the database
      const post = await Post.findOne({ _id: response.body._id });
      expect(post).toBeTruthy();
      expect(post.title).toBe(data.title);
      expect(post.content).toBe(data.content);
    });
});

test("GET /api/posts/:id", async () => {
  const post = await Post.create({ title: "Post 1", content: "Lorem ipsum" });

  await supertest(app).get("/api/posts/" + post.id)
    .expect(200)
    .then((response) => {
      expect(response.body._id).toBe(post.id);
      expect(response.body.title).toBe(post.title);
      expect(response.body.content).toBe(post.content);
    });
});

test("PATCH /api/posts/:id", async () => {
  const post = await Post.create({ title: "Post 1", content: "Lorem ipsum" });

  const data = { title: "New title", content: "dolor sit amet" };

  await supertest(app).patch("/api/posts/" + post.id)
    .send(data)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body._id).toBe(post.id);
      expect(response.body.title).toBe(data.title);
      expect(response.body.content).toBe(data.content);

      // Check the data in the database
      const newPost = await Post.findOne({ _id: response.body._id });
      expect(newPost).toBeTruthy();
      expect(newPost.title).toBe(data.title);
      expect(newPost.content).toBe(data.content);
    });
});

test("DELETE /api/posts/:id", async () => {
  const post = await Post.create({
    title: "Post 1",
    content: "Lorem ipsum",
  });

  await supertest(app)
    .delete("/api/posts/" + post.id)
    .expect(204)
    .then(async () => {
      expect(await Post.findOne({ _id: post.id })).toBeFalsy();
    });
});*/