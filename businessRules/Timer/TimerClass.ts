
export class TimerClass {
  private counter = 0;
  private tmpCounter = 0;
  private mainGameLoop = 0;

  constructor( mainGameLoop: number, counter: number ) {
    this.setTimer( counter );
    this.mainGameLoop = mainGameLoop;
  }

  tick() {
    this.tmpCounter -= this.mainGameLoop;
  }

  canDo(): boolean {
    if ( this.tmpCounter <= 0 ) {
      this.tmpCounter = this.counter;
      return true;
    }
    return false;
  }

  setTimer( counter: number ) {
    this.counter = counter;
    this.tmpCounter = counter;
  }
}