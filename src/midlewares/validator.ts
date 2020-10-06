import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { handlerError, ErrorHandler } from '../error';
const validatorHandler = (req:Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }
  const err = new ErrorHandler(400, 'Invalid Field');
  handlerError(err, req, res);
}

export default validatorHandler;