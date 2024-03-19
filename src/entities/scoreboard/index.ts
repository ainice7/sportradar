import orderBy from "lodash.orderby";

import IMatch, { Score } from "../../interfaces/match.interface";
import Match from "../match";
import MATCH_STATUSES from "../../constants/matchStatuses";
import ERRORS_NAMES from "../../constants/errors";
import { teamNames } from "../../interfaces/scoreboard.interface";

export default class Scoreboard {
  private _scoreboard: Map<string, Match> = new Map();
  private _summary: Map<string, Match> = new Map();

  constructor(scoreboard: IMatch[] = []) {
    if (!Array.isArray(scoreboard)) {
      throw new Error(ERRORS_NAMES.INCORRECT_VALUE);
    }

    scoreboard.forEach((element) => {
      const match = new Match(element);
      match.status === MATCH_STATUSES.STARTED
        ? this._scoreboard.set(match.id, match)
        : this._summary.set(match.id, match);
    });
  }

  get scoreboard() {
    return this._scoreboard;
  }

  get summary() {
    return this._summary;
  }

  private _showResults(collection: Map<string, Match>) {
    if (collection.size === 0) return [];

    const matches = Array.from(collection, ([name, value]) => value);
    const sortedMatches = orderBy(
      matches,
      ["score", "time"],
      ["desc", "desc"]
    ).map(
      ({ homeTeam, awayTeam }) =>
        `${homeTeam.name} ${homeTeam.score} - ${awayTeam.name} ${awayTeam.score}`
    );

    return sortedMatches;
  }

  createMatch(teams: teamNames) {
    if (
      !teams.hasOwnProperty("homeTeamName") ||
      !teams.hasOwnProperty("awayTeamName")
    ) {
      throw new Error(ERRORS_NAMES.INCORRECT_VALUE);
    }

    const { homeTeamName, awayTeamName } = teams;
    const score = 0;
    const newMatch = new Match({
      homeTeam: { name: homeTeamName, score },
      awayTeam: { name: awayTeamName, score },
    });
    this._scoreboard.set(newMatch.id, newMatch);

    return {
      message: newMatch.startMatch(),
      id: newMatch.id,
    };
  }

  updateMatch(id: string, scores: Score) {
    const requiredMatch = this._scoreboard.get(id);

    if (!requiredMatch) {
      throw new Error(ERRORS_NAMES.NOT_FOUND);
    }

    return requiredMatch.updateMatch(scores);
  }

  finishMatch(id: string) {
    const requiredMatch = this._scoreboard.get(id);

    if (!requiredMatch) {
      throw new Error(ERRORS_NAMES.NOT_FOUND);
    }

    const result = requiredMatch.finishMatch();

    this._scoreboard.delete(id);
    this._summary.set(id, requiredMatch);

    return result;
  }

  showOngoing() {
    return this._showResults(this._scoreboard);
  }

  showSummary() {
    return this._showResults(this._summary);
  }
}
