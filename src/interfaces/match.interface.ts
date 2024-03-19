import MATCH_STATUSES from "../constants/matchStatuses";

export default interface IMatch extends IMatchTeams {
  id?: string;
  score?: number;
  time?: number;
  status?: MatchStatus;
}

export interface IMatchTeams {
  homeTeam: Team;
  awayTeam: Team;
}

export type Team = {
  name: string;
  score: number;
};

export type Score = {
  homeScore: number;
  awayScore: number;
};

export type MatchStatus = MATCH_STATUSES.STARTED | MATCH_STATUSES.IN_PROGRESS;
