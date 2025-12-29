// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const debounce = <T extends any[], R>(callback: (...args: T) => R): ((...args: T) => void) => {
  let timeout: number | undefined

  return (...args: T): void => {
    if (timeout !== undefined) cancelAnimationFrame(timeout)
    timeout = requestAnimationFrame(() => callback.apply(this, args))
  }
}

export default debounce
