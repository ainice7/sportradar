import ERRORS_NAMES from "../../constants/errors";
import MATCH_STATUSES from "../../constants/matchStatuses";
import IMatch, { MatchStatus, Team } from "../../interfaces/match.interface";
import Announcer from "../announcer";

export default class Match implements IMatch {
  private _homeTeam: Team;
  private _awayTeam: Team;
  private _score: number;
  private _time: number;
  private _status: MatchStatus;

  constructor({ homeTeamName, awayTeamName }: Record<string, string>) {
    if (homeTeamName === awayTeamName) {
      throw new Error(ERRORS_NAMES.SAME_NAME);
    }

    const score = 0;

    this._homeTeam = { name: homeTeamName, score };
    this._awayTeam = { name: awayTeamName, score };

    return;
  }

  get homeTeam() {
    return this._homeTeam;
  }
  get awayTeam() {
    return this._awayTeam;
  }
  get score() {
    return this._score;
  }
  get time() {
    return this._time;
  }
  get status() {
    return this._status;
  }

  startMatch(): string {
    this._time = Date.now();
    this._status = MATCH_STATUSES.STARTED;

    return Announcer.matchBegin({
      homeTeamName: this._homeTeam.name,
      awayTeamName: this._awayTeam.name,
    });
  }

  updateMatch(homeScore: number, awayScore: number): string {
    //It allows to take 1 point, if the decission was worng
    if (
      homeScore < this._homeTeam.score - 1 ||
      awayScore < this._awayTeam.score - 1
    ) {
      throw new Error(ERRORS_NAMES.INCORRECT_VALUE);
    }

    this._homeTeam.score = homeScore;
    this._awayTeam.score = awayScore;
    this._score = homeScore + awayScore;

    return Announcer.matchUpdated({
      homeTeam: this._homeTeam,
      awayTeam: this._awayTeam,
    });
  }

  finishMatch(): string {
    let result: string;
    this._status = MATCH_STATUSES.IN_PROGRESS;

    if (this._homeTeam.score === this._awayTeam.score) {
      result = "Draw!";
    } else {
      result = `${this._homeTeam.name} ${this._homeTeam.score} - ${this._awayTeam.name} ${this._awayTeam.score}.`;
    }

    return Announcer.matchFinished(result);
  }
}
