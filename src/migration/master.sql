CREATE TABLE "user"
(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "password" text,
    "email"    text,
    "fullName" text,
    "tokenCounter" integer DEFAULT 0,
    "status" text DEFAULT 'inactive',
    "activateString" text NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("email")
);

CREATE TABLE "group"
(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" text,
    "isPublic" boolean NOT NULL DEFAULT false,
    "ownerId"  uuid NOT NULL,
    "invitationLink" text,
    "status" text NOT NULL DEFAULT 'active',
    "createdAt"    timestamptz NOT NULL DEFAULT now(),
    "updatedAt"    timestamptz NOT NULL DEFAULT now(),
    "createdBy"    UUID,
    "updatedBy"    UUID,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON UPDATE restrict ON DELETE restrict
);

CREATE TABLE "user_group"
(
    "userId" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "role" text NOT NULL,
    "status" text NOT NULL DEFAULT 'active',
    "createdAt"    timestamptz NOT NULL DEFAULT now(),
    "updatedAt"    timestamptz NOT NULL DEFAULT now(),
    "createdBy"    UUID,
    "updatedBy"    UUID,
    PRIMARY KEY ("userId", "groupId"),
    FOREIGN KEY ("userId") REFERENCES "user" ("id") ON UPDATE restrict ON DELETE cascade,
    FOREIGN KEY ("groupId") REFERENCES "group" ("id") ON UPDATE restrict ON DELETE cascade
);

ALTER TABLE "user" ADD COLUMN "provider" TEXT NOT NULL DEFAULT 'manual';


INSERT INTO "user"("id", "email", "password", "fullName", "provider") values 
('fd7eb636-be19-4d22-aba0-a06853751e38','khatuantran11@gmail.com', '$2b$10$DDFB01y2UIxpruFpvG93DuscABLgKXdX3yN7jMZbw1fxNpDX05S16', 'User 1', 'manual'),
('fce2b4ff-9a59-4cdc-b2b6-17e2bbed917b','khatuantran111@gmail.com', '$2b$10$DDFB01y2UIxpruFpvG93DuscABLgKXdX3yN7jMZbw1fxNpDX05S16', 'User 2', 'manual')
ON CONFLICT DO NOTHING;
INSERT INTO "group"("id", "name", "ownerId") values
('109eb888-6448-4737-85a2-a363f362108d', 'Nhóm học toán', 'fd7eb636-be19-4d22-aba0-a06853751e38'),
('d09e3749-39f9-477f-852e-b8be9e876b33', 'Nhóm học lý', 'fd7eb636-be19-4d22-aba0-a06853751e38'),
('ea331ffc-6026-48e2-ab7e-db06e27ee7ed', 'Nhóm học hoá', 'fd7eb636-be19-4d22-aba0-a06853751e38'),
('ed88bd49-52c6-483d-bb86-31a82d4b2349', 'Nhóm học tiếng anh', 'fd7eb636-be19-4d22-aba0-a06853751e38')
ON CONFLICT DO NOTHING;

INSERT INTO "user_group"("userId","groupId", "role") values 
('fd7eb636-be19-4d22-aba0-a06853751e38', '109eb888-6448-4737-85a2-a363f362108d', 'owner'),
('fd7eb636-be19-4d22-aba0-a06853751e38', 'd09e3749-39f9-477f-852e-b8be9e876b33', 'owner'),
('fd7eb636-be19-4d22-aba0-a06853751e38', 'ea331ffc-6026-48e2-ab7e-db06e27ee7ed', 'owner'),
('fd7eb636-be19-4d22-aba0-a06853751e38', 'ed88bd49-52c6-483d-bb86-31a82d4b2349', 'owner'),
('fce2b4ff-9a59-4cdc-b2b6-17e2bbed917b', '109eb888-6448-4737-85a2-a363f362108d', 'co_owner')
ON CONFLICT DO NOTHING;

CREATE TABLE "presentation"
(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" text,
    "ownerId"  uuid NOT NULL,
    "isPresent" boolean DEFAULT 'false',
    "status" text NOT NULL DEFAULT 'active',
    "createdAt"    timestamptz NOT NULL DEFAULT now(),
    "updatedAt"    timestamptz NOT NULL DEFAULT now(),
    "createdBy"    UUID,
    "updatedBy"    UUID,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON UPDATE restrict ON DELETE cascade
);

CREATE TABLE "slide"
(
    "id" UUID NOT NULL,
    "title" text,
    "options" jsonb,
    "type" text,
    "status" text NOT NULL DEFAULT 'active',
    "presentationId" UUID NOT NULL,
    "isSelected" boolean DEFAULT 'false',
    "order" integer,
    "createdAt"    timestamptz NOT NULL DEFAULT now(),
    "updatedAt"    timestamptz NOT NULL DEFAULT now(),
    "createdBy"    UUID,
    "updatedBy"    UUID,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("presentationId") REFERENCES "presentation" ("id") ON UPDATE restrict ON DELETE cascade
);

ALTER TABLE "group" ADD COLUMN "presentationId" UUID NULL;

CREATE TABLE "chat"
(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "presentationId" uuid,
    "content"    jsonb,
    "type" text,
    "createdAt" timestamptz NOT NULL DEFAULT now(),
    "updatedAt" timestamptz NOT NULL DEFAULT now(),
    "createdBy" uuid,
    "updatedBy" uuid,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("presentationId") REFERENCES "presentation" ("id") ON UPDATE restrict ON DELETE cascade
);

CREATE TABLE "question"
(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "presentationId" uuid,
    "content"    text,
    "voteQuantity" integer NOT NULL DEFAULT 0,
    "isAnswer" boolean NOT NULL DEFAULT 'false',
    "createdAt" timestamptz NOT NULL DEFAULT now(),
    "updatedAt" timestamptz NOT NULL DEFAULT now(),
    "createdBy" uuid,
    "updatedBy" uuid,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("presentationId") REFERENCES "presentation" ("id") ON UPDATE restrict ON DELETE cascade
);

ALTER TABLE "presentation" ADD COLUMN "socketId" TEXT NULL;
