CREATE TYPE enum_users_roles AS ENUM ('user', 'admin');

CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  "firstName" CHARACTER VARYING(255),
  "lastName" CHARACTER VARYING(255),
  password CHARACTER VARYING(255) NOT NULL,
  avatar CHARACTER VARYING(255),
  contact CHARACTER VARYING(255) NOT NULL,
  description CHARACTER VARYING(255),
  email CHARACTER VARYING(255),
  roles ENUM_USERS_ROLES DEFAULT 'user'::enum_users_roles,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE UNIQUE INDEX users_contact_key ON users USING BTREE (contact);
