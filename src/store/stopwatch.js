import { Subject } from "rxjs";

const initialState = {
	isStopped: true,
	stopwatchValue: 0,
	isPaused: false,
	isReseted: false,
};

let state = initialState;

const subject = new Subject();

const stopwatchStore = {
	init: () => subject.next(state),
	subscribe: (setState) => subject.subscribe(setState),
	setPaused: (isPaused) => {
		state = {
			...state,
			isPaused: isPaused,
		};
		subject.next(state);
	},
	setStopped: (isStopped) => {
		state = {
			...state,
			isStopped: isStopped,
		};
		subject.next(state);
	},
	setReseted: (isReseted) => {
		state = {
			...state,
			isReseted: isReseted,
		};
		subject.next(state);
	},
	setStopwatchValue: (value) => {
		state = {
			...state,
			stopwatchValue: value,
		};
		subject.next(state);
	},
  initialState
};

export default stopwatchStore;
