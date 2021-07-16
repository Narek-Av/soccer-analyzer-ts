import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleElement } from "../../store/actions";
import { SelectedElement } from "../../store/types";

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
      compareStatistics(rightElement, droppedElement);
    } else {
      setRightElement({ ...droppedElement, position: "right" });
      compareStatistics(leftElement, droppedElement);
    }

    dispatch(toggleElement(droppedElement.id, false));
  };

  const compareStatistics = (left: SelectedElement, right: SelectedElement) => {
    let leftStats: any = {},
      rightStats: any = {};
    Object.entries(left.stats).map(([lName, lValue]) =>
      Object.entries(right.stats).map(([rName, rValue]) => {
        if (lName === rName) {
          let lInfo: any = lValue;
          let rInfo: any = rValue;
          if (typeof lValue === "number") {
            lInfo = { value: lValue, stat: "" };
          }

          if (typeof rValue === "number") {
            rInfo = { value: rValue, stat: "" };
          }
          if (rInfo.value > lInfo.value) {
            rInfo.stat = "big";
            lInfo.stat = "small";
          } else if (rInfo.value < lInfo.value) {
            rInfo.stat = "small";
            lInfo.stat = "big";
          } else {
            rInfo.stat = "equal";
            lInfo.stat = "equal";
          }

          leftStats[lName] = lInfo;
          rightStats[rName] = rInfo;
        }
        return null;
      })
    );

    setLeftElement((lEl: any) => ({ ...lEl, stats: leftStats }));
    setRightElement((rEl: any) => ({ ...rEl, stats: rightStats }));
  };

  const renderStats = (stats: object) => {
    return Object.entries(stats).map(([name, info]: [string, any]) => (
      <div
        key={name}
        data-stat={info.stat ? info.stat : ""}
        className="card-statistic"
      >
        {name} : <span>{info.value ? info.value : info}</span>
      </div>
    ));
  };

  const dropElementHandle = (el: SelectedElement) => {
    if (el.position === "left") {
      setLeftElement(null);
    } else {
      setRightElement(null);
    }
    dispatch(toggleElement(el.id, true));
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
          {renderStats(element.stats)}
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
