export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function sleep(time: number = 0) {
  return new Promise<void>((resolve) => {
    setTimeout(function () {
      resolve();
    }, time);
  });
}
