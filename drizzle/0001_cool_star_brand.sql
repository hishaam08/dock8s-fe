CREATE TABLE "ContainerSession" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"containerId" text NOT NULL,
	"containerName" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"lastActivityAt" timestamp,
	"status" text DEFAULT 'active' NOT NULL,
	"cpuLimit" integer DEFAULT 1 NOT NULL,
	"memoryLimit" bigint DEFAULT 2147483648 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE INDEX "container_session_user_id_idx" ON "ContainerSession" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "container_session_container_id_idx" ON "ContainerSession" USING btree ("containerId");