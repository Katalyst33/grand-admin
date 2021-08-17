/**
 * Index file for your types.
 * Reference any declarations required by typescript compiler here.
 */
import "./modules";
import "./xpresser";

export type userData = {
  data: {
    _id: string;
    createdAt: string;
    updatedAt: string;
    password: string;
    role: string;
    email: string;
  };
};
