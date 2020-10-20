import { Request, Response, NextFunction } from "express";
import { ErrorHandler, handlerError } from "../../error";
import jwt from "jsonwebtoken";
import config from "config";

const auth_token = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-auth-token");
  if (!token) {
    const custom = new ErrorHandler(
      400,
      "No token authorization denied!! La concha de su madre!!"
    );
    handlerError(custom, req, res);
    return;
  }
  try {
    const decoded: any = jwt.decode(token, config.get('jwt_secret'));
    req.user = decoded.user;
    next();
  } catch(err) {
    const custom = new ErrorHandler(
      400,
      "Token is not valid"
    );
    handlerError(custom, req, res);
    return;
  }
};
export default auth_token;
