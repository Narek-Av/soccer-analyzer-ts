export enum ActionTyp {
  TOOGLE_ELEMENT = "Toogle_element",
}

export type Player = {
  id: string;
  name: string;
  stats: any;
  selected?: boolean;
  position?: string;
};

export type Team = {
  id: string;
  name: string;
  players: Player[];
  stats?: any;
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
