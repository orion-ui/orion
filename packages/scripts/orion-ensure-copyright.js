#!/usr/bin/env node
/* eslint-env shelljs */

const program = require('commander');
const path = require('path');
const knownPaths = require('./modules/known-paths');
const fs = require('fs');
const glob = require('glob');

require('shelljs/global');

const LICENCE = fs.readFileSync(path.join(knownPaths.root, 'LICENSE')).toString();

program
  .description('ensures each file has a copyright notice')
  .option('--dir <dir>', 'Directory within which to ensure copyright notices are present')
  .option('--fix', 'Specify the packages to build defaulting to all')
  .parse(process.argv);

if (!program.dir) {
  console.error('Error missing dir');
  program.outputHelp();
}

function reportResult(result) {
  if (result.fail.length === 0) {
    console.log('All files have copyright notices.');
  } else {
    console.log('The following files are missing copyright notices:');
    console.log(result.fail.join('\n'));
    process.exit(1);
  }
}

function noticeForFile(file) {
  switch (path.extname(file)) {
    case '.js':
      return `/**\n${LICENCE}*/`.trim();
    default:
      return true;
  }
}

function hasCopyrightNotice(file) {
  const notice = noticeForFile(file);
  const fileHead = fs.readFileSync(file).toString().slice(0, notice.length);

  return notice === fileHead;
}

function ensureCopyright(dir) {
  const pattern = path.join(dir, '**/*.js');
  const files = glob.sync(pattern);
  console.log(pattern);
  console.log(files);
  const result = files.reduce((memo, file) => {
    if (hasCopyrightNotice(file)) {
      memo.pass.push(file);
    } else {
      memo.fail.push(file);
    }
    return memo;
  }, { pass: [], fail: [] });
  reportResult(result);
}

/**
 * Main program
 *
 * - goes through all files in the repo
 * - passes if all files have a copyright notice
 * - fails if any do not
 * - optionally adds a copyright notice where missing
 */

ensureCopyright(program.dir);
