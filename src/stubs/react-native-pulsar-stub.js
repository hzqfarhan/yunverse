const noop = () => {};

const createProxy = () => {
  const fn = () => {};
  return new Proxy(fn, {
    get: (_target, prop) => {
      if (prop === 'then') return undefined;
      return createProxy();
    },
    apply: () => {},
  });
};

export const usePatternComposer = () => ({
  play: noop,
  stop: noop,
  pause: noop,
  resume: noop,
  seek: noop,
  isPlaying: false,
});

export const Presets = createProxy();
export const Settings = createProxy();
export const Pulsar = createProxy();

const PulsarStub = {
  usePatternComposer,
  Presets,
  Settings,
  Pulsar,
};

export default PulsarStub;
