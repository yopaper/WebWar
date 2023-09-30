import * as canvas from "./CanvasHandler.js";
import * as warMap from "./WarMap.js";
import * as mapBlock from "./MapBlock.js";
import * as buildingUnit from "./BuildingUnit.js";
import * as basic from "./Basic.js";
import * as mapBuilder from "./MapBuilder.js"
import { UnitTeam } from "./UnitTeam.js";

canvas.buildCanvas( document.body, 1200, 1000 );
var mainMap = new warMap.WarMap();

const midLen = 3, secLen = 3;
mapBuilder.buildAreaBlock(mainMap, new basic.Vector2Int(-midLen, 3), new basic.Vector2Int(midLen, 3));
mapBuilder.buildAreaBlock(mainMap, new basic.Vector2Int(-midLen, 0), new basic.Vector2Int(midLen, 0));
mapBuilder.buildAreaBlock(mainMap, new basic.Vector2Int(-midLen, -3), new basic.Vector2Int(midLen, -3));
mapBuilder.buildAreaBlock(mainMap, new basic.Vector2Int(-midLen-1, -4), new basic.Vector2Int(-midLen-1, 4));
mapBuilder.buildAreaBlock(mainMap, new basic.Vector2Int(midLen+1, -4), new basic.Vector2Int(midLen+1, 4));
mapBuilder.buildAreaBlock(mainMap, new basic.Vector2Int(-midLen-2-secLen, -2), new basic.Vector2Int(-midLen-2, -2));
mapBuilder.buildAreaBlock(mainMap, new basic.Vector2Int(-midLen-2-secLen, 2), new basic.Vector2Int(-midLen-2, 2));
mapBuilder.buildAreaBlock(mainMap, new basic.Vector2Int(midLen+2, -2), new basic.Vector2Int(midLen+secLen+2, -2));
mapBuilder.buildAreaBlock(mainMap, new basic.Vector2Int(midLen+2, 2), new basic.Vector2Int(midLen+secLen+2, 2));
mapBuilder.buildAreaBlock(mainMap, new basic.Vector2Int(midLen+secLen+3, -2), new basic.Vector2Int(midLen+secLen+3, 2));
mapBuilder.buildAreaBlock(mainMap, new basic.Vector2Int(-midLen-secLen-3, -2), new basic.Vector2Int(-midLen-secLen-3, 2));

new buildingUnit.SmallBarracks( mainMap, UnitTeam.Red, new basic.Vector2Int(midLen+secLen+3, 2) );
new buildingUnit.SmallBarracks( mainMap, UnitTeam.Red, new basic.Vector2Int(midLen+secLen+3, -2) );
new buildingUnit.LargeBarracks( mainMap, UnitTeam.Red, new basic.Vector2Int(midLen+secLen+3, 0) );
new buildingUnit.Tower( mainMap, UnitTeam.Red, new basic.Vector2Int(midLen+1, 2) );
new buildingUnit.Tower( mainMap, UnitTeam.Red, new basic.Vector2Int(midLen+1, -2) );

new buildingUnit.SmallBarracks( mainMap, UnitTeam.Blue, new basic.Vector2Int(-midLen-secLen-3, 2) );
new buildingUnit.SmallBarracks( mainMap, UnitTeam.Blue, new basic.Vector2Int(-midLen-secLen-3, -2) );
new buildingUnit.LargeBarracks( mainMap, UnitTeam.Blue, new basic.Vector2Int(-midLen-secLen-3, 0) );
new buildingUnit.Tower( mainMap, UnitTeam.Blue, new basic.Vector2Int(-midLen-1, 2) );
new buildingUnit.Tower( mainMap, UnitTeam.Blue, new basic.Vector2Int(-midLen-1, -2) );

function update(){
    canvas.clearCanvas();
    mainMap.update();
    var pointedBlock = mainMap.getBlockWithIndex( canvas.mouseIndex );
    pointedBlock?.getPath().distanceDebugDraw();
    setTimeout( update, 33 );
}//---------------------------------------------------------

update();
