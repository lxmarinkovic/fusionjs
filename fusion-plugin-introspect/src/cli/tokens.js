// @flow
const {parseRuntimeMetadata} = require('../shared/parseRuntimeMetadata.js');
const {getMaxWordWidth} = require('../shared/getMaxWordWidth.js');
const {listDependencies} = require('../shared/listDependencies.js');
const {listSourceLines} = require('../shared/listSourceLines.js');
const {sortDependencies} = require('../shared/sortDependencies.js');

module.exports.tokens = async () => {
  const data = await parseRuntimeMetadata();

  const lists = [
    data.browser ? `Browser:\n${tabulateTokens(data, 'browser')}\n\n` : '',
    data.server ? `Server:\n${tabulateTokens(data, 'server')}\n\n` : '',
  ];
  return lists.filter(Boolean).join('\n');
};

const tabulateTokens = (data, type) => {
  const space = ' '.repeat(getMaxWordWidth(data[type]) + 2);
  return sortDependencies(listDependencies(data[type]))
    .map((dep) => {
      const name = dep.name;
      return (
        `${name}${space.slice(name.length)}` +
        listSourceLines(dep, 'register').join(space)
      );
    })
    .join('\n');
};
