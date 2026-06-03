
export interface StyleVector {
  variety: number;      // Single -> Variety (单一性-多样性)
  gorgeousness: number; // Simple -> Gorgeous (简约-华丽)
  dynamism: number;     // Static -> Dynamic (静态-动感)
  intensity: number;    // Soft -> Intense (柔和-强烈)
  interest: number;     // Bored -> Interesting (乏味-有趣)
}

export interface WoodTensor {
  angle: number;
  v_wood: StyleVector;
}

export enum ProcessingStep {
  IDLE = 'IDLE',
  ENCODING_TARGET = 'ENCODING_TARGET', 
  OPTIMIZING = 'OPTIMIZING',          
  GENERATING = 'GENERATING'
}
