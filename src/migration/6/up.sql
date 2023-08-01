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