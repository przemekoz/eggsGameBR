const random = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

const MAIN_GAME_LOOP = 800; //ms
const MAX_BRANCH_OFFSET = 4;
const MAX_ELEMENT_OFFSET = 4;

enum EggDirection {
    UP = "UP",
    RIGHT = "RIGHT",
    BOTTOM = "BOTTOM",
    LEFT = "LEFT",
}

interface DroppedElement {

}

class Egg implements DroppedElement {
    private direction: EggDirection = EggDirection.UP;

    constructor(direction: EggDirection) {
        this.direction = direction;
    }
}

class Basket {
}

class Game {
    private level = 0;
    private maxBranchOffset = 0;
    private maxElementOffset = 0;
    private levelConfig: Level;
    private counter = 0;
    private fails = 0;
    private basketPosition = 0;
    private state;

    constructor(levels: Level[], maxBranchOffset: number, maxElementOffset: number) {
        this.state = this.initState();
        this.levelConfig = levels[this.level];
        this.maxBranchOffset = maxBranchOffset;
        this.maxElementOffset = maxElementOffset;
    }

    main() {
        console.log("levelConfig", this.levelConfig)
        // setInterval( this.dropItem, this.levelConfig.timeBetweenDropped)
        console.log(this.state)
    }

    setBasketPosition(pos: number) {
        this.basketPosition = pos;
    }

    dropItem() {
        for (let i = 0; i < 10; i++) {
            const branchId = random(0, 3);
            if (this.state[branchId][0] === 0) {
                const element = new Egg(EggDirection.UP)
                this.state[branchId][0] = element;
                break;
            }
        }
    }

    moveItems() {
        const newState = this.initState();
        this.getBranchOffsetArray().forEach(item => {
            const { branchId, offset } = item;
            if (this.state[branchId][offset] !== 0) {
                const element = this.state[branchId][offset];
                newState[branchId][offset + 1] = element;
            }
        });
        this.state = newState;
    }

    scan() {
        this.getBranchOffsetArray().forEach(item => {
            const { branchId, offset } = item;

            if (offset === this.maxElementOffset && this.state[branchId][offset] !== 0) {
                if (this.basketPosition !== branchId) {
                    this.fallElement(branchId);
                } else {
                    this.increaseCounter();
                }
            }

        });
    }

    getState() {
        return this.state;
    }

    getCounter() {
        return this.counter;
    }

    private fallElement(branchId: number) {
        this.fails += 1;
    }

    private increaseCounter() {
        this.counter += 1;
    }

    private initState(): (number | DroppedElement)[][] {
        return [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
    }

    private getBranchOffsetArray() {
        const arr = [];
        for (let branchId = 0; branchId < this.maxBranchOffset; branchId++) {
            for (let offset = 0; offset < this.maxElementOffset; offset++) {
                arr.push({ branchId, offset })
            }
        }
        return arr;
    }
}


interface Level {
    name: string;
    timeBetweenDropped: number;
    speed: number;
}

const levels: Level[] = [
    {
        name: "first",
        timeBetweenDropped: 4000,
        speed: 2200,
    },
    {
        name: "second",
        timeBetweenDropped: 3500,
        speed: 1900,
    },
    {
        name: "third",
        timeBetweenDropped: 3000,
        speed: 1700,
    },
];


class Timer {
    private counter = 0;
    private tmpCounter = 0;
    private mainGameLoop = 0;

    constructor(mainGameLoop: number, counter: number) {
        this.counter = counter;
        this.tmpCounter = counter;
        this.mainGameLoop = mainGameLoop;
        console.log(this.counter, this.tmpCounter, this.mainGameLoop)
    }

    tick() {
        this.tmpCounter -= this.mainGameLoop;
    }

    canDo(): boolean {
        console.log(this.tmpCounter)
        if (this.tmpCounter <= 0) {
            console.log(this.counter)
            this.tmpCounter = this.counter;
            return true;
        }
        return false;
    }
}


const dropTimer = new Timer(MAIN_GAME_LOOP, MAIN_GAME_LOOP * 2);
const moveTimer = new Timer(MAIN_GAME_LOOP, MAIN_GAME_LOOP * 3);

const mainGameInterval = setInterval(() => {

    console.log("MAIN_LOOP")

    if (dropTimer.canDo()) {
        console.log("DROP")
    }

    if (moveTimer.canDo()) {
        console.log("MOVE")
    }

    dropTimer.tick();
    moveTimer.tick();

    //game.scan();

}, MAIN_GAME_LOOP);




// const game = new Game( levels, MAX_BRANCH_OFFSET, MAX_ELEMENT_OFFSET );
// game.main();

// const dropInterval = setInterval( () => {
//   console.log("DROP")
//   game.dropItem();
// //   console.log( game.getState() );
// }, levels[0].timeBetweenDropped );

// const moveInterval = setInterval( () => {
//     console.log("MOVE")
//   game.moveItems();
// //   console.log( game.getState() );
// }, levels[0].speed );

setTimeout(() => {
    //   clearInterval( dropInterval )
    //   clearInterval( moveInterval )
    clearInterval(mainGameInterval);
}, 21000);

