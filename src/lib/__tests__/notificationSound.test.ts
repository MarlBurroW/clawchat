/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Web Audio API nodes
function createMockOscillator() {
  return {
    type: 'sine' as OscillatorType,
    frequency: { value: 0 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  };
}

function createMockGain() {
  return {
    gain: {
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  };
}

describe('playNotificationSound', () => {
  let mockCtx: Record<string, unknown>;
  let oscillators: ReturnType<typeof createMockOscillator>[];
  let gains: ReturnType<typeof createMockGain>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let origAudioContext: any;

  beforeEach(() => {
    vi.resetModules();

    oscillators = [];
    gains = [];

    mockCtx = {
      currentTime: 0,
      state: 'running',
      destination: {},
      resume: vi.fn(),
      createOscillator: vi.fn(() => {
        const osc = createMockOscillator();
        oscillators.push(osc);
        return osc;
      }),
      createGain: vi.fn(() => {
        const gain = createMockGain();
        gains.push(gain);
        return gain;
      }),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    origAudioContext = (globalThis as any).AudioContext;
    // Use a proper class so `new AudioContext()` works
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).AudioContext = class {
      constructor() {
        return mockCtx;
      }
    };
  });

  afterEach(() => {
    if (origAudioContext === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (globalThis as any).AudioContext;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).AudioContext = origAudioContext;
    }
  });

  async function getPlayFn() {
    const mod = await import('../notificationSound');
    return mod.playNotificationSound;
  }

  it('creates two oscillators for the two-tone chime', async () => {
    const play = await getPlayFn();
    play();
    expect(oscillators).toHaveLength(2);
    expect(gains).toHaveLength(2);
  });

  it('uses correct frequencies (C5 and E5)', async () => {
    const play = await getPlayFn();
    play();
    expect(oscillators[0].frequency.value).toBe(523.25);
    expect(oscillators[1].frequency.value).toBe(659.25);
  });

  it('sets oscillator type to sine', async () => {
    const play = await getPlayFn();
    play();
    oscillators.forEach((osc) => {
      expect(osc.type).toBe('sine');
    });
  });

  it('connects oscillators through gain nodes to destination', async () => {
    const play = await getPlayFn();
    play();
    oscillators.forEach((osc, i) => {
      expect(osc.connect).toHaveBeenCalledWith(gains[i]);
      expect(gains[i].connect).toHaveBeenCalledWith(mockCtx.destination);
    });
  });

  it('starts and stops each oscillator', async () => {
    const play = await getPlayFn();
    play();
    oscillators.forEach((osc) => {
      expect(osc.start).toHaveBeenCalledTimes(1);
      expect(osc.stop).toHaveBeenCalledTimes(1);
    });
  });

  it('applies gain envelope with the given volume', async () => {
    const play = await getPlayFn();
    play(0.5);
    expect(gains[0].gain.linearRampToValueAtTime).toHaveBeenCalledWith(
      0.5,
      expect.any(Number),
    );
  });

  it('uses default volume of 0.3', async () => {
    const play = await getPlayFn();
    play();
    expect(gains[0].gain.linearRampToValueAtTime).toHaveBeenCalledWith(
      0.3,
      expect.any(Number),
    );
  });

  it('resumes suspended AudioContext', async () => {
    mockCtx.state = 'suspended';
    const play = await getPlayFn();
    play();
    expect(mockCtx.resume).toHaveBeenCalled();
  });

  it('does nothing when AudioContext is unavailable', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).AudioContext;
    const play = await getPlayFn();
    expect(() => play()).not.toThrow();
  });
});
