import { Vector2Int } from "./Basic.js";
import * as mapBlock from "./MapBlock.js";
import * as warMap from "./WarMap.js";

export function buildAreaBlock(
    mapOwner:warMap.WarMap, startPosition:Vector2Int, endPostion:Vector2Int)
{
    for(var x=startPosition.getX(); x<=endPostion.getX(); x++){
        for(var y=startPosition.getY(); y<=endPostion.getY(); y++){
            new mapBlock.MapBlock( mapOwner, new Vector2Int(x, y) );
        }
    }
}