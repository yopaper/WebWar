import * as canvas from "./CanvasHandler.js";
import * as warMap from "./WarMap.js";
import * as mapBlock from "./MapBlock.js";
import { Position } from "./Basic.js";
canvas.buildCanvas(document.body, 500, 500);
canvas.clearCanvas();
var wm = new warMap.WarMap();
new mapBlock.MapBlock(wm, new Position(1, 1));
wm.drawAllBlock();
