import { Creature } from "./creature.ts";
import { World} from "../../mod.ts";

export type IWorld = {
  width: number;
  height: number;
  creatures: Creature[] | [];
  context: World;
};