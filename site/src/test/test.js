const fs = require('fs');
const path = require('path');
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
require('babel-polyfill');

Enzyme.configure({ adapter: new Adapter() });

// global window stuff..
const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  'url': 'https://localhost/'
});
const { window } = jsdom;
function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {});
  Object.defineProperties(target, props);
}
global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global);

// the actual tests...
let tests = {
  components: [],
  views: []
}
tests.components = fs.readdirSync(path.resolve('src/test/components'));
tests.views = fs.readdirSync(path.resolve('src/test/views'));

for (let folder in tests) {
  let folderTests = tests[folder];
  for (let testFile of folderTests) {
    if (testFile.indexOf('.js') !== -1) {
      require('./' + folder + '/' + testFile);
    }
  }
}
