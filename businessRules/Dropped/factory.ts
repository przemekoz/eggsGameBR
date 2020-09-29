import { EggClass } from "./EggClass";
import { DroppedItemInterface } from "./types";

export enum DroppedFactoryItems {
  EGG
}

export class DroppedFactory {
  get( item: DroppedFactoryItems ): DroppedItemInterface {
    switch ( item ) {

      case DroppedFactoryItems.EGG:
        return new EggClass();

    }
  }
}