export default function on<T extends Window | Document | HTMLElement | EventTarget>(obj: T | null, ...args: Parameters<T['addEventListener']> | [string, Function | null, ...any]): void;
