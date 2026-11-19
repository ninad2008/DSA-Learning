import { Badge } from '../types/gamification';

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_steps',
    name: 'Adventurer Begins',
    description: 'Complete your first DSA concept lesson.',
    icon: 'Compass',
    rarity: 'common',
  },
  {
    id: 'hash_hunter',
    name: 'Hash Hunter',
    description: 'Complete all levels of HashMap Explorer.',
    icon: 'Hash',
    module: 'hashmap',
    rarity: 'rare',
  },
  {
    id: 'duplicate_detective',
    name: 'Duplicate Detective',
    description: 'Master HashSet and solve all unique element puzzles.',
    icon: 'ShieldAlert',
    module: 'hashset',
    rarity: 'rare',
  },
  {
    id: 'heap_hero',
    name: 'Heap Hero',
    description: 'Master Min Heap operations and complete tree simulations.',
    icon: 'GitPullRequest',
    module: 'minheap',
    rarity: 'epic',
  },
  {
    id: 'index_master',
    name: 'Index Master',
    description: 'Conquer the 3-array invariant and changeKey operations of Index Heap.',
    icon: 'Binary',
    module: 'indexheap',
    rarity: 'epic',
  },
  {
    id: 'dsa_legend',
    name: 'DSA Legend',
    description: 'Complete all four modules with mastery test passed.',
    icon: 'Crown',
    rarity: 'legendary',
  },
  {
    id: 'streak_flame',
    name: 'Flame Keeper',
    description: 'Maintain a 3-day learning streak.',
    icon: 'Flame',
    rarity: 'common',
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Score over 150 points in the Speed Challenge game mode.',
    icon: 'Zap',
    rarity: 'rare',
  },
  {
    id: 'bug_buster',
    name: 'Bug Buster',
    description: 'Fix all broken data structures in Fix Mode.',
    icon: 'Wrench',
    rarity: 'rare',
  },
  {
    id: 'coder_elite',
    name: 'Coder Elite',
    description: 'Solve 5 interactive coding challenges.',
    icon: 'Code2',
    rarity: 'epic',
  }
];

