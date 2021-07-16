import dummyLeagues from "../dummyLeagues.json";
import { League, Player, Team } from "../interfaces/types";
import { ActionTyp } from "./types";

export interface SoccerState {
  leagues: League[];
  selectType: string;
}

type Action = { type: string; payload: { id: string; hide: boolean } };

const inistalState = {
  leagues: dummyLeagues,
  selectType: "",
};

const reducer = (
  state: SoccerState = inistalState,
  action: Action
): SoccerState => {
  switch (action.type) {
    case ActionTyp.TOOGLE_ELEMENT:
      let type: string;

      return {
        ...state,
        leagues: state.leagues.map<League>((el): League => {
          const selectedTeam: Team | undefined = el.teams.find(
            (team: Team) => team.id === action.payload.id
          );

          if (selectedTeam) {
            type = !action.payload.hide
              ? (type = state.selectType + "team")
              : state.selectType === "teamteam"
              ? (type = "team")
              : (type = "");
            return {
              ...el,
              teams: el.teams.map((team: Team) =>
                team.id === selectedTeam.id
                  ? { ...team, selected: !action.payload.hide }
                  : team
              ),
            };
          } else {
            let selectedPlayer: Player | undefined;
            const teams = el.teams.map((team: Team) => {
              if (selectedPlayer) return team;
              selectedPlayer = team.players.find(
                (player: Player) => player.id === action.payload.id
              );
              if (selectedPlayer) {
                type = !action.payload.hide
                  ? (type = state.selectType + "player")
                  : state.selectType === "playerplayer"
                  ? (type = "player")
                  : (type = "");
                return {
                  ...team,
                  players: team.players.map((player: Player) =>
                    player.id === selectedPlayer!.id
                      ? { ...player, selected: !action.payload.hide }
                      : player
                  ),
                };
              }
              return team;
            });
            if (selectedPlayer) {
              return {
                ...el,
                teams,
              };
            }
          }
          return el;
        }),
        selectType: type!,
      };
    default:
      return state;
  }
};

export default reducer;
