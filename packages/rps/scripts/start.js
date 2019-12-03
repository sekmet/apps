// TODO Connect to existing ganache and deploy contract
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const fs = require('fs');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');

const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const { getNetworkName } = require('@statechannels/devtools');

void (async () => {
  //Allows the use of async/await
  // Warn and crash if required files are missing
  if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
    process.exit(1);
  }

  // Tools like Cloud9 rely on this.
  const DEFAULT_PORT = !!process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  const HOST = process.env.HOST || '0.0.0.0';

  if (process.env.HOST) {
    console.log(
      chalk.cyan(
        `Attempting to bind to HOST environment variable: ${chalk.yellow(
          chalk.bold(process.env.HOST)
        )}`
      )
    );
    console.log(
      `If this was unintentional, check that you haven't mistakenly set it in your shell.`
    );
    console.log(`Learn more here: ${chalk.yellow('http://bit.ly/2mwWSwH')}`);
    console.log();
  }

  // We attempt to use the default port but if it is busy, we offer the user to
  // run on a different port. `choosePort()` Promise resolves to the next free port.
  const port = await choosePort(HOST, DEFAULT_PORT);
  if (port == null) {
    console.error('Could not find a port to run the web-server on');
    process.exit(1);
  }

  const config = configFactory('development');
  // Serve webpack assets generated by the compiler over a web sever.

  const argv = require('yargs').argv;

  if (!process.env.CHAIN_NETWORK_ID) {
    console.error(
      'CHAIN_NETWORK_ID is not defined. Please update your .env file and specify a CHAIN_NETWORK_ID'
    );
    process.exit(1);
  } else if (
    process.env.CHAIN_NETWORK_ID.length === 0 ||
    isNaN(Number.parseInt(process.env.CHAIN_NETWORK_ID, 10))
  ) {
    console.error(
      'CHAIN_NETWORK_ID is not a number. Please update your .env file and specify a number for CHAIN_NETWORK_ID'
    );
    process.exit(1);
  } else {
    argv.i = parseInt(process.env.CHAIN_NETWORK_ID, 10);
  }

  process.env.TARGET_NETWORK = getNetworkName(process.env.CHAIN_NETWORK_ID);

  const devServer = new WebpackDevServer(webpack(config), {
    hot: true,
    contentBase: paths.appPublic,
    compress: true,
  });
  // Launch WebpackDevServer.
  devServer.listen(port, HOST, err => {
    if (err) {
      return console.log(err);
    }
    console.log(chalk.cyan('Starting the development server...\n'));
  });
})();

function execCommand(cmd) {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (stdout) {
        console.log(stdout);
      }
      if (error) {
        console.error(error);
        reject(error);
      }
      if (stderr) {
        console.error(stderr);
        reject(stderr);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}
