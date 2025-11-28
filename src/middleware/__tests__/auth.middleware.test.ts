jest.mock("jsonwebtoken");

import jwt from "jsonwebtoken";
import { authMiddleware } from "../auth.middleware";

describe("Auth Middleware", () => {
  const next = jest.fn();

  test("should block missing token", () => {
    const req: any = { headers: {} };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("should block invalid token", () => {
    const req: any = {
      headers: { authorization: "Bearer abc" },
    };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("should allow valid token", () => {
    const req: any = {
      headers: { authorization: "Bearer abc" },
    };
    const res: any = {};
    const decoded = { id: 1, email: "test@mail.com" };

    (jwt.verify as jest.Mock).mockReturnValue(decoded);

    authMiddleware(req, res, next);

    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
  });
});
