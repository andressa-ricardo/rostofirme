export interface ActivityAttributes {
    id: string;
    userId: string;
    exerciseId: string;
    videoWatched: boolean;
    date: Date;
    exerciseCompleted: boolean;
    performanceScore: number;
    timeSpent: number;
    progressNotes?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  