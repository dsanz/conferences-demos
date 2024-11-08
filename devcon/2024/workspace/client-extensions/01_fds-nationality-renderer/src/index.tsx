/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import type {FDSTableCellHTMLElementBuilder} from '@liferay/js-api/data-set';
import ClayLabel from '@clayui/label';
import ClayLayout from '@clayui/layout';
import React from 'react';
import ReactDOM from 'react-dom';
import clm from 'country-locale-map';

/*
	FDS Cell Renderer CX defines a function taking the value
	to render and returning an HTML Component

	Function must be the default export in this file
	package @liferay/js-api provides convenient types for the signature of this function

	FDS, when rendering a cell in a table configured with this CX, calls the function and
	injects the HTMLElement into the markup

	This sample uses React to render the cell.
	It also uses Clay react components. None of them are packaged
	in this CX (see externals in webpack.config.js file), but gotten from portal import maps

 */

const fdsNationalityRenderer: FDSTableCellHTMLElementBuilder = ({value}) => {
	const element = document.createElement('div');

	value = value === "Great Britain" ? "United Kingdom" : value;

	const country = clm.getCountryByName(value as string);

	ReactDOM.render(
		<ClayLayout.ContentRow padded>
			<ClayLayout.ContentCol>
				<>{country.emoji}</>
			</ClayLayout.ContentCol>
			<ClayLayout.ContentCol>
				<ClayLabel displayType="secondary">
					{country.alpha3}
				</ClayLabel>
			</ClayLayout.ContentCol>
		</ClayLayout.ContentRow>,
		element);

	return element;
};

export default fdsNationalityRenderer;
