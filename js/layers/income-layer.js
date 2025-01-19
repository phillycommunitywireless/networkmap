import {
	createRangeColorExpression,
	currencyFormatter,
	fetchJSON,
	generateCentroids,
	generateLabelFromNeighborhood,
	getZoneId,
} from '../util/util.js';

export default async () => {
	const data_url = '/data/income-inequality.geojson';
	const data = await fetchJSON(data_url);
	const centroids = generateCentroids(data, 'spatial_id', getZoneId);
	const centroidDict = centroids.reduce((acc, c) => {
		acc[c.properties.id] = c;
		return acc;
	}, {});
	const colorExpression = createRangeColorExpression(
		data,
		'median_household_income'
	);

	map.addSource('income-source', {
		type: 'geojson',
		data,
	});

	map.addLayer({
		id: 'income-layer',
		type: 'fill',
		source: 'income-source',
		layout: {
			visibility: 'none',
		},
		paint: {
			'fill-color': colorExpression,
			'fill-opacity': 0.25,
		},
		filter: ['==', '$type', 'Polygon'],
	});

	const managePopup = ({
		baseLabel = 'income',
		onCloseLabel = '',
		popupLayerLabel = '',
		popupCheckboxLabel = '',
		popupHtml = () => ''
	}) => {};
	let currentPopup = null;
	let currentFeatureId = null;
	const cleanupPopup = () => {
		currentPopup?.remove();
		currentPopup = null;
		currentFeatureId = null;
	};

	map.on('close-income-popup', cleanupPopup);

	const handlePopup = (e) => {
		const [feature] = map.queryRenderedFeatures(e.point, {
			layers: ['income-layer'],
		});

		if (feature) {
			const incomeValue = feature.properties.median_household_income;
			const featureId = feature.properties.spatial_id;

			if (!document.getElementById('show-income-popup').checked) {
				return;
			}

			if (currentFeatureId !== featureId) {
				const featureCentroid = centroidDict[featureId];
				if (!currentPopup) {
					currentPopup = new mapboxgl.Popup({
						anchor: 'bottom',
						closeOnClick: false,
					});
					currentPopup.on('close', () => {
						currentPopup = null;
					});

					currentPopup.addTo(map);
				}

				const useLabel = generateLabelFromNeighborhood(feature, e);
				const formattedIncome = incomeValue
					? currencyFormatter.format(incomeValue)
					: 'Unknown';
				currentPopup
					.setLngLat(featureCentroid?.geometry.coordinates || e.lngLat)
					.setHTML(
						`<strong>Area:</strong> ${useLabel}<br>
                     <strong>Median Household Income:</strong> ${formattedIncome}`
					);

				currentFeatureId = featureId;
			}
		} else if (!feature && currentFeatureId && currentPopup) {
			cleanupPopup();
		}

		map.getCanvas().style.cursor = feature ? 'pointer' : '';
	};

	map.on('mousemove', 'income-layer', handlePopup);
	map.on('touchstart', 'income-layer', handlePopup);
	map.on('mouseleave', 'income-layer', (e) => {
		// close any open popup on leaving the parent layer
		const features = map.queryRenderedFeatures(e.point, {
			layers: ['income-layer'],
		});
		if (!features.length) {
			map.fire('close-income-popup');
		}
	});
};
