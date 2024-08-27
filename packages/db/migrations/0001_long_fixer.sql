CREATE TABLE IF NOT EXISTS "hyper_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"duration" interval NOT NULL,
	"activity_type_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper_activity_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT "hyper_activity_type_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper_cgm_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dexcom_user_id" varchar(255),
	"record_id" varchar(255) NOT NULL,
	"system_time" timestamp NOT NULL,
	"display_time" timestamp NOT NULL,
	"glucose_value" integer NOT NULL,
	"trend" varchar(50),
	"trend_rate" numeric(5, 2),
	"transmitter_id" varchar(255),
	"transmitter_generation" varchar(50),
	"display_device" varchar(50),
	"profile_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "hyper_cgm_data_record_id_unique" UNIQUE("record_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper_meal" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meal_time" timestamp DEFAULT now() NOT NULL,
	"carbohydrates" numeric(10, 2),
	"dietary_energy" numeric(10, 2),
	"dietary_sugar" numeric(10, 2),
	"fiber" numeric(10, 2),
	"protein" numeric(10, 2),
	"total_fat" numeric(10, 2),
	"profile_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper_activity" ADD CONSTRAINT "hyper_activity_activity_type_id_hyper_activity_type_id_fk" FOREIGN KEY ("activity_type_id") REFERENCES "public"."hyper_activity_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper_activity" ADD CONSTRAINT "hyper_activity_profile_id_hyper_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."hyper_profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper_cgm_data" ADD CONSTRAINT "hyper_cgm_data_profile_id_hyper_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."hyper_profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper_meal" ADD CONSTRAINT "hyper_meal_profile_id_hyper_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."hyper_profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
