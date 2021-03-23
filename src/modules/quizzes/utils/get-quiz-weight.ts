import { Quiz } from '../entities/quiz.entity';
import dayjs from 'dayjs';
import { QuizVerifyRequest } from '../entities/quiz-verify-request.entity';
import { QuizMeta } from '../entities/quiz-meta.entity';

const DAYS_BASE = 7;
const getDaysWeight = (verifyRequest: QuizVerifyRequest) => {
  const daysSinceUpdate = Math.abs(dayjs(verifyRequest.updatedAt).diff(dayjs(), 'day'));
  const funcValue = -(3/2) * (Math.log2(daysSinceUpdate + 1) + DAYS_BASE);
  return Math.max(funcValue, 0) / DAYS_BASE;
};

export const getVotesWeight = (votes: QuizMeta['votes']): number => {
  const allVotes = votes.voters?.length > 0 ? votes.voters.length : 1;
  const votesValue = typeof votes.value === 'number' ? votes.value : 0;
  return votesValue >= 0 ? votesValue : allVotes + votesValue;
};

interface Options {
  maxSurveys: number;
  maxVotes: number;
}

export const getWeight = ({ meta: { statistics }, verifyRequest, ...quiz }: Quiz, { maxSurveys, maxVotes }: Options): number => {
  const rawVotes = quiz['_doc'].meta.votes;
  const daysWeight = getDaysWeight(verifyRequest);
  const votesWeight = getVotesWeight(rawVotes) / maxVotes;
  const surveysWeight = statistics.surveysNumber / maxSurveys;
  const randomWeight = Math.random();

  return (surveysWeight + votesWeight + daysWeight + randomWeight) / 4;
};
