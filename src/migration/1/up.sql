CREATE TABLE "user"
(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" text,
    "password" text,
    "email"    text,
    "fullName" text,
    "tokenCounter" integer DEFAULT 0,
    "status" text DEFAULT 'inactive',
    "activateString" text NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("email"),
    UNIQUE ("username")
);