import { MAIN_GAME_LOOP } from "./config";

export interface Level {
  name: string;
  timeBetweenDropped: number;
  speed: number;
}

export const levels: Level[] = [
  {
    name: "first",
    timeBetweenDropped: MAIN_GAME_LOOP * 6,
    speed: MAIN_GAME_LOOP * 5,
  },
  {
    name: "second",
    timeBetweenDropped: MAIN_GAME_LOOP * 4,
    speed: MAIN_GAME_LOOP * 3,
  },
  {
    name: "third",
    timeBetweenDropped: MAIN_GAME_LOOP * 3,
    speed: MAIN_GAME_LOOP * 2,
  },
];