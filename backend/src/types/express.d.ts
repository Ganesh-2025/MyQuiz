import type { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  payload: JwtPayload;
}
