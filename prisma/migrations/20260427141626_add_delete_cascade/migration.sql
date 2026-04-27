-- DropForeignKey
ALTER TABLE "Job_tech" DROP CONSTRAINT "Job_tech_job_id_fkey";

-- AddForeignKey
ALTER TABLE "Job_tech" ADD CONSTRAINT "Job_tech_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
