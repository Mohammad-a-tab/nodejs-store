/*
  Warnings:

  - You are about to drop the column `Short_text` on the `blog` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `blog` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `blog` table. All the data in the column will be lost.
  - Added the required column `short_text` to the `blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blog" DROP COLUMN "Short_text",
DROP COLUMN "createAt",
DROP COLUMN "updateAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "short_text" VARCHAR(300) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "user_name" VARCHAR(50),
    "age" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bio" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
