/*
  Warnings:

  - You are about to drop the column `answers` on the `Submissions` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `Submissions` table. All the data in the column will be lost.
  - The primary key for the `markOptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `markOptions` table. All the data in the column will be lost.
  - Added the required column `attemptNo` to the `Submissions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "attemptNo" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Submissions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Submissions" ("createdAt", "id", "quizId", "score", "updatedAt", "userId") SELECT "createdAt", "id", "quizId", "score", "updatedAt", "userId" FROM "Submissions";
DROP TABLE "Submissions";
ALTER TABLE "new_Submissions" RENAME TO "Submissions";
CREATE UNIQUE INDEX "Submissions_id_key" ON "Submissions"("id");
CREATE TABLE "new_markOptions" (
    "optionId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,

    PRIMARY KEY ("optionId", "submissionId"),
    CONSTRAINT "markOptions_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "markOptions_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_markOptions" ("optionId", "submissionId") SELECT "optionId", "submissionId" FROM "markOptions";
DROP TABLE "markOptions";
ALTER TABLE "new_markOptions" RENAME TO "markOptions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
