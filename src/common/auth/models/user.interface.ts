export interface User {
  iss: string;
  iat: number;
  exp: number;
  aud: string;
  sub: string;
  GivenName: string;
  Surname?: string;
  Email: string;
  Role?: string[];
}
