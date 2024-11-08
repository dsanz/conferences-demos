/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import type {
	FDSFilter,
	FDSFilterHTMLElementBuilderArgs,
} from '@liferay/js-api/data-set';
import ClaySlider from '@clayui/slider';
import ClayButton from '@clayui/button';
import ClayForm, {ClayToggle} from '@clayui/form';
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import ClayButtonGroup from "@clayui/button/lib/Group";

/*
  FDS Filter CX defines three functions that interact with the FDS filter UX interactions.
	descriptionBuilder:
		* provides a one-liner description of the filter when it's applied
		* called every time filter is applied

	htmlElementBuilder:
		* provides the filter UI
		* takes
			* the fieldName this filter instance is using
			* the filter object with the current filter state
			* setFilter function to apply the filter upon user interactions. UI shall call setFilter()

	oDataQueryBuilder:
		* Provides the filter query against the REST Endpoint
		* Called when filter is applied
		* Make sure your endpoint supports the odata query

	CX Filter state is defined and set by the CX in some event handler, usually created in
	htmlElementBuilder. Implementor can define any type.

	In this sample we define a range of numbers as the filter state.


 */

// Declare the structure of the internal data that describes the filter state.
type Range = {
	from: number,
	to: number
}

let theFieldName = ""
let translations = {};

function debounce(func, wait, immediate=false) {
	let timeout;

	return () => {
	const context = this;
	const args = arguments;
	function later() {
		timeout = null;
		if (!immediate) {
			func.apply(context, args);
		}
	}
	const callNow = immediate && !timeout;

	clearTimeout(timeout);
	timeout = setTimeout(later, wait);
	if (callNow) {
		func.apply(context, args);
	}
};
}

function descriptionBuilder(selectedData: Range): string {
	return `from ${selectedData.from} to ${selectedData.to}`;
}

function htmlElementBuilder({
	fieldName,
	filter,
	setFilter,
}: FDSFilterHTMLElementBuilderArgs<Range>): HTMLElement {
	theFieldName = fieldName;

	const div = document.createElement('div');

	ReactDOM.render(
		<RangeSelector
			selectedData={filter.selectedData}
			setFilter={setFilter}
		/>,
		div);

	return div;
}

function Text({label, defaultValue} : {label: string, defaultValue: string}) {
	// @ts-ignore
	const locale = Liferay.ThemeDisplay.getBCP47LanguageId();
	const [value, setValue] = useState((translations[locale] && translations[locale][label]) || defaultValue);

	useEffect(() => {
		if ((translations[locale] && translations[locale][label])) {
			return;
		}

		// this endpoint needs
		// @ts-ignore
		Liferay.Util.fetch(`/o/language/v1.0/messages?key=${label}&languageId=${locale}`)
		.then((response) => response.json())
		.then(({value}) => {
			if (value) {
				translations[locale] || (translations[locale] = {})

				translations[locale][label] = value
				setValue(value);
			}
		});
	});

	return (<>{value}</>);
}

function RangeSelector({selectedData, setFilter}) {
	const [from, setFrom] = useState(selectedData?.from || 0);
	const [to, setTo] = useState(selectedData?.to || 0);
	const [alwaysActive, setAlwaysActive] = useState(false);
	const [rangeSelection, setRangeSelection] = useState(true);


	useEffect(() => {
		let newFrom = from;

		if (!rangeSelection || from > to) {
			newFrom = to;
			setFrom(newFrom);
		}

		if (alwaysActive) {
			debounce(setFilter({
				selectedData: {
					from: newFrom,
					to
				}}), 500);
		}
	}, [to]);

	useEffect(() => {
		let newTo = to;

		if (!rangeSelection || to < from) {
			newTo = from;
			setTo(newTo);
		}

		if (alwaysActive) {
			debounce(setFilter({
				selectedData: {
					from,
					to: newTo
				}}), 500);
		}
	}, [from])

	useEffect(() => {
		setFrom(selectedData?.from || 0)
		setTo(selectedData?.to || 0)
	}, [])

	return (
		<ClayForm style={{padding: '0.75rem'}}>
			<ClayForm.Group>
				<label htmlFor="slider-from">{<Text label={'minimum'} defaultValue={'Minimum'}/>}: {from}</label>
				<ClaySlider
					id="slider-from"
					defaultValue={from}
					min={0}
					max={250}
					onChange={(value) => setFrom(value)}
					value={from}
				/>
			</ClayForm.Group>

			<ClayForm.Group>
				<label htmlFor="slider-to">{<Text label={'maximum'} defaultValue={'Maximum'}/>}: {to}</label>
				<ClaySlider
					id="slider-to"
					defaultValue={to}
					min={0}
					max={250}
					onChange={(value) => setTo(value)}
					value={to}
				/>
			</ClayForm.Group>

			<ClayForm.Group>
				<ClayButton
					disabled={alwaysActive}
					onClick={() =>
						setFilter({
							selectedData: {
								from,
								to
							}
						})}
				>
					<Text label={'apply'} defaultValue={'Apply'}/>
				</ClayButton>
				&nbsp;
				<ClayToggle
					label={<Text label={'always-active'} defaultValue={'Always Active'}/>}
					onToggle={setAlwaysActive}
					toggled={alwaysActive}
				/>
				&nbsp;
				<ClayToggle
					label={<Text label={'range-selection'} defaultValue={'Range Selection'}/>}
					onToggle={setRangeSelection}
					toggled={rangeSelection}
				/>
			</ClayForm.Group>
		</ClayForm>
	);
}

function oDataQueryBuilder(selectedData: Range): string {
	return `${theFieldName} ge ${selectedData.from} and ${theFieldName} le ${selectedData.to}`;
}

const fdsRankFilter: FDSFilter<Range> = {
	descriptionBuilder,
	htmlElementBuilder,
	oDataQueryBuilder,
};

export default fdsRankFilter;
