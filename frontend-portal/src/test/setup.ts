import '@testing-library/jest-dom/vitest';

if (!HTMLElement.prototype.animate) {
  HTMLElement.prototype.animate = (() => {
    return {
      finished: Promise.resolve(),
      cancel: () => {},
      play: () => {},
      pause: () => {},
      reverse: () => {},
      finish: () => {},
      onfinish: null,
    } as any;
  }) as any;
}
