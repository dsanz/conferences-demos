import  ReactDOM  from 'react-dom';
import { useState, useEffect } from 'react';
import ClayTable from '@clayui/table';

import './index.css';

const {Liferay} = window;

const UPDATE_DRIVING_LICENSE_TEST_SCORE = 'updateDrivingLicenseTestScore';

const defaultPlayers = [{
	name: 'Alberto Ruiz',
	score: 25
},
{
	name: 'Irene Díaz',
	score: 20
}];

function App() {
	const [players, setPlayers] = useState(defaultPlayers);

	useEffect(() =>{
		Liferay.on(UPDATE_DRIVING_LICENSE_TEST_SCORE, (event) => {
			const newPlayers = [...players];
			const playerName = event.playerName;
			const score = event.score;

			const player = newPlayers.find(player => player.name === playerName);

			if (player) {
				player.score = score;
			}
			else {
				newPlayers.push({name: playerName, score});
			}

			newPlayers.sort((a, b) => b.score - a.score );

			setPlayers(newPlayers);
		})
	},[]);

	return (
		<div className="App">
			<ClayTable
				hover
				responsiveSize="md"
				striped
			>
				<ClayTable.Head>
					<ClayTable.Row>
						<ClayTable.Cell
							align="left"
							headingTitle
						>
							User Name
						</ClayTable.Cell>
						<ClayTable.Cell
							align="left"
							headingTitle
						>
							Score
						</ClayTable.Cell>
					</ClayTable.Row>
				</ClayTable.Head>

				<ClayTable.Body>
					{ 
						players.map((player, key) => (
							<ClayTable.Row key={key}>
								<ClayTable.Cell headingTitle align="left">{player.name}</ClayTable.Cell>
								<ClayTable.Cell align="left">{player.score}</ClayTable.Cell>
							</ClayTable.Row>
						))
					}
				</ClayTable.Body>
			</ClayTable>			
		</div>
	);
}
class RecordLicense extends HTMLElement {
	connectedCallback() {
		this.innerHTML = '<div id="recordLicense"></div>';

		ReactDOM.render(
			<App />,
			document.querySelector('#recordLicense')
		);
	}
}

if (customElements.get('record-license')) {
	console.log(
		'Skipping registration for <record-license> (already registered)'
	);
} else {
	customElements.define('record-license', RecordLicense);
}