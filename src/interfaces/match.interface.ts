import MATCH_STATUSES from "../constants/matchStatuses";

export default interface IMatch extends IMatchTeams {
  score: number;
  time: number;
  status: MatchStatus;
  startMatch(): string;
  updateMatch(a: number, b: number): string;
  finishMatch(): string;
}

export interface IMatchTeams {
  homeTeam: Team;
  awayTeam: Team;
}

export type Team = {
  name: string;
  score: number;
};

export type MatchStatus = MATCH_STATUSES.STARTED | MATCH_STATUSES.IN_PROGRESS;
