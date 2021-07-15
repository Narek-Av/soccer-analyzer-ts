import dummyLeagues from "../dummyLeagues.json";
import { TOOGLE_ELEMENT } from "./types";

const inistalState = {
  leagues: dummyLeagues,
  selectType: "",
};

const reducer = (state = inistalState, { type, payload }) => {
  switch (type) {
    case TOOGLE_ELEMENT:
      let type;

      return {
        ...state,
        leagues: state.leagues.map((el) => {
          const selectedTeam = el.teams.find(({ id }) => id === payload.id);

          if (selectedTeam) {
            type = !payload.hide
              ? (type = state.selectType + "team")
              : state.selectType === "teamteam"
              ? (type = "team")
              : (type = "");
            return {
              ...el,
              teams: el.teams.map((team) =>
                team.id === selectedTeam.id
                  ? { ...team, selected: !payload.hide }
                  : team
              ),
            };
          } else {
            let selectedPlayer;
            const teams = el.teams.map((team) => {
              if (selectedPlayer) return team;
              selectedPlayer = team.players.find(({ id }) => id === payload.id);
              if (selectedPlayer) {
                type = !payload.hide
                  ? (type = state.selectType + "player")
                  : state.selectType === "playerplayer"
                  ? (type = "player")
                  : (type = "");
                return {
                  ...team,
                  players: team.players.map((player) =>
                    player.id === selectedPlayer.id
                      ? { ...player, selected: !payload.hide }
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
        selectType: type,
      };
    default:
      return state;
  }
};

export default reducer;
