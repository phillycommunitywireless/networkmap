const innerHtml = ({max, step}) => `
	<input id="timeline-range" type="range" min="0" max=${max} step=${step} />
	<button id="timeline-animate-toggle">Start</button>
	<button id="timeline-reset">Reset</button>
`;

/**
 * Timeline Control which renders a slider input for a given start and end date
 *
 * @export
 * @class TimelineControl
 * @typedef {TimelineControl}
 */
export default class TimelineControl {
	/**
	 * @type {HTMLDivElement} main control element added to the map
	 */
	element;

	/**
	 * @constructor
	 * @param {Object} param0
	 * @param {Date} param0.start
	 * @param {Date} param0.end
	 * @param {string} param0.date_prop_key - key to access date value for each feature
	 * @param {Object[]} param0.feature_set - An array of features, as ingestible
	 * by the map engine, with a property containing a reference date
	 * @param {"exact" | "day" | "month" | "year"} [param0.date_match] - resolution to match against, default "day"
	 * @param {undefined | "day" | "month" | "year"} [param0.step] - scale to use to generate steps, default "day"
	 */
	constructor({
		start,
		end,
		feature_set,
		date_prop_key,
		date_match = 'day',
		step = 'day',
	}) {
		const div = document.createElement('div');
		div.id = 'timeline-control';
		div.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

		const min = 0;
		// calculate max, step, steps

		div.innerHTML = innerHTML({
			min, max, step
		});

		div.addEventListener('contextmenu', (e) => e.preventDefault());
	}

	onAdd(map) {
		return this.element;
	}

	private start() {

	}

	private stop() {

	}
}
