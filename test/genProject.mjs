import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { getCmake } = require('../js/cmake');
const { getMain } = require('../js/main');
const { DEFAULT_NAME, DEFAULT_VERSION, DEFAULT_DESCRIPTION, DEFAULT_SRC_PATH, DEFAULT_RES_PATH } = require('../js/globals');
const fs = require('fs');

let data = JSON.parse(fs.readFileSync('data/libraries.json').toString());
const rawMain = fs.readFileSync('data/main.cpp').toString();
const rawCmake = fs.readFileSync('data/CMakeLists.txt').toString();
const rawSubmodulesUpdate = fs.readFileSync('data/SubmodulesUpdate.txt').toString();

for (let lib of Object.keys(data)) {
	data[lib].selected = false;
}

const readFile = (file) => {
	return fs.readFileSync(file).toString();
};

let libraries = [];

for (let i = 2; i < process.argv.length; i++) {
	libraries.push(process.argv[i]);
	data[process.argv[i]].selected = true;
}

fs.writeFileSync('test/CMakeLists.txt', getCmake(libraries, DEFAULT_NAME, DEFAULT_VERSION, DEFAULT_DESCRIPTION, DEFAULT_SRC_PATH, DEFAULT_RES_PATH, false, false, data, rawCmake, rawSubmodulesUpdate));
fs.writeFileSync('test/src/main.cpp', getMain(rawMain, DEFAULT_NAME, data, readFile));