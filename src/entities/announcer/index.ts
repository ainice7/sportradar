import ERRORS_NAMES from "../../constants/errors";
import { IMatchTeams } from "../../interfaces/match.interface";

export default class Announcer {
  static matchBegin(teamsNames: {
    homeTeamName: string;
    awayTeamName: string;
  }) {
    if (typeof teamsNames !== "object") {
      throw new Error(ERRORS_NAMES.INCORRECT_VALUE);
    }

    return `The match between ${teamsNames.homeTeamName} and ${teamsNames.awayTeamName} has been started.`;
  }

  static matchUpdated(teams: IMatchTeams) {
    if (
      typeof teams !== "object" ||
      !teams.hasOwnProperty("homeTeam") ||
      !teams.hasOwnProperty("awayTeam")
    ) {
      throw new Error(ERRORS_NAMES.INCORRECT_VALUE);
    }

    const { homeTeam, awayTeam } = teams;

    return `The match has been updated. ${homeTeam.name}: ${homeTeam.score} vs ${awayTeam.name}: ${awayTeam.score}.`;
  }

  static matchFinished(result: string | number) {
    return `The match has been finished. ${result}`;
  }
}
