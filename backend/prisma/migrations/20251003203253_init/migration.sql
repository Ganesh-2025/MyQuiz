-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "Quiz_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Quiz" ("attempts", "authorID", "closeAt", "createdAt", "description", "difficulty", "id", "liveAt", "negativeMarking", "passingScore", "password", "shuffle", "timeLimitSec", "title", "totalMarks", "updatedAt") SELECT "attempts", "authorID", "closeAt", "createdAt", "description", "difficulty", "id", "liveAt", "negativeMarking", "passingScore", "password", "shuffle", "timeLimitSec", "title", "totalMarks", "updatedAt" FROM "Quiz";
DROP TABLE "Quiz";
ALTER TABLE "new_Quiz" RENAME TO "Quiz";
CREATE UNIQUE INDEX "Quiz_id_key" ON "Quiz"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
