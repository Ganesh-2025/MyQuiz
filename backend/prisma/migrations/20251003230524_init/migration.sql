/*
  Warnings:

  - Added the required column `marks` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "questionNo" INTEGER NOT NULL,
    "quizId" TEXT NOT NULL,
    "marks" INTEGER NOT NULL,
    CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("id", "questionNo", "quizId", "text") SELECT "id", "questionNo", "quizId", "text" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE UNIQUE INDEX "Question_id_key" ON "Question"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
