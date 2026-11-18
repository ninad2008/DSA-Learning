import { ModuleId } from './dsa';

export interface PredictQuestion {
  id: string;
  moduleId: ModuleId;
  question: string;
  contextState: any; // visual snapshot
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  xp: number;
}

export interface FixBrokenStructureCase {
  id: string;
  moduleId: ModuleId;
  title: string;
  description: string;
  initialBrokenState: any;
  flawDescription: string;
  instructions: string;
  validationCheck: (fixedState: any) => { valid: boolean; message: string };
  fixActions: {
    type: string;
    label: string;
    payload: any;
  }[];
}

export interface SpeedRoundItem {
  id: string;
  moduleId: ModuleId;
  prompt: string;
  visualSnippet?: any;
  options: string[];
  correctIndex: number;
  timeLimitSec: number;
}
