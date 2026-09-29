import { getQuickJS } from 'quickjs-emscripten';
import { isDeepStrictEqual } from 'node:util';

// Guest code runs only in WASM; no host callbacks, module loader or I/O exposed.
process.once('message', async ({ code, tests }) => {
  const start = Date.now();
  let passed = 0;
  const engine = await getQuickJS();
  for (const test of tests) {
    const runtime = engine.newRuntime();
    runtime.setMemoryLimit(16 * 1024 * 1024);
    runtime.setMaxStackSize(256 * 1024);
    const deadline = Date.now() + 250;
    runtime.setInterruptHandler(() => Date.now() > deadline);
    const context = runtime.newContext();
    try {
      // Bind pristine serialization before learner globals can be changed.
      const serialize = context.unwrapResult(context.evalCode('JSON.stringify.bind(JSON)'));
      const compiled = context.evalCode(code + '\n; typeof solve === "function" ? solve : undefined');
      if (compiled.error) { compiled.error.dispose(); serialize.dispose(); continue; }
      const args = context.unwrapResult(context.evalCode(JSON.stringify(test.args)));
      const invoke = context.unwrapResult(context.evalCode('(fn, args) => fn(...args)'));
      const result = context.callFunction(invoke, context.undefined, compiled.value, args);
      if (!result.error) {
        const encoded = context.callFunction(serialize, context.undefined, result.value);
        if (!encoded.error) {
          const text = context.getString(encoded.value);
          if (text.length <= 100_000) {
            try { if (isDeepStrictEqual(JSON.parse(text), test.expected)) passed++; } catch {}
          }
          encoded.value.dispose();
        } else encoded.error.dispose();
        result.value.dispose();
      } else result.error.dispose();
      invoke.dispose(); args.dispose(); compiled.value.dispose(); serialize.dispose();
    } finally { context.dispose(); runtime.dispose(); }
  }
  process.send({ accepted: passed === tests.length, passed, total: tests.length, runtimeMs: Date.now() - start, message: passed === tests.length ? 'Đúng tất cả test.' : 'Chưa đạt: kiểm tra kết quả, trường hợp biên và giới hạn chạy.' }, () => process.exit(0));
});
