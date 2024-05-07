// @/lib/init-middleware.js

import Cors from "cors";

// Initialize CORS middleware
const initMiddleware = (middleware) => {
  return (req, res) => {
    return new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  };
};

export default initMiddleware;
