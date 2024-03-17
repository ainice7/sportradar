import { IMatchTeams } from "../../interfaces/match.interface";

export default class Announcer {
  static matchBegin({
    homeTeamName,
    awayTeamName,
  }: {
    homeTeamName: string;
    awayTeamName: string;
  }) {
    return `The match between ${homeTeamName} and ${awayTeamName} has been started.`;
  }

  static matchUpdated({ homeTeam, awayTeam }: IMatchTeams) {
    return `The match has been updated. ${homeTeam.name}: ${homeTeam.score} vs ${awayTeam.name}: ${awayTeam.score}.`;
  }

  static matchFinished(result: string) {
    return `The match has been finished. ${result}.`;
  }
}
