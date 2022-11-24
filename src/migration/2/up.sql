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