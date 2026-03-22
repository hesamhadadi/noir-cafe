// Next.js 15 server instrumentation — runs before anything else on the server.
//
// ROOT CAUSE (Node.js 25 bug — nodejs/node#60303):
//   Node.js 25 exposes globalThis.localStorage as a broken proxy object.
//   The object EXISTS (so typeof checks pass) but its methods (getItem etc.)
//   are undefined/non-functional. Next.js internal code and libraries like
//   Three.js call localStorage.getItem() → TypeError crash → 500 on every page.
//
// FIX: Unconditionally replace globalThis.localStorage with a working in-memory
//      implementation regardless of what Node.js has put there.

export async function register() {
  // Always override — covers both Node.js <25 (undefined) and
  // Node.js 25 (exists but broken). Use Object.defineProperty to
  // force-overwrite even non-configurable descriptors.
  const makeStorage = () => {
    const store: Record<string, string> = {};
    return {
      getItem:    (key: string) => Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null,
      setItem:    (key: string, value: string) => { store[String(key)] = String(value); },
      removeItem: (key: string) => { delete store[key]; },
      clear:      () => { Object.keys(store).forEach((k) => delete store[k]); },
      get length()                { return Object.keys(store).length; },
      key:        (index: number) => Object.keys(store)[index] ?? null,
    };
  };

  try {
    Object.defineProperty(globalThis, "localStorage", {
      value:        makeStorage(),
      writable:     true,
      configurable: true,
      enumerable:   false,
    });
  } catch {
    // fallback if defineProperty is blocked
    (globalThis as unknown as Record<string, unknown>).localStorage = makeStorage();
  }

  try {
    Object.defineProperty(globalThis, "sessionStorage", {
      value:        makeStorage(),
      writable:     true,
      configurable: true,
      enumerable:   false,
    });
  } catch {
    (globalThis as unknown as Record<string, unknown>).sessionStorage = makeStorage();
  }
}
