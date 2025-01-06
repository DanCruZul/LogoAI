CREATE TABLE IF NOT EXISTS "logos" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"prompt" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
