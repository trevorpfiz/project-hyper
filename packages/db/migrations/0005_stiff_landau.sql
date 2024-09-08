CREATE INDEX IF NOT EXISTS "cgm_data_profile_id_idx" ON "hyper_cgm_data" USING btree ("profile_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "cgm_data_record_id_idx" ON "hyper_cgm_data" USING btree ("record_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "daily_recap_profile_id_date_idx" ON "hyper_daily_recap" USING btree ("profile_id","date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "hyper_profile" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "hyper_profile" USING btree ("email");--> statement-breakpoint
ALTER TABLE "hyper_daily_recap" ADD CONSTRAINT "hyper_daily_recap_date_profile_id_unique" UNIQUE("date","profile_id");