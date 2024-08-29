ALTER TABLE "hyper_cgm_data" ALTER COLUMN "dexcom_user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hyper_cgm_data" ALTER COLUMN "system_time" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "hyper_cgm_data" ALTER COLUMN "display_time" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "hyper_cgm_data" ALTER COLUMN "glucose_value" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hyper_cgm_data" ALTER COLUMN "trend" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "hyper_cgm_data" ALTER COLUMN "trend_rate" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "hyper_cgm_data" ALTER COLUMN "transmitter_generation" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "hyper_cgm_data" ALTER COLUMN "transmitter_generation" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hyper_cgm_data" ALTER COLUMN "display_device" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "hyper_cgm_data" ALTER COLUMN "display_device" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hyper_meal" ALTER COLUMN "meal_time" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "hyper_meal" ALTER COLUMN "carbohydrates" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "hyper_meal" ALTER COLUMN "dietary_energy" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "hyper_meal" ALTER COLUMN "dietary_sugar" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "hyper_meal" ALTER COLUMN "fiber" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "hyper_meal" ALTER COLUMN "protein" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "hyper_meal" ALTER COLUMN "total_fat" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "hyper_cgm_data" ADD COLUMN "transmitter_ticks" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "hyper_cgm_data" ADD COLUMN "status" varchar(20);--> statement-breakpoint
ALTER TABLE "hyper_cgm_data" ADD COLUMN "unit" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "hyper_cgm_data" ADD COLUMN "rate_unit" varchar(20) NOT NULL;