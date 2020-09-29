import { random } from "./utils";
import { BasketPosition, Side } from "./types";
import { Level } from "./levels";
import { EscapingItemInterface } from "./Escaping/types";
import { EscapingFactory, EscapingFactoryItems } from "./Escaping/factory";
import { DroppedFactory, DroppedFactoryItems } from "./Dropped/factory";
import { DroppedItemInterface } from "./Dropped/types";

export type GameState = ( number | DroppedItemInterface )[][];
export type ChickenState = ( number | EscapingItemInterface )[][];

export class GameClass {
  private level = 0;
  private maxBranchOffset = 0;
  private maxElementOffset = 0;
  private levels: Level[];
  private score = 0;
  private fails = 0;
  private isGameOver = false;
  private basketPosition: BasketPosition = BasketPosition.LEFT_BOTTOM;
  private state: GameState;
  private maxChickenPos = 4;
  private chickenState: ChickenState;

  constructor( levels: Level[], maxBranchOffset = 3, maxElementOffset = 4 ) {
    this.state = this.initState();
    this.chickenState = this.initChickenState();
    this.levels = levels;
    this.maxBranchOffset = maxBranchOffset;
    this.maxElementOffset = maxElementOffset;
  }

  setBasketPosition( pos: BasketPosition ) {
    this.basketPosition = pos;
  }

  dropItem() {
    let isBranchesFirstPosEmpty = true;
    for ( let j = 0; j <= this.maxBranchOffset; j++ ) {
      if ( this.state[ j ][ 0 ] !== 0 ) {
        isBranchesFirstPosEmpty = false;
        break;
      }
    }
    if ( isBranchesFirstPosEmpty === false ) {
      return;
    }
    const branchId: number = random( 0, 4 );
    const dropped = new DroppedFactory();
    const element = dropped.get( DroppedFactoryItems.EGG );
    this.state[ branchId ][ 0 ] = element;
  }

  moveItems() {
    const newState = this.initState();
    this.getBranchOffsetArray().forEach( item => {
      const { branchId, offset } = item;
      if ( this.state[ branchId ][ offset ] !== 0 ) {
        const element = this.state[ branchId ][ offset ];
        newState[ branchId ][ offset + 1 ] = element;
      }
    } );
    this.state = newState;
  }

  moveChicken() {
    const newChickenState = this.initChickenState();
    this.getChickenMoveArray().forEach( item => {
      const { side, offset } = item;
      if ( this.chickenState[ side ][ offset ] !== 0 && (offset + 1) < this.maxChickenPos ) {
        const chicken = this.chickenState[ side ][ offset ];
        newChickenState[ side ][ offset + 1 ] = chicken;
      }
    } );
    this.chickenState = newChickenState;
  }

  scan() {
    if ( this.fails === 3 ) {
      this.setGameOver();
      return;
    }
    if ( this.isNextLevel() ) {
      this.level += 1;
    }
    this.getBranchOffsetArray().forEach( item => {
      const { branchId, offset } = item;
      if ( offset === this.maxElementOffset && this.state[ branchId ][ offset ] !== 0 ) {
        if ( this.basketPosition === branchId ) {
          this.increaseScore();
        } else {
          this.fallElement( branchId );
        }
      }
    } );
  }

  getBasketPosition(): BasketPosition {
    return this.basketPosition;
  }

  getState(): GameState {
    return this.state;
  }

  getScore(): number {
    return this.score;
  }

  getFails(): number {
    return this.fails;
  }

  getIsGameEnd(): boolean {
    return this.score >= 100;
  }

  getDropInterval(): number {
    return this.levels[ this.level ].timeBetweenDropped;
  }

  getMoveInterval(): number {
    return this.levels[ this.level ].speed;
  }

  getLevel(): number {
    return this.level + 1;
  }

  getIsGameOver(): boolean {
    return this.isGameOver === true;
  }

  isNextLevel(): boolean {
    if ( this.score >= ( this.level + 1 ) * 30 ) {
      return true;
    }
    return false;
  }

  getFalls(): ChickenState {
    return this.chickenState;
  }
  
  reset() {
    this.score = 0;
    this.fails = 0;
    this.level = 0;
    this.state = this.initState();
    this.chickenState = this.initChickenState();
  }

  private setGameOver() {
    console.log( "set game over" )
    this.isGameOver = true;
  }

  private fallElement( branchId: number ) {
    this.fails += 1;
    if ( [ 0, 3 ].includes( branchId ) ) {
      this.dropChicken( Side.LEFT );
      return;
    } 
    this.dropChicken( Side.RIGHT );
  }

  private dropChicken( side: Side ) {
    if ( this.chickenState[ side ][ 0 ] === 0 ) {
      const escaping = new EscapingFactory();
      this.chickenState[ side ][ 0 ] = escaping.get( EscapingFactoryItems.CHICKEN );
    }
  }

  private increaseScore() {
    this.score += 1;
  }

  private initState(): GameState {
    return [
      [ 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0 ],
    ];
  }

  private initChickenState(): ChickenState {
    return [
      [ 0, 0, 0, 0 ],
      [ 0, 0, 0, 0 ],
    ];
  }

  private getBranchOffsetArray() {
    const arr = [];
    for ( let branchId = 0; branchId <= this.maxBranchOffset; branchId++ ) {
      for ( let offset = 0; offset <= this.maxElementOffset; offset++ ) {
        arr.push( { branchId, offset } )
      }
    }
    return arr;
  }

  private getChickenMoveArray() {
    const arr = [];
    for ( let side = 0; side < 2; side++ ) {
      for ( let offset = 0; offset < this.maxChickenPos; offset++ ) {
        arr.push( {side, offset} );
      }
    }
    return arr;
  }
}