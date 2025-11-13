import request from "supertest";
import app from "../src/app";
import { connectTestDB, closeTestDB } from "./setupTestDB";
import User from "../src/models/User";

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should login successfully", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject invalid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "wrong@example.com",
      password: "invalid",
    });

    expect(res.status).toBe(401);
  });
});
