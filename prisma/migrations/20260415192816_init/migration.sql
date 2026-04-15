-- CreateEnum
CREATE TYPE "JobState" AS ENUM ('offer', 'applied', 'interview', 'rejected');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "vacantName" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "state" "JobState" NOT NULL,
    "rejectionReason" TEXT,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job_tech" (
    "job_id" INTEGER NOT NULL,
    "tech_id" INTEGER NOT NULL,

    CONSTRAINT "Job_tech_pkey" PRIMARY KEY ("job_id","tech_id")
);

-- CreateTable
CREATE TABLE "Tech" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tech_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tech_name_key" ON "Tech"("name");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_tech" ADD CONSTRAINT "Job_tech_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_tech" ADD CONSTRAINT "Job_tech_tech_id_fkey" FOREIGN KEY ("tech_id") REFERENCES "Tech"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
