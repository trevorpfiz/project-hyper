DO $$ BEGIN
 CREATE TYPE "public"."diabetes_status" AS ENUM('none', 'pre', 'type1', 'type2', 'type3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."glucose_range_type" AS ENUM('standard', 'tight', 'optimal');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper_daily_recap" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"average_glucose" integer,
	"minimum_glucose" integer,
	"maximum_glucose" integer,
	"glucose_variability" numeric,
	"time_in_ranges" jsonb,
	"total_readings" integer,
	"profile_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "hyper_profile" ADD COLUMN "diabetes_status" "diabetes_status" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "hyper_profile" ADD COLUMN "glucose_range_type" "glucose_range_type" DEFAULT 'tight' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper_daily_recap" ADD CONSTRAINT "hyper_daily_recap_profile_id_hyper_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."hyper_profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
