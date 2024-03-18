import Announcer from ".";
import ERRORS_NAMES from "../../constants/errors";

describe("Announcer test", () => {
  const teams = {
    homeTeam: {
      name: "Clones",
      score: 2,
    },
    awayTeam: {
      name: "Jedis",
      score: 2,
    },
  };
  const teamsNames = {
    homeTeamName: teams.homeTeam.name,
    awayTeamName: teams.awayTeam.name,
  };

  test("Start announces properly", () => {
    const startPhrase = `The match between ${teamsNames.homeTeamName} and ${teamsNames.awayTeamName} has been started.`;

    expect(Announcer.matchBegin(teamsNames)).toEqual(startPhrase);
    //@ts-ignore
    expect(() => Announcer.matchBegin(1)).toThrow(ERRORS_NAMES.INCORRECT_VALUE);
  });

  test("Update announces properly", () => {
    const updatePhrase = `The match has been updated. ${teams.homeTeam.name}: ${teams.homeTeam.score} vs ${teams.awayTeam.name}: ${teams.awayTeam.score}.`;

    expect(Announcer.matchUpdated(teams)).toEqual(updatePhrase);
    //@ts-ignore
    expect(() => Announcer.matchUpdated(1)).toThrow(
      ERRORS_NAMES.INCORRECT_VALUE
    );
    expect(() =>
      //@ts-ignore
      Announcer.matchUpdated({ domesticTeam: "", anotherTeam: "" })
    ).toThrow(ERRORS_NAMES.INCORRECT_VALUE);
  });

  test("Finish announces properly", () => {
    const result = "Friendship won!";
    const finishPhrase = `The match has been finished. ${result}`;

    expect(Announcer.matchFinished(result)).toEqual(finishPhrase);
  });
});
