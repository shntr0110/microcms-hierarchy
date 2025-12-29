// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const throttle = (delay: number, callback: (...args: any[]) => void): ((this: unknown, ...args: any[]) => void) => {
  let timer: number | null = null
  let lastExec = 0

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return function (this: unknown, ...args: any[]): void {
    const elapsed: number = Date.now() - lastExec

    const exec = () => {
      lastExec = Date.now()
      callback.apply(this, args)
    }

    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    if (elapsed > delay) {
      exec()
    } else {
      timer = window.setTimeout(exec, delay - elapsed) as unknown as number
    }
  }
}

export default throttle
