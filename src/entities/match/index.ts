import ERRORS_NAMES from "../../constants/errors";
import MATCH_STATUSES from "../../constants/matchStatuses";
import IMatch, { MatchStatus, Team } from "../../interfaces/match.interface";
import Announcer from "../announcer";

export default class Match implements IMatch {
  homeTeam: Team;
  awayTeam: Team;
  score: number;
  time: number;
  status: MatchStatus;

  constructor({ homeTeamName, awayTeamName }: Record<string, string>) {
    if (homeTeamName === awayTeamName) {
      throw new Error(ERRORS_NAMES.SAME_NAME);
    }

    const score = 0;

    this.homeTeam = { name: homeTeamName, score };
    this.awayTeam = { name: awayTeamName, score };

    return;
  }

  startMatch(): string {
    this.time = Date.now();
    this.status = MATCH_STATUSES.STARTED;

    return Announcer.matchBegin({
      homeTeamName: this.homeTeam.name,
      awayTeamName: this.awayTeam.name,
    });
  }

  updateMatch(homeScore: number, awayScore: number): string {
    //It allows to take 1 point, if the decission was worng
    if (
      homeScore < this.homeTeam.score - 1 ||
      awayScore < this.awayTeam.score - 1
    ) {
      throw new Error(ERRORS_NAMES.INCORRECT_VALUE);
    }

    this.homeTeam.score = homeScore;
    this.awayTeam.score = awayScore;
    this.score = homeScore + awayScore;

    return Announcer.matchUpdated({
      homeTeam: this.homeTeam,
      awayTeam: this.awayTeam,
    });
  }

  finishMatch(): string {
    let result: string;
    this.status = MATCH_STATUSES.IN_PROGRESS;

    if (this.homeTeam.score === this.awayTeam.score) {
      result = "Draw!";
    } else {
      result = `${this.homeTeam.name} ${this.homeTeam.score} - ${this.awayTeam.name} ${this.awayTeam.score}.`;
    }

    return Announcer.matchFinished(result);
  }
}
