import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleElement } from "../../store/actions";

import "./Main.css";

export default function Main() {
  const [leftElement, setLeftElement] = useState();
  const [rightElement, setRightElement] = useState();

  const dispatch = useDispatch();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.target.classList.add("over");
    return false;
  };

  const clearOver = (e) => {
    e.target.classList.remove("over");
  };

  const handleDrop = (e) => {
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
      dispatch(toggleElement(leftElement.id, true));
      setLeftElement({ ...rightElement, position: "left" });
      setRightElement({ ...droppedElement, position: "right" });
      compareStatistics(rightElement, droppedElement);
    } else {
      setRightElement({ ...droppedElement, position: "right" });
      compareStatistics(leftElement, droppedElement);
    }

    dispatch(toggleElement(droppedElement.id));
  };

  const compareStatistics = (left, right) => {
    let leftStats = {},
      rightStats = {};
    Object.entries(left.stats).map(([lName, lValue]) =>
      Object.entries(right.stats).map(([rName, rValue]) => {
        if (lName === rName) {
          let lInfo = lValue;
          let rInfo = rValue;
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

    setLeftElement((lEl) => ({ ...lEl, stats: leftStats }));
    setRightElement((rEl) => ({ ...rEl, stats: rightStats }));
  };

  const renderStats = (stats) => {
    return Object.entries(stats).map(([name, info]) => (
      <div
        key={name}
        data-stat={info.stat ? info.stat : ""}
        className="card-statistic"
      >
        {name} : <span>{info.value ? info.value : info}</span>
      </div>
    ));
  };

  const dropElementHandle = (el) => {
    if (el.position === "left") {
      setLeftElement();
    } else {
      setRightElement();
    }
    dispatch(toggleElement(el.id, true));
  };

  const calculateAverage = (players) => {
    const goalsCount = players.reduce((counter, player) => {
      return counter + player.stats.Goals;
    }, 0);
    const average = goalsCount / players.length;
    return +average.toFixed(2);
  };

  const renderCard = (element) => {
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
}
