
 function openUrl(url) {
  window.open(url, '_blank');
}


var visitButton = document.getElementById('visitButton');

// Add click event listener to the button
visitButton.addEventListener('click', function() {
    // Open heatfleet.com in a new tab
    window.open('https://heatfleet.com', '_blank');
});

const url_location = 'https://dev-api.heatfleet.com/api/customer/offer/get-nearest-location';
const url_price_history = 'https://dev-api.heatfleet.com/api/company/account/pricehistory';
const apiKey = 'oiwe43raiasdl4kha6sdf123';



fetch(url_location, {
  headers: {
      'X-Api-Key': apiKey,
      'DAVOS-IsMobile': false,
  }
})
.then(response => {
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  const tickerText = document.querySelector('.ticker-text');

  // Clear existing content
  tickerText.textContent = '';

  let tickerContent = '';

  data.nearestTown.forEach(town => {
      // Extract state_id and price for each town
      const { state_id, price } = town;

      // Add state_id and price to ticker content
      tickerContent += `State ID: ${state_id}, Price: ${price}\n`;
  });

  // Set the ticker content
  tickerText.textContent = tickerContent;
})
.catch(error => {
  console.error('There was a problem with the fetch operation:', error);
});


fetch(url_price_history, {
  headers: {
      'X-Api-Key': apiKey,
      'DAVOS-IsMobile': false,
  }
})
.then(response => {
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  const tickerText = document.querySelector('.historical-price-chart');

  const newArray = data.map(o => {
      const today = new Date(o.date);
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const default_date = `${month}/${day}/${year}`;
      return {
          heatfleet: o.price,
          Date: default_date,
      };
  });

  this.data_res = newArray;
})
.catch(error => {
  console.error('Error fetching data:', error);
});



    // Your JavaScript code for fetching data and creating the line graph goes here
    // const url_price_history = 'https://dev-api.heatfleet.com/api/company/account/pricehistory';
    // const apiKey = 'oiwe43raiasdl4kha6sdf123';

    // Fetch data from the API
    fetch(url_price_history, {
      headers: {
        'X-Api-Key': apiKey,
        'DAVOS-IsMobile': false,
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Parse date strings to Date objects and convert price strings to numbers
      data.forEach(d => {
        d.date = new Date(d.date);
        d.price = +d.price;
      });

      // Calculate the available width and height within the container
      const containerWidth = document.getElementById('line-graph-container').offsetWidth;
      const containerHeight = document.getElementById('line-graph-container').offsetHeight;

      // Set up SVG container dimensions based on available space
      const margin = { top: 20, right: 30, bottom: 30, left: 50 };
      const width = containerWidth - margin.left - margin.right;
      const height = containerHeight - margin.top - margin.bottom;

      // Append SVG to the container
      const svg = d3.select('#line-graph-container').append('svg')
        .attr('width', containerWidth)
        .attr('height', containerHeight)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Set up scales for x and y axes
      const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price)])
        .nice()
        .range([height, 0]);

      // Define the line generator
      const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.price));

      // Draw the line
      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', line);

      // Draw x-axis
      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      // Draw y-axis
      svg.append('g')
        .call(d3.axisLeft(yScale));
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
