export { createShape, updateShape };
function createShape(type, mouseX, mouseY, size, color, id) {
  switch (type) {
    case "square":
      return createSquare(mouseX, mouseY, size, color, id);
    case "rectangle":
      return createRect(mouseX, mouseY, size, color, id);
    case "circle":
      return createCircle(mouseX, mouseY, size, color, id);
    case "triangle":
      return createPolygon(3, mouseX, mouseY, size, color, id);
    case "star":
      return createStar(mouseX, mouseY, size, color, id);
    case "hexagon":
      return createPolygon(6, mouseX, mouseY, size, color, id);
    case "pentagon":
      return createPolygon(5, mouseX, mouseY, size, color, id);
    case "ellipse":
      return createEllipse(mouseX, mouseY, size, color, id);
    default:
      return createLine(mouseX, mouseY, size, type);
  }
}

function updateShape(type, drawingShape, mouseX, mouseY) {
  switch (type) {
    case "square":
      updateSquare(drawingShape, mouseX, mouseY);
      break;
    case "rectangle":
      updateRect(drawingShape, mouseX, mouseY);
      break;
    case "star":
      updateStar(drawingShape, mouseX, mouseY);
      break;
    case "ellipse":
      updateEllipse(drawingShape, mouseX, mouseY);
      break;
    case "line":
      updateLine(drawingShape, mouseX, mouseY);
      break;
    case "pencil":
    case "eraser":
      updateBrush(drawingShape, mouseX, mouseY);
      break;
    default:
      updatePolygan(drawingShape, mouseX, mouseY);
      break;
  }
}
function createLine(mouseX, mouseY, size, type) {
  let color = type === "eraser" ? "white" : "black";
  return new Konva.Line({
    points: [mouseX, mouseY],
    lineCap: "round",
    lineJoin: "round",
    stroke: color,
    strokeWidth: parseInt(size),
  });
}

function createCircle(mouseX, mouseY, size, color, id) {
  return new Konva.Circle({
    id: `${id}`,
    x: mouseX,
    y: mouseY,
    radius: 0,
    fill: color,
    stroke: "black",
    strokeWidth: parseInt(size),
  });
}

function createSquare(mouseX, mouseY, size, color, id) {
  return new Konva.Rect({
    id: `${id}`,
    x: mouseX,
    y: mouseY,
    width: 0,
    height: 0,
    fill: color,
    stroke: "black",
    strokeWidth: parseInt(size),
  });
}

function createRect(mouseX, mouseY, size, color, id) {
  return new Konva.Rect({
    id: `${id}`,
    x: mouseX,
    y: mouseY,
    width: 0,
    height: 0,
    fill: color,
    stroke: "black",
    strokeWidth: parseInt(size),
  });
}

function createEllipse(mouseX, mouseY, size, color, id) {
  return new Konva.Ellipse({
    id: `${id}`,
    x: mouseX,
    y: mouseY,
    radiusX: 0,
    radiusY: 0,
    fill: color,
    stroke: "black",
    strokeWidth: parseInt(size),
  });
}

function createPolygon(sides, mouseX, mouseY, size, color, id) {
  return new Konva.RegularPolygon({
    id: `${id}`,
    x: mouseX,
    y: mouseY,
    sides: sides,
    radius: 0,
    fill: color,
    stroke: "black",
    strokeWidth: parseInt(size),
  });
}

function createStar(mouseX, mouseY, size, color, id) {
  return new Konva.Star({
    id: `${id}`,
    x: mouseX,
    y: mouseY,
    numPoints: 5,
    innerRadius: 0,
    outerRadius: 0,
    fill: color,
    stroke: "black",
    strokeWidth: parseInt(size),
  });
}

function updateLine(drawingShape, mouseX, mouseY) {
  let x = drawingShape.points()[0];
  let y = drawingShape.points()[1];
  let points = [x, y, mouseX, mouseY];
  drawingShape.points(points);
}

function updateSquare(drawingShape, mouseX, mouseY) {
  let width = mouseX - drawingShape.x();
  let height = mouseY - drawingShape.y();
  let side = (width + height) / 2;
  drawingShape.width(side);
  drawingShape.height(side);
}

function updateRect(drawingShape, mouseX, mouseY) {
  let width = mouseX - drawingShape.x();
  let height = mouseY - drawingShape.y();
  drawingShape.width(width);
  drawingShape.height(height);
}

function updatePolygan(drawingShape, mouseX, mouseY) {
  let x = mouseX - drawingShape.x();
  let y = mouseY - drawingShape.y();
  let radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  drawingShape.radius(radius);
}

function updateEllipse(drawingShape, mouseX, mouseY) {
  let x = mouseX - drawingShape.x();
  let y = mouseY - drawingShape.y();
  drawingShape.radiusX(Math.abs(x));
  drawingShape.radiusY(Math.abs(y));
}

function updateStar(drawingShape, mouseX, mouseY) {
  let x = mouseX - drawingShape.x();
  let y = mouseY - drawingShape.y();
  let innerRadius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  drawingShape.innerRadius(innerRadius);
  drawingShape.outerRadius(innerRadius * 2.5);
}

function updateBrush(drawingShape, mouseX, mouseY) {
  let points = drawingShape.points().concat([mouseX, mouseY]);
  drawingShape.points(points);
}
