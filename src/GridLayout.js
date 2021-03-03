import React from "react";
import GridLayout from "react-grid-layout";
import './App.css';
const layout = [
  { i: "a", x: 0, y: 0, w: 4, h: 2 },
  { i: "b", x: 4, y: 0, w: 4, h: 2 },
  { i: "c", x: 8, y: 0, w: 4, h: 2 },
  { i: "d", x: 0, y: 2, w: 4, h: 2 },
  { i: "e", x: 4, y: 2, w: 4, h: 2 },
  { i: "f", x: 8, y: 2, w: 4, h: 2 }
];
export default function App() {
  return (
    <>
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
      >
        <div key="a" className="red">foo</div>
        <div key="b" className="yellow">bar</div>
        <div key="c" className="blue">baz</div>
        <div key="d"></div>
        <div key="e"></div>
        <div key="f"></div>
      </GridLayout>
    </>
  );
}