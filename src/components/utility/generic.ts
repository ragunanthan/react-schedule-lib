// so we could use both immutable.js objects and regular objects

export function _get(object: any, key: string | number) {
  return typeof object.get === "function" ? object.get(key) : object[key];
}

export function _length(object: any) {
  return typeof object.count === "function" ? object.count() : object.length;
}

export function arraysEqual(array1: any[], array2: any[]) {
  return (
    _length(array1) === _length(array2) &&
    array1.every((element, index) => {
      return element === _get(array2, index);
    })
  );
}
export function deepObjectCompare(obj1: object, obj2: object) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function keyBy(value: any, key: any) {
  let obj: any = {};

  value.forEach((element: any) => {
    obj[element[key]] = element;
  });

  return obj;
}
