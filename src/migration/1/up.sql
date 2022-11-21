CREATE TABLE "user"
(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" text,
    "password" text,
    "email"    text,
    "fullName" text,
    "tokenCounter" integer DEFAULT 0,
    PRIMARY KEY ("id"),
    UNIQUE ("email"),
    UNIQUE ("username")
);