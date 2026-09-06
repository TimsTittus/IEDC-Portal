ALTER TYPE "public"."project_status" ADD VALUE 'changes_requested';--> statement-breakpoint
CREATE TABLE "project_collaborations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"applicant_id" uuid NOT NULL,
	"domain" varchar(100) NOT NULL,
	"message" text,
	"status" varchar(20) DEFAULT 'pending',
	"applied_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "coordinator_profiles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "coordinator_profiles" CASCADE;--> statement-breakpoint
ALTER TABLE "allowed_staff_emails" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'student'::text;--> statement-breakpoint
DROP TYPE "public"."user_role";--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'faculty', 'ceo', 'cto', 'to', 'cfo', 'fo', 'cco', 'co', 'cio', 'io', 'cmo', 'mo', 'coo', 'oo', 'cso', 'so', 'cvo', 'vo', 'cwit', 'wit');--> statement-breakpoint
ALTER TABLE "allowed_staff_emails" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'student'::"public"."user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
ALTER TABLE "faculty_profiles" ALTER COLUMN "department" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "student_profiles" ALTER COLUMN "department" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "event_registrations" ADD COLUMN "cancellation_reason" text;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD COLUMN "cancelled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "looking_for_contributors" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "contributor_roles" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "contributor_description" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "review_comment" text;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD COLUMN "behance_url" text;--> statement-breakpoint
ALTER TABLE "project_collaborations" ADD CONSTRAINT "project_collaborations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_collaborations" ADD CONSTRAINT "project_collaborations_applicant_id_student_profiles_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."student_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_proj_applicant_domain" ON "project_collaborations" USING btree ("project_id","applicant_id","domain");--> statement-breakpoint
CREATE INDEX "idx_proj_collab_project" ON "project_collaborations" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_proj_collab_applicant" ON "project_collaborations" USING btree ("applicant_id");