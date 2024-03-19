import Match from ".";
import ERRORS_NAMES from "../../constants/errors";
import MATCH_STATUSES from "../../constants/matchStatuses";
import Announcer from "../announcer";

function createEntities() {
  const teamsNames = { homeTeamName: "Clones", awayTeamName: "Jedis" };
  const homeTeam = {
    name: teamsNames.homeTeamName,
    score: 0,
  };
  const awayTeam = {
    name: teamsNames.awayTeamName,
    score: 0,
  };
  const teams = { homeTeam, awayTeam };

  return { teamsNames, teams };
}

describe("Match start test", () => {
  const { teamsNames, teams } = createEntities();

  test("Correct beginning", () => {
    const match = new Match(teams);

    expect(match.homeTeam).toMatchObject({
      name: teamsNames.homeTeamName,
      score: 0,
    });
    expect(match.awayTeam).toMatchObject({
      name: teamsNames.awayTeamName,
      score: 0,
    });
    expect(typeof match.id).toBe("string");
    expect(match.score).toBe(0);
    expect(match.time).toBe(0);
    expect(match.status).toBe(undefined);
    expect(match.startMatch()).toEqual(Announcer.matchBegin(teamsNames));
    expect(typeof match.time).toBe("number");
    expect(match.status).toBe(MATCH_STATUSES.STARTED);
  });

  test("Error when equal teams", () => {
    const clonesTeams = { ...teams, awayTeam: { name: "Clones", score: 0 } };
    expect(() => new Match(clonesTeams)).toThrow(ERRORS_NAMES.SAME_NAME);
  });

  test("Error when starting twice", () => {
    const match = new Match(teams);
    match.startMatch();
    expect(() => match.startMatch()).toThrow(ERRORS_NAMES.MATCH_STARTED);
  });
});

describe("Match update test", () => {
  const { teamsNames, teams } = createEntities();

  test("Correct update", () => {
    const match = new Match(teams);

    expect(match.updateMatch({ homeScore: 1, awayScore: 0 })).toEqual(
      Announcer.matchUpdated({
        homeTeam: { name: teamsNames.homeTeamName, score: 1 },
        awayTeam: { name: teamsNames.awayTeamName, score: 0 },
      })
    );
    expect(match.homeTeam.score).toBe(1);
    expect(match.awayTeam.score).toBe(0);
    expect(match.score).toBe(1);

    expect(match.updateMatch({ homeScore: 1, awayScore: 1 })).toEqual(
      Announcer.matchUpdated({
        homeTeam: { name: teamsNames.homeTeamName, score: 1 },
        awayTeam: { name: teamsNames.awayTeamName, score: 1 },
      })
    );
    expect(match.homeTeam.score).toBe(1);
    expect(match.awayTeam.score).toBe(1);
    expect(match.score).toBe(2);

    expect(match.updateMatch({ homeScore: 4, awayScore: 6 })).toEqual(
      Announcer.matchUpdated({
        homeTeam: { name: teamsNames.homeTeamName, score: 4 },
        awayTeam: { name: teamsNames.awayTeamName, score: 6 },
      })
    );
    expect(match.homeTeam.score).toBe(4);
    expect(match.awayTeam.score).toBe(6);
    expect(match.score).toBe(10);
  });

  test("Wrong update", () => {
    const match = new Match(teams);

    match.updateMatch({ homeScore: 6, awayScore: 8 });
    expect(match.homeTeam.score).toBe(6);
    expect(match.awayTeam.score).toBe(8);
    expect(match.score).toBe(14);
    match.updateMatch({ homeScore: 6, awayScore: 7 });
    expect(match.homeTeam.score).toBe(6);
    expect(match.awayTeam.score).toBe(7);
    expect(match.score).toBe(13);
    expect(() => match.updateMatch({ homeScore: 6, awayScore: 5 })).toThrow(
      ERRORS_NAMES.INCORRECT_VALUE
    );

    match.finishMatch();
    expect(() => match.updateMatch({ homeScore: 6, awayScore: 8 })).toThrow(
      ERRORS_NAMES.MATCH_FINISHED
    );
  });
});

describe("Match finishing test", () => {
  const { teamsNames, teams } = createEntities();

  test("Correct finish", () => {
    const match = new Match(teams);
    const expectedResult = `${teamsNames.homeTeamName} 1 - ${teamsNames.awayTeamName} 0.`;

    match.startMatch();
    match.updateMatch({ homeScore: 1, awayScore: 0 });
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
    match.updateMatch({ homeScore: 1, awayScore: 1 });
    expect(match.finishMatch()).toEqual(
      Announcer.matchFinished(expectedResult)
    );
    expect(match.score).toBe(2);
    expect(match.status).toBe(MATCH_STATUSES.IN_PROGRESS);
  });

  test("Error when finishing twice", () => {
    const match = new Match(teams);

    match.startMatch();
    match.updateMatch({ homeScore: 1, awayScore: 1 });
    match.finishMatch();
    expect(() => match.finishMatch()).toThrow(ERRORS_NAMES.MATCH_FINISHED);
  });
});

describe("Testing protected fields", () => {
  const { teams } = createEntities();
  const match = new Match(teams);

  const protectedKeys = Object.keys(match);

  for (let key of protectedKeys) {
    let protectedKey = key.substring(1);
    test(`${protectedKey} is protected`, () => {
      //@ts-ignore
      expect(() => (match[protectedKey] = 1)).toThrow(TypeError);
    });
  }
});
