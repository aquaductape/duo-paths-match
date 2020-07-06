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
    // Safari and Edge Legacy sometimes has issue hidding stroke even when dasharray and dashoffset are both equal to the getTotalLength
    // rounding up fixes Safari
    // but on Edge Legacy 1px of stroke length is at the left side https://imgur.com/qmT3snG
    const pathTotalLength = pathLength
      ? pathLength
      : Math.ceil(path.getTotalLength());
    const camelizedName = camelize(name);

    svg[rootName][camelizedName] = {
      path: path,
      length: pathTotalLength,
      strokeWidth: parseFloat(
        path.getAttribute("stroke-width").replace("px", "")
      ),
      changedWidth: false,
    };

    path.setAttribute("stroke-dasharray", pathTotalLength);
    path.setAttribute("stroke-dashoffset", pathTotalLength);

    // solves Edge Legacy leftover 1px stroke length
    // conveniently works if the animation progresses from left to right
    path.setAttribute("stroke-width", 0);
  });
};

initSVGSetStrokes(twinLinesNothing, ["line", "jagged-line"]);
initSVGSetStrokes(duoLinesGetPointAtLength, ["line", "jagged-line"]);
initSVGSetStrokes(twinLinesPathLength, ["line", "jagged-line"], pathLength);
initSVGSetStrokes(duoLinesPathLength, ["line", "jagged-line"], pathLength);

console.log(svg);

const updateDuoLinesGetPointAtLength = (isAdding) => {
  let { line, jaggedLine } = svg.duoLinesGetPointAtLength;
  const lineLength = line.length;
  const jaggedLineLength = jaggedLine.length;
  const strokeWidth = line.strokeWidth;
  const changedWidth = line.changedWidth;

  line = line.path;
  jaggedLine = jaggedLine.path;

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

  if (!changedWidth) {
    jaggedLine.setAttribute("stroke-width", strokeWidth);
    line.setAttribute("stroke-width", strokeWidth);
  }
};
const updateDuoLines = (name) => {
  let { line, jaggedLine } = svg[camelize(name)];

  const lineLength = line.length;
  const jaggedLineLength = jaggedLine.length;
  const strokeWidth = line.strokeWidth;
  const changedWidth = line.changedWidth;

  line = line.path;
  jaggedLine = jaggedLine.path;

  line.setAttribute("stroke-dashoffset", lineLength - progress);
  jaggedLine.setAttribute("stroke-dashoffset", jaggedLineLength - progress);

  if (!changedWidth) {
    jaggedLine.setAttribute("stroke-width", strokeWidth);
    line.setAttribute("stroke-width", strokeWidth);
  }
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
