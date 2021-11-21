import React, { useState, useEffect, useLayoutEffect } from "react";

import stopwatchStore from "../../store/stopwatch";
import "./styles.css";

const Stopwatch = () => {
	const [stopwatchState, setStopwatchState] = useState(
		stopwatchStore.initialState
	);
	const [timerObject, setTimerObject] = useState(null);
	const [parsedTime, setParsedTime] = useState(""); 
	const [waitClicked, setWaitClicked] = useState(false);
	const [timeoutValue, setTimeoutValue] = useState(false);
	const [timeoutTimer, setTimeoutTimer] = useState(null);

	const startStopwatch = () => {
		clearInterval(timerObject);
		let innerStopwatchValue = stopwatchState.stopwatchValue;
		let stopwatch = setInterval(() => {
			stopwatchStore.setStopped(false);
			stopwatchStore.setStopwatchValue(++innerStopwatchValue);
		}, 1000);
		setTimerObject(stopwatch);
	};

	useLayoutEffect(() => {
		stopwatchStore.subscribe(setStopwatchState);
		stopwatchStore.init();
	}, []);

	useEffect(() => {
		return clearInterval(timerObject);
	}, []);

	const parseStopwatchValue = (value) => {
		let formattedTime = `00:00:${value > 9 ? value : `0${value}`}`;
		if (value > 59) {
			let minutes = Math.floor(value / 60);
			let hours = Math.floor(minutes / 60);
			let seconds = value % 60;
			formattedTime = `${hours > 9 ? hours : `0${hours}`}:${
				minutes > 9 ? minutes : `0${minutes}`
			}:${seconds > 9 ? seconds : `0${seconds}`}`;
		}
		return formattedTime;
	};

	useEffect(() => {
		setParsedTime(parseStopwatchValue(stopwatchState.stopwatchValue));
	}, [stopwatchState.stopwatchValue]);

	useEffect(() => {
		if (stopwatchState.isReseted) {
			startStopwatch();
			stopwatchStore.setReseted(false);
		}
	}, [stopwatchState.isReseted]);

	const handleSwitchStopwatch = () => {
		stopwatchStore.setStopped(!stopwatchState.isStopped);
		if (stopwatchState.isStopped) {
			startStopwatch();
		} else {
			stopwatchStore.setStopwatchValue(0);
			clearInterval(timerObject);
		}
	};

	const handleWait = () => {
		clearInterval(timerObject);
		stopwatchStore.setStopped(!stopwatchState.isStopped);
	};

	const handleTimeout = () => {
		const timeout = setTimeout(() => {
			setTimeoutValue(true);
		}, 300);
		setTimeoutTimer(timeout);
	};

	const setWait = () => {
		if (timeoutValue) {
			clearTimeout(timeoutTimer);
			setTimeoutValue(false);
		}
		if (waitClicked && !timeoutValue) {
			handleWait();
			setTimeoutValue(false);
			setWaitClicked(false);
			clearTimeout(timeoutTimer);
		} else {
			setWaitClicked(true);
			handleTimeout();
		}
	};

	const setReset = () => {
		stopwatchStore.setReseted(!stopwatchState.isStopped);
		stopwatchStore.setStopwatchValue(0);
	};

	return (
		<div className='container'>
			<h2>stopwatch</h2>
			<div className='stopwatch-wrapper'>
				<div>{parsedTime}</div>
				<button onClick={handleSwitchStopwatch} type='button'>
					{stopwatchState.isStopped ? `Start` : `Stop`}
				</button>
				<button onClick={setWait} type='button'>
					Wait
				</button>
				<button onClick={setReset} type='button'>
					Reset
				</button>
			</div>
		</div>
	);
};

export default Stopwatch;
