/*
  Warnings:

  - The primary key for the `markOptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `questionID` to the `markOptions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_markOptions" (
    "optionId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "questionID" TEXT NOT NULL,

    PRIMARY KEY ("optionId", "questionID"),
    CONSTRAINT "markOptions_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "markOptions_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "markOptions_questionID_fkey" FOREIGN KEY ("questionID") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_markOptions" ("optionId", "submissionId") SELECT "optionId", "submissionId" FROM "markOptions";
DROP TABLE "markOptions";
ALTER TABLE "new_markOptions" RENAME TO "markOptions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
