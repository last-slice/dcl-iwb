
export function getRandomIntInclusive(min:number, max:number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

export function getRandomIntWithDecimals(min:number, max:number) {
  return (Math.random() * (max - min)) + min;
}


export function generateRandomId(length:number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function distance(player:any, object:any){
    return Math.sqrt(
    Math.pow(player.x - object.x, 2) + Math.pow(player.y - object.y, 2) + Math.pow(player.z- object.z, 2)
  );
}

export function distanceObjects(from:any, to:any){
  return Math.sqrt(
  Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2) + Math.pow(from.z- to.z, 2)
);
}

export function isJSON(value:any) {
  try {
    const parsedValue = JSON.parse(value);
    return typeof parsedValue === "object";
  } catch (error) {
    return false;
  }
}

export function deepCopyMap(originalMap: Map<any, any>): Map<any, any> {
  const newMap = new Map<any, any>();

  originalMap.forEach((value, key) => {
    // For primitive values, you can directly assign them to the new map
    if (typeof value !== 'object' || value === null) {
      newMap.set(key, value);
    }
    // For object values, create a deep copy recursively
    else {
      newMap.set(key, deepCopyMap(value));
    }
  });

  return newMap;
}

export const getStartOfDayUTC = () => {
  const currentDate = new Date();
  const isDST = isEasternDaylightTime();
  const offset = isDST ? -4 : -5; // Offset for EST or EDT (GMT-4:00 or GMT-5:00) depending on DST

  const startOfDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    0, 0, 0, 0
  );

  const startOfDayUTC = startOfDay.getTime() + offset * 60 * 60 * 1000;
  return Math.floor(startOfDayUTC / 1000);
  };

  const isEasternDaylightTime = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
  
    // DST starts on the second Sunday in March
    const dstStart = new Date(currentYear, 2, 8 + (14 - new Date(currentYear, 2, 1).getDay()));
    dstStart.setUTCHours(7); // Adjust UTC hours to 7 AM
  
    // DST ends on the first Sunday in November
    const dstEnd = new Date(currentYear, 10, 1 + (7 - new Date(currentYear, 10, 1).getDay()));
    dstEnd.setUTCHours(6); // Adjust UTC hours to 6 AM
  
    return currentDate >= dstStart && currentDate < dstEnd;
  };

  // Define a simple Vector3-like class or object
export class Vector3 {
  x:number
  y:number
  z:number

  constructor(x:number, y:number, z:number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  lerp(target:Vector3, t:number) {
    return new Vector3(
      lerp(this.x, target.x, t),
      lerp(this.y, target.y, t),
      lerp(this.z, target.z, t)
    );
  }
}

function lerp(start:number, end:number, t:number) {
  return (1 - t) * start + t * end;
}