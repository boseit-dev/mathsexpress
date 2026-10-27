/** A question the student recently got wrong, shown so they can review it. */
export interface ReviewMistake {
  id: string;
  question: string;
  givenAnswer: string;
  correctAnswer: string;
}

/** The one topic suggested for practice next. */
export interface PracticeRecommendation {
  topicId: string;
  topicName: string;
  strand: string;
  /** Why this topic was chosen, in words a student understands. */
  reason: string;
  questionCount: number;
  estimatedMinutes: number;
  mistakes: ReviewMistake[];
}
