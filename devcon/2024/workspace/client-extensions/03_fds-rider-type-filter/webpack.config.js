/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const path = require('path');
const webpack = require('webpack');

const DEVELOPMENT = process.env.NODE_ENV === 'development';
const WEBPACK_SERVE = !!process.env.WEBPACK_SERVE;

module.exports = {
	devServer: {
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		port: 3000,
	},
	devtool: DEVELOPMENT ? 'source-map' : false,
	entry: {
		index: './src/index.tsx',
	},
	experiments: {
		outputModule: true,
	},
	externals: {
		'@clayui/button': '@clayui/button',
		'@clayui/form': '@clayui/form',
		'@clayui/label': '@clayui/label',
		'react': 'react',
		'react-dom': 'react-dom',
	},
	mode: DEVELOPMENT ? 'development' : 'production',
	module: {
		rules: [
			{
				test: /\.tsx$/i,
				use: ['ts-loader'],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'assets/',
						},
					}
				],
			},
		],
	},
	optimization: {
		minimize: !DEVELOPMENT,
	},
	output: {
		clean: true,
		environment: {
			dynamicImport: true,
			module: true,
		},
		filename: WEBPACK_SERVE ? '[name].js' : '[name].[contenthash].js',
		library: {
			type: 'module',
		},
		path: path.resolve('build', 'static'),
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1,
		}),
	],
};
