import IScoreboard from "../../interfaces/scoreboard.interface";

class Scoreboard {
  scoreboard: IScoreboard;

  constructor(scoreboard: IScoreboard = {}) {
    this.scoreboard = scoreboard;
  }

  showScore() {
    this.scoreboard;
  }
}
