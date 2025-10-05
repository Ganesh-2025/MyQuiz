/*
  Warnings:

  - Added the required column `updatedAt` to the `Option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Option" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isAnswer" BOOLEAN NOT NULL DEFAULT false,
    "optionNo" INTEGER NOT NULL,
    "questionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Option" ("id", "isAnswer", "optionNo", "questionId", "text") SELECT "id", "isAnswer", "optionNo", "questionId", "text" FROM "Option";
DROP TABLE "Option";
ALTER TABLE "new_Option" RENAME TO "Option";
CREATE UNIQUE INDEX "Option_id_key" ON "Option"("id");
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "questionNo" INTEGER NOT NULL,
    "quizId" TEXT NOT NULL,
    "marks" INTEGER NOT NULL,
    "deduct" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("id", "marks", "questionNo", "quizId", "text") SELECT "id", "marks", "questionNo", "quizId", "text" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE UNIQUE INDEX "Question_id_key" ON "Question"("id");
CREATE TABLE "new_Quiz" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "password" TEXT,
    "authorID" TEXT NOT NULL,
    "timeLimitSec" INTEGER,
    "passingScore" INTEGER,
    "totalMarks" INTEGER,
    "attempts" INTEGER,
    "difficulty" TEXT NOT NULL,
    "liveAt" DATETIME,
    "closeAt" DATETIME,
    "negativeMarking" BOOLEAN,
    "shuffle" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Quiz_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Quiz" ("attempts", "authorID", "closeAt", "createdAt", "description", "difficulty", "id", "liveAt", "negativeMarking", "passingScore", "password", "shuffle", "timeLimitSec", "title", "totalMarks", "updatedAt") SELECT "attempts", "authorID", "closeAt", "createdAt", "description", "difficulty", "id", "liveAt", "negativeMarking", "passingScore", "password", "shuffle", "timeLimitSec", "title", "totalMarks", "updatedAt" FROM "Quiz";
DROP TABLE "Quiz";
ALTER TABLE "new_Quiz" RENAME TO "Quiz";
CREATE UNIQUE INDEX "Quiz_id_key" ON "Quiz"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
