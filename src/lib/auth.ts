import jwt from "jsonwebtoken";
import { HttpRequest } from "@azure/functions";

export const verifyToken = (req: HttpRequest) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
};
export const requireAuth = (req: HttpRequest) => {
  const user = verifyToken(req);

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user as {
    teamId: string;
    isAdmin: boolean;
  };
};
export const requireAdmin = (req: HttpRequest) => {
  const user = requireAuth(req);

  if (!user.isAdmin) {
    throw new Error("FORBIDDEN");
  }

  return user;
};
