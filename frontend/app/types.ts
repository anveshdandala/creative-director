export interface CreativePlan {
  title: string;
  concept: string;
  targetAudience: string;
  aesthetic: {
    colorPalette: string[];
    visualVibe: string;
    lighting: string;
  };
  hooks: string[];
  storyboard: Array<{
    shot: number;
    description: string;
    duration: string;
    angle: string;
  }>;
  music: {
    genre: string;
    tempo: string;
    vibe: string;
  };
  platformTips: {
    instagram: string;
    tiktok: string;
  };
}

export interface DirectorReview {
  scores: {
    composition: string;
    lighting: string;
    hook: string;
    pacing: string;
  };
  feedback: {
    whatIsWorking: string;
    areasToImprove: string;
    directorNotes: string;
  };
  captions: Array<{
    text: string;
    vibe: string;
  }>;
  hashtags: string[];
  postingStrategy: {
    bestTime: string;
    rationale: string;
  };
}
