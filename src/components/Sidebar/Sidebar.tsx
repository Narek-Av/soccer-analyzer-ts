import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ReactComponent as DownIcon } from "../../assets/icons/down-icon.svg";
import { SoccerState } from "../../store/reducer";
import { League, Player, Team } from "../../interfaces/types";

import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const leagues = useSelector((state: SoccerState) => state.leagues);
  const selectType = useSelector((state: SoccerState) => state.selectType);
  const [activeItem, setActiveItem] = useState<string[]>([]);

  const handleDragStart = (
    event: React.DragEvent<HTMLSpanElement | HTMLLIElement>,
    data: {}
  ) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("type/element", JSON.stringify(data));

    setTimeout(() => {
      const target = event.target as HTMLElement;
      target.classList.add("hide");
      console.log('hello');
    }, 0);
  };

  const handleDragEnd = (event: React.DragEvent<HTMLLIElement>) => {
    const target = event.target as HTMLElement;
    target.classList.remove("hide");
  };

  return (
    <div className="sidebar-container">
      <h1>This is user name</h1>
      <h1>This is a user Age</h1>
      <ul className="leagues">
        {leagues.map(({ name, teams, id }: League) => (
          <li key={id} className="leagues-item">
            <div
              onClick={() =>
                setActiveItem((active: string[]) =>
                  active.includes(id)
                    ? active.filter((act: string) => act !== id)
                    : [...active, id]
                )
              }
              className={`item-header${
                activeItem.includes(id) ? " item-header-active" : ""
              }`}
            >
              <DownIcon className="item-header-icon" />
              {name}
            </div>
            {!activeItem.includes(id) && (
              <ul className="teams">
                {teams.map(
                  ({ id, name, players, stats, selected, type }: Team) => (
                    <li className="teams-item" key={id}>
                      <div
                        onClick={() =>
                          setActiveItem((active: string[]) =>
                            active.includes(id)
                              ? active.filter((act: string) => act !== id)
                              : [...active, id]
                          )
                        }
                        className={`item-header${
                          activeItem.includes(id) ? " item-header-active" : ""
                        }`}
                      >
                        <DownIcon className="item-header-icon" />
                        <span
                          onDragStart={(e) =>
                            handleDragStart(e, {
                              id,
                              name,
                              players,
                              stats,
                              type,
                            })
                          }
                          className={`${selected ? "selected" : ""}${
                            selectType.includes("player") ? " disabled" : ""
                          }`}
                          onDragEnd={handleDragEnd}
                          draggable={
                            !selected && !selectType.includes("player")
                          }
                        >
                          {name}
                        </span>
                      </div>
                      {!activeItem.includes(id) && (
                        <ul className="players">
                          {players.map(
                            ({ name, id, stats, selected }: Player) => (
                              <li
                                key={id}
                                className={`players-item${
                                  selected ? " selected" : ""
                                }${
                                  selectType.includes("team") ? " disabled" : ""
                                }`}
                                draggable={
                                  !selected && !selectType.includes("team")
                                }
                                onDragStart={(e) =>
                                  handleDragStart(e, { id, name, stats })
                                }
                                onDragEnd={handleDragEnd}
                              >
                                {name}
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </li>
                  )
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
