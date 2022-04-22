import  ReactDOM  from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import ClayAlert from '@clayui/alert';
import ClayButton from '@clayui/button';
import ClayCard from "@clayui/card";
import ClayForm, {ClayInput} from '@clayui/form';
import ClayLabel from '@clayui/label';
import ClayLayout from "@clayui/layout";
import { ClayRadioGroup, ClayRadio } from "@clayui/form";

import './App.css';
import "@clayui/css/lib/css/atlas.css";

const spritemap = "https://cdn.jsdelivr.net/npm/@clayui/css/lib/images/icons/icons.svg";

const {Liferay} = window;

const POINTS_CORRECT_ANSWER = 10;
const POINTS_PER_HINT = 5;
const UPDATE_DRIVING_LICENSE_TEST_SCORE = 'updateDrivingLicenseTestScore';

function App() {
	const [currentQuestionPosition, setCurrentQuestionPositionPosition] = useState(0);
	const [playerName, setPlayerName] = useState("");
	const [questions, setQuestions] = useState([]);
	const [score, setScore] = useState(0);
	const [showError, setShowError] = useState(false);
	const [showHint, setShowHint] = useState(false);
	const [showScore, setShowScore] = useState(false);
	const [selectedAnswer, setSelectedAnswer] = useState('');

	const playerNameInputRef = useRef();

	const handleAnswerClicked = (correctAnswer) => {
		if (correctAnswer === selectedAnswer.slice(-1)) {
			setScore(score + POINTS_CORRECT_ANSWER);
		}

		if (currentQuestionPosition + 1 < questions.length) {
			setCurrentQuestionPositionPosition(currentQuestionPosition + 1);
		}
		else {
			setShowScore(true);
		}

		setSelectedAnswer('');
		setShowHint(false);
	}

	function handleHint () {
		setShowHint(true);
		setScore(score - POINTS_PER_HINT);
	}

	useEffect(() => {
		Liferay.Util.fetch("/o/c/drivinglicenses")
		.then((response) => response.json())
		.then(({items}) => {
			setQuestions(items);
		});
	},[]);

	useEffect(() => {
		Liferay.fire(UPDATE_DRIVING_LICENSE_TEST_SCORE, {playerName, score});
	}, [score]);

	return (
		<div className="App">
	  		{!playerName &&(
				<div className='initial-state'>
					<div className="typewriter">
						<h1>WELCOME TO THE SPACESHIPS DRIVING TEST</h1>
					</div>

					<ClayForm className='input-form'>
						<ClayForm.Group small>
							<ClayInput
								id="basicInputText"
								placeholder="Insert your name here"
								ref={playerNameInputRef}
								type="text"
							/>
						</ClayForm.Group>
			
						<ClayButton
							className="starting-button"
							disabled={questions.length === 0}
							spritemap={spritemap}
							onClick={() => {
								if (playerNameInputRef.current.value === "") {
									setShowError(true);
								}
								else {
									setPlayerName(playerNameInputRef.current.value);
								}
							}}
						>
							{questions.length === 0 ?
							(
								<>Loading...</>
							):
							(
								<>Let's Start</>
							)}
						</ClayButton>
					</ClayForm>
				</div>
	  		)}

			{playerName && !showScore && (
				<div className='card-container'> 
					<ClayLayout.ContainerFluid>
						<ClayLayout.Row justify="center">
							<ClayCard>
								<ClayCard.Body>
									<ClayCard.Description
										displayType="title"
										style={{fontSize: 20, marginBottom:20}}
									>
										{questions[currentQuestionPosition].question}
									</ClayCard.Description>
						
									<ClayCard.Description 
										displayType="text"
										truncate={false}
									>
										<ClayRadioGroup
											onSelectedValueChange={val => setSelectedAnswer(val)}
											selectedValue={selectedAnswer}
										>
											<ClayRadio
												label={questions[currentQuestionPosition].optionA}
												value="A"
											/>
											<ClayRadio
												label={questions[currentQuestionPosition].optionB}
												value="B"
											/>
											<ClayRadio
												label={questions[currentQuestionPosition].optionC}
												value="C"
											/>
										</ClayRadioGroup>
									</ClayCard.Description>

									<ClayButton
										onClick={() => {
											handleAnswerClicked(questions[currentQuestionPosition].correctAnswer.name);
										}}
									>
										{currentQuestionPosition < questions.length - 1 ? 'Next' : 'Finish'}
									</ClayButton>

									<ClayButton
										className='ml-2'
										displayType='secondary'
										onClick={handleHint}
									>
										Hint
									</ClayButton>
						
									{showHint && (
										<ClayCard.Caption>
											<ClayLabel
												displayType="success"
												style={{fontSize:12, marginTop: 20}}
											>
												{questions[currentQuestionPosition].hint}
											</ClayLabel>
										</ClayCard.Caption>
									)}
								</ClayCard.Body>
							</ClayCard>
						</ClayLayout.Row>
		  			</ClayLayout.ContainerFluid>
				</div>
			)}

			{showScore && (
				<div className='initial-state'>
					<div className="typewriter">
						<h1>CONGRATS! YOUR QUIZ HAS BEEN SENT</h1>
					</div>
				</div>
			)}

			{showError && (
				<ClayAlert.ToastContainer>
					<ClayAlert
						autoClose={5000}
						displayType="danger"
						onClose={() => {
							setShowError(false);
						}}
						spritemap={spritemap}
						title="Error:"
					>
						Please, insert a valid name
					</ClayAlert>
				</ClayAlert.ToastContainer>
			)}
		</div>
	);
}

class DrivingLicense extends HTMLElement {
	connectedCallback() {
		this.innerHTML = '<div id="drivingLicense"></div>';

		ReactDOM.render(
			<App />,
			document.querySelector('#drivingLicense')
		);
	}
}

if (customElements.get('driving-license')) {
	console.log(
		'Skipping registration for <driving-license> (already registered)'
	);
} else {
	customElements.define('driving-license', DrivingLicense);
}

