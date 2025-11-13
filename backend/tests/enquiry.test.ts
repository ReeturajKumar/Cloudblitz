import request from "supertest";
import app from "../src/app";
import { connectTestDB, closeTestDB } from "./setupTestDB";
import User from "../src/models/User";

let token: string;

beforeAll(async () => {
  await connectTestDB();

  // Register and login user
  await request(app).post("/api/auth/register").send({
    name: "Admin User",
    email: "admin@test.com",
    password: "123456",
  });
  const res = await request(app).post("/api/auth/login").send({
    email: "admin@test.com",
    password: "123456",
  });
  token = res.body.token;
});

afterAll(async () => {
  await closeTestDB();
});

describe("Enquiry API", () => {
  it("should create a new enquiry", async () => {
    const res = await request(app)
      .post("/api/enquiries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        customerName: "John Doe",
        email: "john@example.com",
        phone: "9876543210",
        message: "Interested in product demo",
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("customerName", "John Doe");
  });

  it("should get enquiries", async () => {
    const res = await request(app)
      .get("/api/enquiries")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
