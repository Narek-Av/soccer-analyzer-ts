import dummyLeagues from "../dummyLeagues.json";
import { SELECT_ELEMENT, DROP_ELEMENT } from "./types";

const inistalState = {
  leagues: dummyLeagues,
  selectedElements: [],
  selectType: "",
};

const reducer = (state = inistalState, { type, payload }) => {
  switch (type) {
    case SELECT_ELEMENT:
      let type;

      return {
        ...state,
        selectedElements: [...state.selectedElements, payload],
        leagues: state.leagues.map((el) => {
          const selectedTeam = el.teams.find(({ id }) => id === payload.id);

          if (selectedTeam) {
            type = "team";
            return {
              ...el,
              teams: el.teams.map((team) =>
                team.id === selectedTeam.id ? { ...team, selected: true } : team
              ),
            };
          } else {
            let selectedPlayer;
            const teams = el.teams.map((team) => {
              if (selectedPlayer) return team;
              selectedPlayer = team.players.find(({ id }) => id === payload.id);
              if (selectedPlayer) {
                type = "player";
                return {
                  ...team,
                  players: team.players.map((player) => {
                    if (player.id === selectedPlayer.id) {
                      return { ...player, selected: true };
                    } else {
                      return player;
                    }
                  }),
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
    case DROP_ELEMENT:
      return {
        ...state,
        selectedElements: state.selectedElements.filter(
          (el) => el.id !== payload
        ),
      };
    default:
      return state;
  }
};

export default reducer;
