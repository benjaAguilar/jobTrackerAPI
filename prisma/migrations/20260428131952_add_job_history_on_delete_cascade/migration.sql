-- DropForeignKey
ALTER TABLE "JobHistory" DROP CONSTRAINT "JobHistory_job_id_fkey";

-- AddForeignKey
ALTER TABLE "JobHistory" ADD CONSTRAINT "JobHistory_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
