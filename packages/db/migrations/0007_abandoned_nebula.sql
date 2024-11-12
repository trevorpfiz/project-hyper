ALTER TABLE "hyper_activity" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "hyper_cgm_data" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "hyper_daily_recap" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "hyper_meal" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "hyper_report" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "hyper_cgm_data" DROP CONSTRAINT "hyper_cgm_data_record_id_unique";--> statement-breakpoint
ALTER TABLE "hyper_daily_recap" DROP CONSTRAINT "hyper_daily_recap_date_profile_id_unique";--> statement-breakpoint
ALTER TABLE "hyper_report" ADD COLUMN "report_type" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "hyper_report" ADD COLUMN "start_time" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "hyper_report" ADD COLUMN "end_time" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "hyper_report" ADD COLUMN "generated_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "hyper_report" DROP COLUMN IF EXISTS "title";--> statement-breakpoint
ALTER TABLE "hyper_report" DROP COLUMN IF EXISTS "content";--> statement-breakpoint
ALTER TABLE "hyper_cgm_data" ADD CONSTRAINT "hyper_cgm_data_recordId_unique" UNIQUE("record_id");--> statement-breakpoint
ALTER TABLE "hyper_daily_recap" ADD CONSTRAINT "daily_recap_date_profile_unique" UNIQUE("date","profile_id");