import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval(
  'post-trivia-questions',
  { minutes: 5 }, // Every 5 minutes
  internal.trivia.postTriviaQuestion
);

export default crons;
