let lockCount = 0

export function lockPageScroll() {
  if (lockCount++ === 0) {
    document.documentElement.setAttribute('data-scroll-lock', '')
  }
}

export function unlockPageScroll() {
  if (lockCount === 0) {
    return
  }

  if (--lockCount === 0) {
    document.documentElement.removeAttribute('data-scroll-lock')
  }
}
