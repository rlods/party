export const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const onlyUnique = <T>(value: T, index: number, self: T[]) =>
  self.indexOf(value) === index;
