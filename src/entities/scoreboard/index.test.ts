import Scoreboard from ".";
import matches from "../../../matches.json";
import ERRORS_NAMES from "../../constants/errors";
import MATCH_STATUSES from "../../constants/matchStatuses";
import IMatch from "../../interfaces/match.interface";

describe("Initiates correctly", () => {
  test("Collections size check", () => {
    const newScoreboard = new Scoreboard(matches as IMatch[]);
    const emptyScoreboard = new Scoreboard();

    expect(newScoreboard.scoreboard.size).toBe(2);
    expect(newScoreboard.summary.size).toBe(3);

    expect(emptyScoreboard.scoreboard.size).toBe(0);
    expect(emptyScoreboard.summary.size).toBe(0);
  });

  test("Wrong input check", () => {
    const wrongTypes = [{}, "", 1, false];

    wrongTypes.forEach((type) => {
      //@ts-ignore
      expect(() => new Scoreboard(type)).toThrow(ERRORS_NAMES.INCORRECT_VALUE);
    });
  });
});

describe("Match creating", () => {
  const newMatch = {
    homeTeamName: "Brazil",
    awayTeamName: "Argentina",
  };

  test("Creates correctly", () => {
    const newScoreboard = new Scoreboard();

    newScoreboard.createMatch(newMatch);
    expect(newScoreboard.scoreboard.size).toBe(1);
  });

  test("Wrong values", () => {
    const newScoreboard = new Scoreboard();
    const scenarios = [{ homeTeamName: "Hello Kitty" }, 1, "", [], false];

    scenarios.forEach((scenario) => {
      //@ts-ignore
      expect(() => newScoreboard.createMatch(scenario)).toThrow(
        ERRORS_NAMES.INCORRECT_VALUE
      );
    });
    expect(newScoreboard.scoreboard.size).toBe(0);
    expect(newScoreboard.summary.size).toBe(0);
  });
});

describe("Match update", () => {
  test("Updates correctly", () => {
    const newScoreboard = new Scoreboard(matches as IMatch[]);

    newScoreboard.updateMatch("1232", { homeScore: 2, awayScore: 2 });
    const updatedMatch = newScoreboard.scoreboard.get("1232");
    expect(updatedMatch.homeTeam.score).toBe(2);
    expect(updatedMatch.awayTeam.score).toBe(2);
  });

  test("No updating when wrong id", () => {
    const newScoreboard = new Scoreboard(matches as IMatch[]);

    expect(() =>
      newScoreboard.updateMatch("1232234", { homeScore: 2, awayScore: 2 })
    ).toThrow(ERRORS_NAMES.NOT_FOUND);
  });

  test("No updating when wrong scores", () => {
    const newScoreboard = new Scoreboard(matches as IMatch[]);
    const scenarios = [
      { homeScore: 2 },
      { someOtherScore: 2 },
      1,
      { homeScore: null, awayScore: 0 },
      [],
    ];

    scenarios.forEach((scenario) => {
      expect(() =>
        //@ts-ignore
        newScoreboard.updateMatch("1232", scenario)
      ).toThrow(ERRORS_NAMES.INCORRECT_VALUE);
    });
  });
});

describe("Match finish", () => {
  test("Finishes correctly", () => {
    const newScoreboard = new Scoreboard(matches as IMatch[]);

    expect(newScoreboard.scoreboard.size).toBe(2);
    expect(newScoreboard.summary.size).toBe(3);

    newScoreboard.finishMatch("1232");
    expect(() => newScoreboard.scoreboard.get("1232").status).toThrow(
      TypeError
    );
    expect(newScoreboard.summary.get("1232").status).toBe(
      MATCH_STATUSES.IN_PROGRESS
    );
    expect(newScoreboard.scoreboard.size).toBe(1);
    expect(newScoreboard.summary.size).toBe(4);
  });

  test("No finish when wrong id", () => {
    const newScoreboard = new Scoreboard(matches as IMatch[]);

    expect(newScoreboard.scoreboard.size).toBe(2);
    expect(newScoreboard.summary.size).toBe(3);

    expect(() => newScoreboard.finishMatch("1232455")).toThrow(
      ERRORS_NAMES.NOT_FOUND
    );

    expect(newScoreboard.scoreboard.size).toBe(2);
    expect(newScoreboard.summary.size).toBe(3);
  });
});

describe("Shows correct results", () => {
  const newScoreboard = new Scoreboard(matches as IMatch[]);
  test("Show summary", () => {
    const results = newScoreboard.showSummary();
    const expectedResults = [
      "USA 6 - Canada 7",
      "Japan 4 - China 9",
      "France 1 - Norway 2",
    ];

    results.forEach((result, index) => {
      expect(result).toBe(expectedResults[index]);
    });
  });

  test("Show ongoing", () => {
    const results = newScoreboard.showOngoing();
    const expectedResults = ["Afrika 2 - Germany 1", "Italia 0 - Spain 0"];

    results.forEach((result, index) => {
      expect(result).toBe(expectedResults[index]);
    });
  });
});
