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
    UNIQUE ("order"),
    FOREIGN KEY ("presentationId") REFERENCES "presentation" ("id") ON UPDATE restrict ON DELETE cascade
);