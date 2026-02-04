export const rotateLeft = <T>(arr: T[], count: number) => {
  const n = count % arr.length;
  return [...arr.slice(n), ...arr.slice(0, n)];
};

export const rotateRight = <T>(arr: T[], count: number) => {
  const n = count % arr.length;
  return [...arr.slice(-n), ...arr.slice(0, -n)];
};
