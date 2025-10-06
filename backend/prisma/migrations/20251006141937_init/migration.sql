-- CreateTable
CREATE TABLE "Submissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "answers" TEXT NOT NULL,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Submissions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "markOptions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "optionId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    CONSTRAINT "markOptions_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "markOptions_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Submissions_id_key" ON "Submissions"("id");
