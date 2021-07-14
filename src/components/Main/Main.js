import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectElement, dropElement } from "../../store/actions";

import "./Main.css";

export default function Main() {
  const selectedElements = useSelector((state) => state.selectedElements);
  console.log(`selectedElements`, selectedElements);
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
    dispatch(selectElement(droppedElement));
  };

  const renderStats = (stats) => {
    return Object.entries(stats).map(([name, value]) => (
      <div key={name}>
        {name} : {value}
      </div>
    ));
  };

  return (
    <div
      className="main-container"
      onDragOver={handleDragOver}
      onDragLeave={clearOver}
      onDrop={clearOver}
    >
      {selectedElements.length > 0 &&
        selectedElements.map((el) => (
          <div className="element-card" key={el.id}>
            <div
              className="element-card-close"
              onClick={() => dispatch(dropElement(el.id))}
            >
              &#x2715;
            </div>
            <div className="card-info">
              <h2 className="card-name">{el.name}</h2>
              {renderStats(el.stats)}
            </div>
          </div>
        ))}
      {selectedElements.length < 2 && (
        <div className="drop-area" onDrop={handleDrop} />
      )}
    </div>
  );
}
