import { readFile } from "@jakub-l/aoc-lib/input-parsing";

type Race = { duration: number, record: number };



/**
 * distance = (raceDuration - holdTime) * holdTime
 * distance = raceDuration * holdTime - holdTime^2
 * record < distance
 * record < raceDuration * holdTime - holdTime^2
 * 0 < - holdTime^2 + raceDuration * holdTime - record
 * 
 * a = -1
 * b = raceDuration
 * c = -record
 * 
 * holdTime1 = (-raceDuration + sqrt(raceDuration^2 - 4record)) / -2
 * holdTime2 = (-raceDuration - sqrt(raceDuration^2 - 4record)) / -2
 * 
 * holdTime1 = (raceDuration - sqrt(raceDuration^2 - 4record)) / 2
 * holdTime2 = (raceDuration + sqrt(raceDuration^2 - 4record)) / 2
 */

const waysToWin = (race: Race): number => {
  const { duration, record } = race;
  const sqrtDelta = Math.sqrt(duration ** 2 - 4 * record);
  let lowerTime = (duration - sqrtDelta) / 2;
  lowerTime = Math.ceil(lowerTime) === lowerTime ? lowerTime + 1 : Math.ceil(lowerTime);
  let upperTime = (duration + sqrtDelta) / 2;
  upperTime = Math.floor(upperTime) === upperTime ? upperTime - 1 : Math.floor(upperTime);
  return upperTime - lowerTime + 1;
}

console.log(waysToWin({ duration: 55, record: 401 }));
console.log(waysToWin({ duration: 99, record: 1485 }))
console.log(waysToWin({ duration: 97, record: 2274 }))
console.log(waysToWin({ duration: 93, record: 1405 }))

console.log(waysToWin({ duration: 55999793, record: 401148522741405 }))