import {
	assignFeatureID,
	createRandomColorExpression,
	fetchJSON,
	generateCentroids,
} from '../util/util.js';

export default async () => {
	const data_url = '/data/expanded-neighborhood-data.geojson';
	const data = await fetchJSON(data_url).then((d) => assignFeatureID(d));
	const centroids = generateCentroids(data, 'id', 'name');
	const colorExpression = createRandomColorExpression(data, 'id');

	map.addSource('exp-neighborhood-source', {
		type: 'geojson',
		data,
	});
	map.addSource('exp-neighborhood-centroids', {
		type: 'geojson',
		data: {
			type: 'FeatureCollection',
			features: centroids,
		},
	});

	// add fill layer
	map.addLayer({
		id: 'exp-neighborhood-fill-layer',
		type: 'fill',
		source: 'exp-neighborhood-source',
		// layout: {
		// 	visibility: 'none',
		// },
		paint: {
			'fill-color': colorExpression,
			'fill-opacity': 0.25,
		},
		filter: ['==', '$type', 'Polygon'],
	});
	// add outline layer
	map.addLayer({
		id: 'exp-neighborhood-outline-layer',
		type: 'line',
		source: 'exp-neighborhood-source',
		// layout: {
		// 	visibility: 'none',
		// },
		paint: {
			'line-color': 'lightblue',
			'line-width': 1,
		},
		filter: ['==', '$type', 'Polygon'],
	});
	// add label layer
	map.addLayer({
		id: 'exp-neighborhood-labels',
		type: 'symbol',
		source: 'exp-neighborhood-centroids',
		layout: {
			'text-field': ['get', 'label'], // Use the 'label' property for text
			'text-size': 14,
			'text-anchor': 'center',
			// visibility: 'none',
		},
		paint: {
			'text-color': '#ffffff',
			'text-halo-color': '#000000',
			'text-halo-width': 1.5,
			'text-halo-blur': 0.5,
		},
	});
};
