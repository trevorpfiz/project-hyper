ALTER TABLE "hyper_daily_recap" ALTER COLUMN "date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "hyper_daily_recap" ADD COLUMN "timezone" varchar(50) NOT NULL;