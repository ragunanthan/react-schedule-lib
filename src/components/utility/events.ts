export function composeEvents(...fns: any) {
  return (event: any, ...args: any) => {
    event.preventDefault();
    fns.forEach((fn: any) => fn && fn(event, ...args));
  };
}
