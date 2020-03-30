const autoprefixer = require('autoprefixer');
const path = require('path');

module.exports = {
  plugins: [
    autoprefixer({
      overrideBrowserslist: [ 'last 2 version', '> .5%', 'IE 10' ],
      grid: 'autoplace',
    }),
  ],
  inlineSourcemaps: true,
  src: () => path.join(__dirname, 'public', 'stylesheets', '*.css'),
};
