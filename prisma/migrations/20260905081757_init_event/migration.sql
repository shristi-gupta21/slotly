-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('music', 'comedy', 'theatre', 'sports', 'workshop', 'exhibition', 'other');

-- CreateEnum
CREATE TYPE "City" AS ENUM ('delhi', 'mumbai', 'bengaluru', 'hyderabad', 'chennai', 'kolkata', 'pune', 'jaipur', 'other');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "genre" "Genre" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "description" TEXT,
    "city" "City" NOT NULL,
    "venue" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "time" TIME(0) NOT NULL,
    "contactName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
