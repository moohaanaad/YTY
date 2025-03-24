import { Request } from 'express';
import { UserRole } from 'src/utils/enums/user.enums';

export interface CustomRequest extends Request {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    password: string;
    address: {
      state: string;
      city: string;
      street: string;
     }
    phone: string; 
    BD: Date;
    gender: string;
    userName: string;
    profileImage: string;
    bio: string
    status: string 
  };
}
