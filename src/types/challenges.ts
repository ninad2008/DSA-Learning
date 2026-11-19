import { ModuleId, SupportedLanguage } from './dsa';

export type ChallengeDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description?: string;
  isCustom?: boolean;
}

export interface Challenge {
  id: string;
  moduleId: ModuleId;
  title: string;
  difficulty: ChallengeDifficulty;
  xpReward: number;
  coinReward: number;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: Record<SupportedLanguage, string>;
  solutionCode: Record<SupportedLanguage, string>;
  hints: string[];
  testCases: TestCase[];
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
  validatorFnName: string;
}

export interface ChallengeSubmissionResult {
  passed: boolean;
  testCaseResults: {
    testCaseId: string;
    passed: boolean;
    actualOutput: string;
    expectedOutput: string;
    error?: string;
  }[];
  executionTimeMs: number;
}

