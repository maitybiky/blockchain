export function logCurrentTime(msg:string) {
  const now = new Date();

  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  // console.log(`${msg} - ${minutes}:${seconds}:${milliseconds}`);
}
