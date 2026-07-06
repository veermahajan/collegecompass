-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "gradeLevel" TEXT NOT NULL,
    "ageConfirmed13Plus" BOOLEAN NOT NULL DEFAULT false,
    "consentSensitiveData" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "unweightedGpa" DOUBLE PRECISION,
    "ucWeightedGpa" DOUBLE PRECISION,
    "satScore" INTEGER,
    "actScore" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "gradeReceived" TEXT NOT NULL,
    "rigorPoints" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtracurricularEntry" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "hoursPerWeek" DOUBLE PRECISION NOT NULL,
    "weeksPerYear" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ExtracurricularEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HonorAward" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "HonorAward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompassScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "academicsScore" DOUBLE PRECISION NOT NULL,
    "honorsScore" DOUBLE PRECISION NOT NULL,
    "extracurricularsScore" DOUBLE PRECISION NOT NULL,
    "essaysScore" DOUBLE PRECISION NOT NULL,
    "contextScoreEncrypted" TEXT NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompassScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avgGpaUnweighted" DOUBLE PRECISION,
    "avgSat" INTEGER,
    "avgAct" INTEGER,
    "acceptanceRate" DOUBLE PRECISION,
    "needBlind" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollegeListEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollegeListEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "tag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuidanceContent" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "embedUrl" TEXT,
    "bodyMarkdown" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "GuidanceContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EssayExample" (
    "id" TEXT NOT NULL,
    "fieldOfInterest" TEXT NOT NULL,
    "essayText" TEXT NOT NULL,
    "breakdown" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EssayExample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "graduateName" TEXT NOT NULL,
    "schoolAdmitted" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "tipText" TEXT NOT NULL,
    "yearGraduated" INTEGER NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "message" TEXT NOT NULL,
    "honeypotTriggered" BOOLEAN NOT NULL DEFAULT false,
    "ipHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicProfile_userId_key" ON "AcademicProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CompassScore_userId_key" ON "CompassScore"("userId");

-- AddForeignKey
ALTER TABLE "AcademicProfile" ADD CONSTRAINT "AcademicProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "AcademicProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtracurricularEntry" ADD CONSTRAINT "ExtracurricularEntry_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "AcademicProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HonorAward" ADD CONSTRAINT "HonorAward_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "AcademicProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeListEntry" ADD CONSTRAINT "CollegeListEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackSubmission" ADD CONSTRAINT "FeedbackSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
