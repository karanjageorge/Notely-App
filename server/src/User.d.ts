import * as express from "express";
interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}
declare global {
  namespace Express {
    interface Request {
      user: User; // Add the user property to the Request interface
    }
  }
}
