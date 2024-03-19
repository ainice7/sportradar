<!-- ABOUT THE PROJECT -->
## About The Project

It's a Live Football World Cup Score Board which is test-task for Sportradar.

<!-- GETTING STARTED -->
## Getting Started

To get started simply follow the instructions.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ainice7/sportradar.git
2. Install NPM packages
   ```sh
   npm install

## Usage

You can install `Scoreboard` with array or from scratch.
The example of array you can find in `matches.json`.

`Scoreboard` has:

* `scoreboard` - value, that contains all current matches as array of `Matches`;
* `summary` - value, that contains all finished matches as array of `Matches`;
* `createMatch` - function for creating a `Match`, returns `{ message: string, id: string }`;
* `updateMatch` - function for updating a `Match`, arguments are:
  - `id`: string;
  - `score`: { `homeScore`: number, `awayScore`: number };
* `finishMatch` - function for finishing a `Match` by `id`, arguments are:
  - `id`: string;
* `showOngoing` - function that returns all <b>started</b> matches, ordered by their total score in format `[HomeTeamName] [HomeScore] - [AwayTeamName] [AwayScore]`;
* `showSummary` - function that returns all <b>finished</b> matches, ordered by their total score in format `[HomeTeamName] [HomeTeamScore] - [AwayTeamName] [AwayTeamScore]`.

<i>The matches with the same total score will be returned ordered by the most recently started match in the scoreboard.</i>

`Match` has:

* `id`: string;
* `homeTeam`: { name: string, score: number } - value for home team;
* `awayTeam`: { name: string, score: number } - value for away team;
* `score`: number - the total amount;
* `time`: number - ms when the match was started;
* `status`: string - `STARTED` or `IN_PROGRESS`;
* `startMatch` - function that set the `time` and `status` as `STARTED`;
* `updateMatch` - function that updates the current match, arguments are:
  - `score`: { `homeScore`: number, `awayScore`: number };
* `finishMatch` - function for finishing the current match.
