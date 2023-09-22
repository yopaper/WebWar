export class MapBlock {
    constructor(mapOwner, position) {
        this.mapOwner = mapOwner;
        this.position = position;
        mapOwner.addBlock(this);
    }
}
