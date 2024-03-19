import ERRORS_NAMES from "../../constants/errors";
import MATCH_STATUSES from "../../constants/matchStatuses";
import IMatch, {
  MatchStatus,
  Score,
  Team,
} from "../../interfaces/match.interface";
import Announcer from "../announcer";

export default class Match {
  private _id: string;
  private _homeTeam: Team;
  private _awayTeam: Team;
  private _score: number;
  private _time: number;
  private _status: MatchStatus;

  constructor(match: IMatch) {
    const { homeTeam, awayTeam } = match;

    if (homeTeam.name === awayTeam.name) {
      throw new Error(ERRORS_NAMES.SAME_NAME);
    }

    this._id = match?.id || Math.round(Math.random() * 10000).toString();
    this._homeTeam = { ...homeTeam };
    this._awayTeam = { ...awayTeam };
    this._score = match?.score || 0;
    this._time = match?.time || 0;
    this._status = match?.status;
  }

  get id() {
    return this._id;
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
    if (this._status) {
      throw new Error(ERRORS_NAMES.MATCH_STARTED);
    }

    this._time = Date.now();
    this._status = MATCH_STATUSES.STARTED;

    return Announcer.matchBegin({
      homeTeamName: this._homeTeam.name,
      awayTeamName: this._awayTeam.name,
    });
  }

  updateMatch(score: Score): string {
    if (this._status === MATCH_STATUSES.IN_PROGRESS) {
      throw new Error(ERRORS_NAMES.MATCH_FINISHED);
    } else if (
      !score.hasOwnProperty("homeScore") ||
      !score.hasOwnProperty("awayScore")
    ) {
      throw new Error(ERRORS_NAMES.INCORRECT_VALUE);
    } else if (!isFinite(score.homeScore) || !isFinite(score.awayScore)) {
      throw new Error(ERRORS_NAMES.INCORRECT_VALUE);
    }

    const { homeScore, awayScore } = score;

    //It allows to take 1 point, if the decission was wrong
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
    if (this._status === MATCH_STATUSES.IN_PROGRESS) {
      throw new Error(ERRORS_NAMES.MATCH_FINISHED);
    }

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
