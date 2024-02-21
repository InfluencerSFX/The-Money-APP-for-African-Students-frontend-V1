export default function off<T extends Window | Document | HTMLElement | EventTarget>(obj: T | null, ...args: Parameters<T['removeEventListener']> | [string, Function | null, ...any]): void;
