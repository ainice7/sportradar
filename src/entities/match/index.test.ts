import Match from ".";
import ERRORS_NAMES from "../../constants/errors";
import MATCH_STATUSES from "../../constants/matchStatuses";
import Announcer from "../announcer";

describe("Match start test", () => {
  const teams = { homeTeamName: "Clones", awayTeamName: "Jedis" };

  test("Correct beginning", () => {
    const match = new Match(teams);

    expect(match.homeTeam).toMatchObject({
      name: teams.homeTeamName,
      score: 0,
    });
    expect(match.awayTeam).toMatchObject({
      name: teams.awayTeamName,
      score: 0,
    });
    expect(match.score).toBe(undefined);
    expect(match.time).toBe(undefined);
    expect(match.status).toBe(undefined);
    expect(match.startMatch()).toEqual(Announcer.matchBegin(teams));
    expect(typeof match.time).toBe("number");
    expect(match.status).toBe(MATCH_STATUSES.STARTED);
  });

  test("Error when equal teams", () => {
    teams.awayTeamName = "Clones";
    expect(() => new Match(teams)).toThrow(ERRORS_NAMES.SAME_NAME);
  });
});

describe("Match update test", () => {
  const teams = { homeTeamName: "Clones", awayTeamName: "Jedis" };

  test("Correct update", () => {
    const match = new Match(teams);

    expect(match.updateMatch(1, 0)).toEqual(
      Announcer.matchUpdated({
        homeTeam: { name: teams.homeTeamName, score: 1 },
        awayTeam: { name: teams.awayTeamName, score: 0 },
      })
    );
    expect(match.homeTeam.score).toBe(1);
    expect(match.awayTeam.score).toBe(0);
    expect(match.score).toBe(1);

    expect(match.updateMatch(1, 1)).toEqual(
      Announcer.matchUpdated({
        homeTeam: { name: teams.homeTeamName, score: 1 },
        awayTeam: { name: teams.awayTeamName, score: 1 },
      })
    );
    expect(match.homeTeam.score).toBe(1);
    expect(match.awayTeam.score).toBe(1);
    expect(match.score).toBe(2);

    expect(match.updateMatch(4, 6)).toEqual(
      Announcer.matchUpdated({
        homeTeam: { name: teams.homeTeamName, score: 4 },
        awayTeam: { name: teams.awayTeamName, score: 6 },
      })
    );
    expect(match.homeTeam.score).toBe(4);
    expect(match.awayTeam.score).toBe(6);
    expect(match.score).toBe(10);
  });

  test("Wrong update", () => {
    const match = new Match(teams);

    match.updateMatch(6, 8);
    expect(match.homeTeam.score).toBe(6);
    expect(match.awayTeam.score).toBe(8);
    expect(match.score).toBe(14);
    match.updateMatch(6, 7);
    expect(match.homeTeam.score).toBe(6);
    expect(match.awayTeam.score).toBe(7);
    expect(match.score).toBe(13);
    expect(() => match.updateMatch(6, 5)).toThrow(ERRORS_NAMES.INCORRECT_VALUE);
  });
});

describe("Match finishing test", () => {
  const teams = { homeTeamName: "Clones", awayTeamName: "Jedis" };

  test("Correct finish", () => {
    const match = new Match(teams);
    const expectedResult = `${teams.homeTeamName} 1 - ${teams.awayTeamName} 0.`;

    match.startMatch();
    match.updateMatch(1, 0);
    expect(match.finishMatch()).toEqual(
      Announcer.matchFinished(expectedResult)
    );
    expect(match.score).toBe(1);
    expect(match.status).toBe(MATCH_STATUSES.IN_PROGRESS);
  });

  test("Correct draw", () => {
    const match = new Match(teams);
    const expectedResult = "Draw!";

    match.startMatch();
    match.updateMatch(1, 1);
    expect(match.finishMatch()).toEqual(
      Announcer.matchFinished(expectedResult)
    );
    expect(match.score).toBe(2);
    expect(match.status).toBe(MATCH_STATUSES.IN_PROGRESS);
  });
});

describe("Testing protected fields", () => {
  const teams = { homeTeamName: "Clones", awayTeamName: "Jedis" };
  const match = new Match(teams);

  const protectedKeys = ["homeTeam", "awayTeam", "score", "time", "status"];

  for (let key of protectedKeys) {
    test(`${key} is protected`, () => {
      //@ts-ignore
      expect(() => (match[key] = 1)).toThrow(TypeError);
    });
  }
});
