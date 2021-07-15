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

    if (!leftElement) {
      setLeftElement({ ...droppedElement, position: "left" });
    } else if (leftElement && rightElement) {
      dispatch(toggleElement(rightElement.id, true));
      setRightElement({ ...droppedElement, position: "right" });
      compareStatistics(droppedElement);
    } else {
      setRightElement({ ...droppedElement, position: "right" });
      compareStatistics(droppedElement);
    }

    dispatch(toggleElement(droppedElement.id));
  };

  const compareStatistics = (droppedElement) => {
    let leftStats = {},
      rightStats = {};
    Object.entries(leftElement.stats).map(([lName, lInfo]) =>
      Object.entries(droppedElement.stats).map(([rName, rInfo]) => {
        if (lName === rName && lInfo.value > rInfo.value) {
          leftStats[lName] = { value: lInfo.value, stat: "big" };
          rightStats[rName] = { value: rInfo.value, stat: "small" };
        } else if (lName === rName && lInfo.value < rInfo.value) {
          leftStats[lName] = { value: lInfo.value, stat: "small" };
          rightStats[rName] = { value: rInfo.value, stat: "big" };
        } else if (lName === rName) {
          leftStats[lName] = { value: lInfo.value, stat: "equal" };
          rightStats[rName] = { value: rInfo.value, stat: "equal" };
        }
        return null;
      })
    );

    setLeftElement((lEl) => ({ ...lEl, stats: leftStats }));
    setRightElement((rEl) => ({ ...rEl, stats: rightStats }));
  };

  const renderStats = (stats) => {
    return Object.entries(stats).map(([name, info]) => (
      <div key={name} data-stat={info.stat} className="card-statistic">
        {name} : <span>{info.value}</span>
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
