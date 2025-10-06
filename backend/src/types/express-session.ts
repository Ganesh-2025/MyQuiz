import "express-session";
declare module "express-session" {
  interface SessionData {
    quizID: string | null;
    startedAt: number;
    expiredAt?: Date | null;
    timeremainingSec?: number | null;
    timeLimitSec?: number | null;
    hasTimeLimit: boolean;
    userID: string;
    submissionID: string;
  }
}
