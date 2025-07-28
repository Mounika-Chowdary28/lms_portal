// src/types/express.d.ts
import { UserDocument } from '../models/user_model'; // correct relative path

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export {}; // ✅ ensures this is treated as a module
