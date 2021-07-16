export type Player = {
  id: string;
  name: string;
  stats: object;
  selected?: boolean;
  position?: string;
};

export type Team = {
  id: string;
  name: string;
  players: Player[];
  stats?: object;
  selected?: boolean;
  type: string;
  position?: string;
};

export type League = {
  id: string;
  name: string;
  teams: Team[];
};

export type SelectedElement = Team | Player;
