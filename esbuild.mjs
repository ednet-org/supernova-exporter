import { build, context } from 'esbuild';

const isWatch = process.argv.includes('--watch');

const options = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/build.js',
  platform: 'node',
  target: 'es2020',
  format: 'cjs',
  minify: !isWatch,
  sourcemap: false,
};

async function run() {
  if (isWatch) {
    const ctx = await context(options);
    await ctx.watch();
    console.log('Watching for changes...');
  } else {
    await build(options);
    console.log('Build complete.');
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
