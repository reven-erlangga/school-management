import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { stage, Stage } from './stage.store';

describe('stage.store', () => {
  beforeEach(() => {
    stage.reset();
  });

  it('follows stage order: general → mail server → xendit → seeding', () => {
    expect(get(stage)).toBe(Stage.General);
    stage.next();
    expect(get(stage)).toBe(Stage.MailServer);
    stage.next();
    expect(get(stage)).toBe(Stage.Xendit);
    stage.next();
    expect(get(stage)).toBe(Stage.Seeding);
  });

  it('backs correctly: seeding → xendit → mail server → general', () => {
    stage.set(Stage.Seeding);
    stage.back();
    expect(get(stage)).toBe(Stage.Xendit);
    stage.back();
    expect(get(stage)).toBe(Stage.MailServer);
    stage.back();
    expect(get(stage)).toBe(Stage.General);
  });
});
