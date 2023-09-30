import { Vector2Int } from "./Basic.js";
import * as mapBlock from "./MapBlock.js";
export function buildAreaBlock(mapOwner, startPosition, endPostion) {
    for (var x = startPosition.getX(); x <= endPostion.getX(); x++) {
        for (var y = startPosition.getY(); y <= endPostion.getY(); y++) {
            new mapBlock.MapBlock(mapOwner, new Vector2Int(x, y));
        }
    }
}
