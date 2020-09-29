import { ChickenClass } from "./ChickenClass";
import { EscapingItemInterface } from "./types";

export enum EscapingFactoryItems {
  CHICKEN
}

export class EscapingFactory {
  get( item: EscapingFactoryItems ): EscapingItemInterface {
    switch ( item ) {

      case EscapingFactoryItems.CHICKEN:
        return new ChickenClass();

    }
  }
}