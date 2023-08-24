/*
  Warnings:

  - The values [CRIME,HISTORICAL_FICTION,MAGICAL_REALISM,MYSTERY,PARANOID_FICTION,PHILOSOPHICAL,POLITICAL,SAGA,SATIRE,SPECULATIVE,URBAN] on the enum `genres` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `directorId` on the `films` table. All the data in the column will be lost.
  - You are about to drop the `_FilmToNation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `directors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[title]` on the table `films` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `director` to the `films` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "genres_new" AS ENUM ('ACTION', 'ADVENTURE', 'ANIMATION', 'COMEDY', 'DRAMA', 'FANTASY', 'HISTORICAL', 'HORROR', 'MUSICAL', 'NOIR', 'ROMANCE', 'SCIENCE_FICTION', 'SOCIAL', 'THRILLER', 'WESTERN', 'WAR');
ALTER TABLE "films" ALTER COLUMN "genre" TYPE "genres_new"[] USING ("genre"::text::"genres_new"[]);
ALTER TYPE "genres" RENAME TO "genres_old";
ALTER TYPE "genres_new" RENAME TO "genres";
DROP TYPE "genres_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "_FilmToNation" DROP CONSTRAINT "_FilmToNation_A_fkey";

-- DropForeignKey
ALTER TABLE "_FilmToNation" DROP CONSTRAINT "_FilmToNation_B_fkey";

-- DropForeignKey
ALTER TABLE "films" DROP CONSTRAINT "films_directorId_fkey";

-- AlterTable
ALTER TABLE "films" DROP COLUMN "directorId",
ADD COLUMN     "director" TEXT NOT NULL,
ADD COLUMN     "nation" TEXT[];

-- DropTable
DROP TABLE "_FilmToNation";

-- DropTable
DROP TABLE "directors";

-- DropTable
DROP TABLE "nations";

-- CreateIndex
CREATE UNIQUE INDEX "films_title_key" ON "films"("title");
