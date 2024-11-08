/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import type {
	FDSFilter,
	FDSFilterHTMLElementBuilderArgs,
} from '@liferay/js-api/data-set';
import ClayButton from '@clayui/button';
import ClayForm from '@clayui/form'
import ClayLabel from '@clayui/label';
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
// @ts-ignore
import AllRounder from './assets/allrounder.png';
// @ts-ignore
import Climber from './assets/climber.png';
// @ts-ignore
import Sprinter from './assets/sprinter.png';

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

	In this sample we define a rider type as internal state, from which we compute the odata and the UI

 */


// Declare the structure of the internal data that describes the filter state.

enum RiderType {
	AllRounder = "AllRounder",
	Climber = "Climber",
	Sprinter = "Sprinter",
	None = "None"
}

const RiderTypeDescriptions = {
	[`${RiderType.AllRounder}`]: "All Rounders",
	[`${RiderType.Climber}`]: "Climbers",
	[`${RiderType.Sprinter}`]: "Sprinters",
	[`${RiderType.None}`]: "Everyone",

}

const RiderTypeImages = {
	[`${RiderType.AllRounder}`]: AllRounder,
	[`${RiderType.Climber}`]: Climber,
	[`${RiderType.Sprinter}`]: Sprinter,
}

let theFieldName = ""

function descriptionBuilder(selectedData: RiderType): string {
	return RiderTypeDescriptions[selectedData];
}

function htmlElementBuilder({
	fieldName,
	filter,
	setFilter,
}: FDSFilterHTMLElementBuilderArgs<RiderType>): HTMLElement {
	theFieldName = fieldName;
	const div = document.createElement('div');

	ReactDOM.render(
		<Filter
			selectedData={filter.selectedData}
			fieldName={fieldName}
			setFilter={setFilter}
		/>,
		div);

	return div;
}

function Filter({selectedData, fieldName, setFilter}) {
	const [selection, setSelection] = useState(selectedData);

	useEffect(() => {
		setFilter({
			selectedData: selection
		});
	}, [selection]);

	return (
		<ClayForm style={{padding: '0.75rem'}}>
			<ClayButton.Group spaced={true} vertical={true}>
				{ Object.keys(RiderType).filter((riderType) => riderType!= RiderType.None).map(
					(riderType) => (
						<ClayButton
							displayType={selection == riderType ? "primary" : "secondary"}
							onClick={() => {
								if (selection != riderType) {
									setSelection(riderType);
								} else {
									setSelection(RiderType.None);
								}
							}}
						>
							<ClayLabel displayType="secondary">
								{RiderTypeDescriptions[riderType]}
							</ClayLabel>

							<img src={RiderTypeImages[riderType]} width='45%'/>

						</ClayButton>

					))
				}

				<ClayButton borderless
							onClick={() => setSelection(RiderType.None)}
				>
					Clear
				</ClayButton>

			</ClayButton.Group>
		</ClayForm>
	);
}

function oDataQueryBuilder(selectedData: RiderType): string {
	let expression = "";

	if (selectedData == RiderType.Climber) {
		expression = `${theFieldName} lt 68`;
	}
	else if (selectedData == RiderType.AllRounder) {
		expression = `${theFieldName} ge 68 and ${theFieldName} le 75`;
	}
	else if (selectedData == RiderType.Sprinter) {
		expression = `${theFieldName} gt 75`;
	}
	return expression;
}

const fdsRiderTypeFilter: FDSFilter<RiderType> = {
	descriptionBuilder,
	htmlElementBuilder,
	oDataQueryBuilder,
};

export default fdsRiderTypeFilter;
