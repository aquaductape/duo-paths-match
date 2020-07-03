const btnAdd = document.querySelector(".btn-add");
const btnSub = document.querySelector(".btn-sub");
const duoLinesGetPointAtLength = document.querySelector(
  ".duo-lines__getPointAtLength"
);
const twinLinesNothing = document.querySelector(".twin-lines__nothing");
const twinLinesPathLength = document.querySelector(".twin-lines__pathLength");
const duoLinesPathLength = document.querySelector(".duo-lines__pathLength");

const svg = {};
const pathLength = 73;
let progress = 0;
let rotate = 0;
let jaggedPosition = 0;

const camelize = (text) => {
  text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
  return text.substr(0, 1).toLowerCase() + text.substr(1);
};

const initSVGSetStrokes = (root, svgPaths, pathLength) => {
  const rootName = camelize(root.getAttribute("class"));
  svg[rootName] = {};
  svgPaths.forEach((name) => {
    const path = root.querySelector(`.${name}`);
    const pathTotalLength = pathLength ? pathLength : path.getTotalLength();
    debugger;
    svg[rootName][camelize(name)] = path;
    svg[rootName][camelize(name) + "Length"] = pathTotalLength;

    path.setAttribute("stroke-dasharray", pathTotalLength);
    path.setAttribute("stroke-dashoffset", pathTotalLength);
  });
};

initSVGSetStrokes(twinLinesNothing, ["line", "jagged-line"]);
initSVGSetStrokes(duoLinesGetPointAtLength, ["line", "jagged-line"]);
initSVGSetStrokes(twinLinesPathLength, ["line", "jagged-line"], pathLength);
initSVGSetStrokes(duoLinesPathLength, ["line", "jagged-line"], pathLength);

console.log(svg);

const updateDuoLinesGetPointAtLength = (isAdding) => {
  const {
    line,
    jaggedLine,
    lineLength,
    jaggedLineLength,
  } = svg.duoLinesGetPointAtLength;

  line.setAttribute("stroke-dashoffset", lineLength - progress);
  if (isAdding) {
    while (
      jaggedPosition < jaggedLineLength &&
      jaggedLine.getPointAtLength(jaggedPosition).x < progress
    ) {
      jaggedPosition++;
    }
  } else {
    while (
      jaggedPosition >= 0 &&
      jaggedLine.getPointAtLength(jaggedPosition).x > progress
    ) {
      jaggedPosition--;
    }
  }

  jaggedLine.setAttribute(
    "stroke-dashoffset",
    jaggedLineLength - jaggedPosition
  );
};
const updateDuoLines = (name) => {
  const { line, jaggedLine, lineLength, jaggedLineLength } = svg[
    camelize(name)
  ];

  line.setAttribute("stroke-dashoffset", lineLength - progress);
  jaggedLine.setAttribute("stroke-dashoffset", jaggedLineLength - progress);
};

btnAdd.addEventListener("click", () => {
  const isAdding = true;
  progress++;
  updateDuoLinesGetPointAtLength(isAdding);
  updateDuoLines(".twin-lines__nothing");
  updateDuoLines(".twin-lines__pathLength");
  updateDuoLines(".duo-lines__pathLength");
});
btnSub.addEventListener("click", () => {
  const isAdding = false;
  progress--;
  updateDuoLinesGetPointAtLength(isAdding);
  updateDuoLines(".twin-lines__nothing");
  updateDuoLines(".twin-lines__pathLength");
  updateDuoLines(".duo-lines__pathLength");
});
