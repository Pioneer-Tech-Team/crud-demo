-- CreateTable
CREATE TABLE "CompanyGroup" (
    "company_group_id" SERIAL NOT NULL,
    "company_group_name" VARCHAR(50) NOT NULL,
    "contact_person" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(10) NOT NULL,
    "email_id" VARCHAR(100) NOT NULL,
    "entered_by" TEXT NOT NULL,
    "entry_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edited_by" TEXT,
    "edit_date_time" TIMESTAMP(3),

    CONSTRAINT "CompanyGroup_pkey" PRIMARY KEY ("company_group_id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pan" TEXT NOT NULL,
    "panName" TEXT NOT NULL,
    "aadhar" TEXT NOT NULL,
    "gstin" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyGroup_company_group_name_key" ON "CompanyGroup"("company_group_name");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyGroup_email_id_key" ON "CompanyGroup"("email_id");

-- AddForeignKey
ALTER TABLE "CompanyGroup" ADD CONSTRAINT "CompanyGroup_entered_by_fkey" FOREIGN KEY ("entered_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyGroup" ADD CONSTRAINT "CompanyGroup_edited_by_fkey" FOREIGN KEY ("edited_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_id_fkey" FOREIGN KEY ("id") REFERENCES "CompanyGroup"("company_group_id") ON DELETE RESTRICT ON UPDATE CASCADE;
