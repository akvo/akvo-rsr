export const insight = {
  title: '1,6000,000 people gain to sustainable, safer water supplies by 2023',
  items: [
    {
      id: 1,
      type: 'linechart',
      header: '**80%** of the newly constructed/rehabilitated water points in 2019 is still fully functional',
      data: [
        { name: '1', uv: 100, pv: 2400, amt: 2400 },
        { name: '2', uv: 100, pv: 2400, amt: 2400 },
        { name: '3', uv: 80, pv: 2400, amt: 2400 },
        { name: '4', uv: 20, pv: 2400, amt: 2400 },
      ],
      footer: 'Number of water points built in 2019: **13.0000**'
    },
    {
      id: 2,
      type: 'card',
      header: 'Water supply reporting on key narratives and results',
      data: {
        title: 'Burkina Faso - 20 Apr 2021',
        content: 'Daphney Richemond: "In February 2020, UNICEF signed contracts for the construction 200 new latrines in 20 schools. The construction works started in March 2020..."',
        footnote: '25 reports, 5 countries'
      },
      footer: ''
    },
    {
      id: 3,
      type: 'map',
      header: '**1563** communities out of **6000** in 6 countries are externally verified water-safe communities',
      data: {
        setup: {
          container: 'map-water',
          style: 'mapbox://styles/mapbox/outdoors-v11',
          center: [-1.4436870873189491, 16.793408923598406],
          zoom: 3
        },
        features: [
          {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'Point',
              'coordinates': [
                5.486942767494497, 17.95057306941672
              ]
            }
          },
          {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'Point',
              'coordinates': [
                0.6026279693780907, 18.2225478158077
              ]
            }
          },
          {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'Point',
              'coordinates': [
                -1.7084988517151487, 12.169303249150715
              ]
            }
          },
          {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'Point',
              'coordinates': [
                7.342444276572792, 9.830798852474544
              ]
            }
          },
          {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'Point',
              'coordinates': [
                2.435696, 11.2934532
              ]
            }
          },
          {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'Point',
              'coordinates': [
                -5.530862892525761, 7.820103936129115
              ]
            }
          }

        ]
      },
      footer: ''
    },
    {
      id: 4,
      type: 'maparea',
      header: 'Cummulative number of people who gain sustained access to basic, safe water supply disaggregated by sex',
      data: {
        setup: {
          container: 'map-area',
          style: 'mapbox://styles/mapbox/light-v10',
          center: [17.4795173, 4.3525981],
          zoom: 3
        },
        features: []
      },
      footer: ''
    }
  ]
}
