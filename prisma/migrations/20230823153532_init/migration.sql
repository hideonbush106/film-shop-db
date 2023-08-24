-- CreateEnum
CREATE TYPE "roles" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "genres" AS ENUM ('ACTION', 'ADVENTURE', 'COMEDY', 'CRIME', 'DRAMA', 'FANTASY', 'HISTORICAL', 'HISTORICAL_FICTION', 'HORROR', 'MAGICAL_REALISM', 'MYSTERY', 'PARANOID_FICTION', 'PHILOSOPHICAL', 'POLITICAL', 'ROMANCE', 'SAGA', 'SATIRE', 'SCIENCE_FICTION', 'SOCIAL', 'SPECULATIVE', 'THRILLER', 'URBAN', 'WESTERN', 'WAR');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "roles" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "films" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "genre" "genres"[],
    "description" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "rating" DECIMAL(65,30) NOT NULL,
    "trailerURL" TEXT NOT NULL,
    "posterURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "directorId" TEXT NOT NULL,

    CONSTRAINT "films_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "directors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "nations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FilmToNation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FilmToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_FilmToNation_AB_unique" ON "_FilmToNation"("A", "B");

-- CreateIndex
CREATE INDEX "_FilmToNation_B_index" ON "_FilmToNation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FilmToUser_AB_unique" ON "_FilmToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FilmToUser_B_index" ON "_FilmToUser"("B");

-- AddForeignKey
ALTER TABLE "films" ADD CONSTRAINT "films_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "directors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmToNation" ADD CONSTRAINT "_FilmToNation_A_fkey" FOREIGN KEY ("A") REFERENCES "films"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmToNation" ADD CONSTRAINT "_FilmToNation_B_fkey" FOREIGN KEY ("B") REFERENCES "nations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmToUser" ADD CONSTRAINT "_FilmToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "films"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmToUser" ADD CONSTRAINT "_FilmToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
