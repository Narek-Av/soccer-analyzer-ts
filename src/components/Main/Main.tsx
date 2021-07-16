import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleElement } from "../../store/actions";
import { SelectedElement } from "../../interfaces/types";

import "./Main.css";

const Main: React.FC = () => {
  const [leftElement, setLeftElement] = useState<SelectedElement | null>();
  const [rightElement, setRightElement] = useState<SelectedElement | null>();

  const dispatch = useDispatch();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    target.classList.add("over");
    return false;
  };

  const clearOver = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    target.classList.remove("over");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    clearOver(e);

    const droppedElement = JSON.parse(e.dataTransfer.getData("type/element"));

    if (droppedElement.type === "team") {
      droppedElement.stats = {
        [`Goals Average`]: calculateAverage(droppedElement.players),
      };
    }

    if (!leftElement) {
      setLeftElement({ ...droppedElement, position: "left" });
    } else if (leftElement && rightElement) {
      dispatch(toggleElement(leftElement?.id, true));
      setLeftElement({ ...rightElement, position: "left" });
      setRightElement({ ...droppedElement, position: "right" });
    } else {
      setRightElement({ ...droppedElement, position: "right" });
    }

    dispatch(toggleElement(droppedElement.id, false));
  };

  const compareStatistics = (val1: number, val2: number) => {
    if (val1 > val2) {
      return "big";
    } else if (val1 < val2) {
      return "small";
    } else {
      return "equal";
    }
  };

  const renderStats = (element: SelectedElement) => {
    return (
      element.stats &&
      Object.entries(element.stats).map(([name, value]: [string, number]) => {
        let stat;
        let selectedStat;

        if (element.position === "left") {
          selectedStat = rightElement?.stats;
        } else {
          selectedStat = leftElement?.stats;
        }
        if (typeof selectedStat === "object") {
          for (const [v, k] of Object.entries(selectedStat)) {
            if (v === name) {
              stat = compareStatistics(value, k);
            }
          }
        }
        return (
          <div key={name} data-stat={stat} className="card-statistic">
            {name} : <span>{value}</span>
          </div>
        );
      })
    );
  };

  const dropElementHandle = (element: SelectedElement) => {
    if (element.position === "left") {
      setLeftElement(null);
    } else {
      setRightElement(null);
    }
    dispatch(toggleElement(element.id, true));
  };

  const calculateAverage = (players: []) => {
    const goalsCount = players.reduce(
      (counter: number, player: { stats: { Goals: number } }) => {
        return counter + player.stats.Goals;
      },
      0
    );
    const average = goalsCount / players.length;
    return +average.toFixed(2);
  };

  const renderCard = (element: SelectedElement) => {
    return (
      <div
        className="element-card"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div
          className="element-card-close"
          onClick={() => dropElementHandle(element)}
        >
          &#x2715;
        </div>
        <div className="card-info">
          <h2 className="card-name">{element.name}</h2>
          {renderStats(element)}
        </div>
      </div>
    );
  };

  return (
    <div
      className="main-container"
      onDragOver={handleDragOver}
      onDragLeave={clearOver}
      onDrop={clearOver}
    >
      {leftElement && renderCard(leftElement)}
      {!rightElement ? (
        <div className="drop-area" onDrop={handleDrop} />
      ) : (
        renderCard(rightElement)
      )}
    </div>
  );
};

export default Main;
