import { error } from "console";

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function mergeObjectsWithOverwrite(obj1: any, obj2: any) {
  if (typeof obj1 === typeof obj2) {
    console.log("Merging");
    Object.keys(obj2).map(key => {
      console.log(key);
      if (typeof obj1[key] === "object") {
        obj1[key] = mergeObjectsWithOverwrite(obj1[key], obj2[key]);
      } else {
        obj1[key] = obj2[key];
      }
    });
    return obj1;
  } else {
    error("Objects must be of the same type");
  }
}
