import { Vector3, system, world } from "@minecraft/server";

const TAG = "CROP";
const R = 5;
const R2 = 2;
const FARMLAND_TAG = "FARMLAND";
const FARMLAND_WET = "dongha_n:farmland_wet";
const WATERINGCAN = "dongha_n:wateringcan";

world.afterEvents.worldInitialize.subscribe((param) => {
  world.sendMessage(`${Date().toString()} farming init`);
});

world.beforeEvents.playerInteractWithEntity.subscribe((param) => {});

function generateLocationForWatering(pos: Vector3): Vector3[] {
  const res: Vector3[] = [];
  for (let i = 0; i < R; i++) {
    for (let j = 0; j < R; j++) {
      res.push({
        x: pos.x + i - R2,
        y: pos.y,
        z: pos.z + j - R2,
      });
    }
  }
  return res;
}

world.afterEvents.playerInteractWithBlock.subscribe((param) => {
  if (param.block.hasTag(TAG) && param.itemStack?.typeId === WATERINGCAN) {
    const dimension = param.block.dimension;
    const belowLocation = param.block.below()!.location;
    generateLocationForWatering(belowLocation).map((pos) => {
      if (dimension.getBlock(pos)?.hasTag(FARMLAND_TAG)) {
        dimension.fillBlocks(pos, pos, FARMLAND_WET);
      }
    });
  }
});
