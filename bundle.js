const fs = require('fs');
const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('uglify-js');
const plugins = [
  typescript({
    typescript: require('typescript'),
  }),
  resolve({
    module: true,
    jsnext: true,
    main: true,
  }),
  commonjs({}),
];
const moduleName = 'raven';
const config = {
  entry: 'src/lib/index.ts',
  dest: 'dist/raven.js',
  format: 'iife',
  moduleName: moduleName,
  context: 'window',
  sourceMap: false,
  plugins: plugins,
};
rollup
  .rollup(config)
  .then(bundle => {
    return bundle
      .generate({
        format: 'iife',
        moduleName: config.moduleName,
        exports: 'named',
      })
      .then(result => {
        const minify = uglify.minify(result.code, {
          sourceMap: {
            filename: `${moduleName}.js`,
            url: `${moduleName}.js.map`,
          },
        });
        !fs.existsSync('dist') && fs.mkdirSync('dist');
        fs.writeFileSync(`dist/${moduleName}.js`, result.code);
        fs.writeFileSync(`dist/${moduleName}.min.js`, minify.code);
        fs.writeFileSync(`dist/${moduleName}.js.map`, minify.map);
      });
  })
  .catch(err => console.log(err));
