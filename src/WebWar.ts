import * as canvas from "./CanvasHandler.js";
import * as warMap from "./WarMap.js";
import * as mapBlock from "./MapBlock.js";
import * as buildingUnit from "./BuildingUnit.js";
import * as basic from "./Basic.js"
import { Vector2 } from "./Basic.js";
import { UnitTeam } from "./UnitTeam.js";

canvas.buildCanvas( document.body, 1000, 1000 );
var mainMap = new warMap.WarMap();

for(var x=1; x<=20; x++){
    for(var y=1; y<=20; y++){
        new mapBlock.MapBlock(mainMap, new Vector2(x, y));
    }
}

new buildingUnit.SmallBarracks( mainMap, UnitTeam.Red, new basic.Vector2(2, 2) );
new buildingUnit.SmallBarracks( mainMap, UnitTeam.Red, new basic.Vector2(2, 19) );
new buildingUnit.SmallBarracks( mainMap, UnitTeam.Blue, new basic.Vector2(19, 19) );
new buildingUnit.SmallBarracks( mainMap, UnitTeam.Blue, new basic.Vector2(19, 2) );

function update(){
    canvas.clearCanvas();
    mainMap.update();
    var pointedBlock = mainMap.getBlockWithPosition( canvas.mouseIndex );
    pointedBlock?.getPath().distanceDebugDraw();
    setTimeout( update, 33 );
}//---------------------------------------------------------

update();
