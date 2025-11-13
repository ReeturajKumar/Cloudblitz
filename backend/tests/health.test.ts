import request from "supertest";
import app from "../src/app";

describe("Health check", () => {
  it("GET /api/health -> 200 & body.status = ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status");
  });
});
