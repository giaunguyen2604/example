// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const fs = require('fs');

const app = 'meeting';
let mode = 'development';

if (process.env.NODE_ENV) {
  console.log('Welcome to ', process.env.NODE_ENV);
  mode = process.env.NODE_ENV;
}

let envFile = `.env.${mode}`;
const envConfig = { parsed: dotenv.parse(fs.readFileSync(envFile)) };
dotenvExpand(envConfig);

const envKeys = Object.keys(envConfig.parsed).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(envConfig.parsed[next]);
  return prev;
}, {});

console.log('envKeys:', envKeys);

module.exports = {
  mode: 'development',
  entry: ['./src/App.js'],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    mainFields: ['browser', 'main', 'module'],
    extensions: ['.tsx', '.ts', '.js','.json', '.jsx'],
    alias: {
      react: path.resolve('./node_modules/react'),
      'styled-components': path.resolve('./node_modules/styled-components'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      'amazon-chime-sdk-component-library-react': path.resolve(
       './node_modules/amazon-chime-sdk-component-library-react'
      )
    }
  }
};
