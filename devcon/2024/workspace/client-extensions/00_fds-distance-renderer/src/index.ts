/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import type {FDSTableCellHTMLElementBuilder} from '@liferay/js-api/data-set';

/*
	FDS Cell Renderer CX defines a function taking the value
	to render and returning an HTML Component

	Function must be the default export in this file
	package @liferay/js-api provides convenient types for the signature of this function

	FDS, when rendering a cell in a table configured with this CX, calls the function and
	injects the HTMLElement into the markup

	This sample uses DOM operations to render the cell.

 */

const fdsWeightRenderer: FDSTableCellHTMLElementBuilder = ({value}) => {
	const element = document.createElement('div');

	let imperial = false;

	// get the current locale used to render the page
	// @ts-ignore
	if (Liferay.ThemeDisplay.getBCP47LanguageId() === 'en-US') {
		imperial = true;
	}

	const unit = imperial ? 'mi' : 'km'

	let amount = imperial ? (Number(value) * 0.621371).toFixed(2) : Number(value);

	// strip decimals if they're 0
	if (!isNaN(amount as number)) {
		const truncated = Number(amount as number).toFixed(0);

		amount = Number(amount) === Number(truncated) ? truncated : amount
	}

	// populate the element we want to return
	element.innerHTML = isNaN(amount as number) ? value as string : (amount + " " + unit);

	return element;
};

export default fdsWeightRenderer;
