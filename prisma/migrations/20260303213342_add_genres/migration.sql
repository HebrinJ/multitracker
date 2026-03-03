/*
  Warnings:

  - You are about to drop the `BookGenre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MovieGenre` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN "genre" TEXT;

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN "genre" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BookGenre";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Genre";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MovieGenre";
PRAGMA foreign_keys=on;
