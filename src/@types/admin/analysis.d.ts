export interface VideoAnalysisAttributes {
    id: string;
    videoId: string;
    motionData?: string;
    facialExpressions?: string;
    keypoints?: string;
    durationAnalyzed: number;
    analysisStatus: 'pending' | 'in_progress' | 'completed';
    createdAt?: Date;
    updatedAt?: Date;
  }
  