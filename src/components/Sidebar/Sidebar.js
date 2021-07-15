import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ReactComponent as DownIcon } from "../../assets/icons/down-icon.svg";

import "./Sidebar.css";

export default function Sidebar() {
  const leagues = useSelector((state) => state.leagues);
  const selectType = useSelector((state) => state.selectType);
  const [activeItem, setActiveItem] = useState([]);

  const handleDragStart = (e, data) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("type/element", JSON.stringify(data));

    setTimeout(() => {
      e.target.classList.add("hide");
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("hide");
  };

  return (
    <div className="sidebar-container">
      <ul className="leagues">
        {leagues.map(({ name, teams, id }) => (
          <li key={id} className="leagues-item">
            <div
              onClick={() =>
                setActiveItem((active) =>
                  active.includes(id)
                    ? active.filter((act) => act !== id)
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
                {teams.map(({ id, name, players, stats, selected, type }) => (
                  <li className="teams-item" key={id}>
                    <div
                      onClick={() =>
                        setActiveItem((active) =>
                          active.includes(id)
                            ? active.filter((act) => act !== id)
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
                          handleDragStart(e, { id, name, players, stats, type })
                        }
                        className={`${selected ? "selected" : ""}${
                          selectType.includes("player") ? " disabled" : ""
                        }`}
                        onDragEnd={handleDragEnd}
                        draggable={!selected && selectType !== "player"}
                      >
                        {name}
                      </span>
                    </div>
                    {!activeItem.includes(id) && (
                      <ul className="players">
                        {players.map(({ name, id, stats, selected }) => (
                          <li
                            key={id}
                            className={`players-item${
                              selected ? " selected" : ""
                            }${selectType.includes("team") ? " disabled" : ""}`}
                            draggable={!selected && selectType !== "team"}
                            onDragStart={(e) =>
                              handleDragStart(e, { id, name, stats })
                            }
                            onDragEnd={handleDragEnd}
                          >
                            {name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
