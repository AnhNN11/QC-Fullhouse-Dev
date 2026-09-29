import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the actual component effect without modifying browser/OS preferences.
const source = readFileSync(new URL('../app/edu-motion.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

function harness({ reduced = false, supported = true } = {}) {
  class Element {
    constructor(parent = null) {
      this.parentElement = parent;
      this.classes = new Set();
      this.classList = {
        add: (...names) => names.forEach(name => this.classes.add(name)),
        remove: (...names) => names.forEach(name => this.classes.delete(name)),
      };
    }
    closest() { return this; }
  }
  const outer = new Element();
  const inner = new Element(outer);
  const elements = [outer, inner];
  const events = new Map();
  const mediaEvents = new Map();
  const media = {
    matches: reduced,
    addEventListener: (name, fn) => mediaEvents.set(name, fn),
    removeEventListener: (name, fn) => { if (mediaEvents.get(name) === fn) mediaEvents.delete(name); },
  };
  const container = {
    querySelectorAll: () => elements,
    contains: element => elements.includes(element),
    addEventListener: (name, fn) => events.set(name, fn),
    removeEventListener: (name, fn) => { if (events.get(name) === fn) events.delete(name); },
  };
  const observers = [];
  class Observer {
    constructor(callback) { this.callback = callback; this.observed = new Set(); observers.push(this); }
    observe(element) { this.observed.add(element); }
    unobserve(element) { this.observed.delete(element); }
    disconnect() { this.observed.clear(); this.disconnected = true; }
  }
  let effect;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, Element, IntersectionObserver: Observer,
    window: { matchMedia: () => media, ...(supported ? { IntersectionObserver: Observer } : {}) },
    require: name => {
      if (name === 'react') return { useRef: () => ({ current: container }), useEffect: fn => { effect = fn; } };
      if (name === 'react/jsx-runtime') return { jsx: () => null };
      if (name.endsWith('.css')) return {};
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  exports.default({ children: null });
  return { setup: () => effect(), elements, events, mediaEvents, observers };
}

test('reduced motion keeps content visible without observing', () => {
  const h = harness({ reduced: true }); h.setup();
  assert.equal(h.observers.length, 0);
  assert.ok(h.elements.every(e => !e.classes.has('reveal-ready')));
});
test('unsupported observers leave content visible', () => {
  const h = harness({ supported: false }); h.setup();
  assert.equal(h.observers.length, 0);
  assert.ok(h.elements.every(e => !e.classes.has('reveal-ready')));
});
test('intersection reveals only entering sections, once', () => {
  const h = harness(); h.setup();
  const [first, second] = h.elements;
  h.observers[0].callback([{ target: first, isIntersecting: true }, { target: second, isIntersecting: false }]);
  assert.ok(first.classes.has('is-visible'));
  assert.ok(!second.classes.has('is-visible'));
  assert.ok(!h.observers[0].observed.has(first));
});
test('keyboard focus reveals nested sections and ancestors', () => {
  const h = harness(); h.setup(); h.events.get('focusin')({ target: h.elements[1] });
  assert.ok(h.elements.every(e => e.classes.has('is-visible')));
  assert.equal(h.observers[0].observed.size, 0);
});
test('preference change reveals every pending section', () => {
  const h = harness(); h.setup(); h.mediaEvents.get('change')();
  assert.ok(h.elements.every(e => e.classes.has('is-visible')));
});
test('cleanup and Strict Mode re-setup preserve unseen reveal lifecycle', () => {
  const h = harness(); const cleanup = h.setup(); cleanup();
  assert.ok(h.observers[0].disconnected);
  assert.equal(h.events.size, 0); assert.equal(h.mediaEvents.size, 0);
  assert.ok(h.elements.every(e => !e.classes.has('reveal-ready') && !e.classes.has('is-visible')));
  h.setup();
  assert.ok(h.elements.every(e => e.classes.has('reveal-ready') && !e.classes.has('is-visible')));
  assert.equal(h.observers[1].observed.size, 2);
});
