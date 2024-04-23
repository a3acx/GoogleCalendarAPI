let htmlContent = ''; // Initialize htmlContent

fetch(`https://www.googleapis.com/calendar/v3/calendars/CALENDAR_ID/events?key=API_KEY`)
  .then(response => response.json())
  .then(data => {
    const events = data.items; // Define events here

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const days = [today, tomorrow, dayAfterTomorrow];

    days.forEach((day, index) => {
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.start.dateTime);
        return eventDate.getDate() === day.getDate() &&
          eventDate.getMonth() === day.getMonth() &&
          eventDate.getFullYear() === day.getFullYear();
      });

      if (dayEvents.length > 0) {
        const dayLabelOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dayLabel = day.toLocaleDateString(undefined, dayLabelOptions);
        let dayHtmlContent = `<h1>${dayLabel}'s Events:</h1>`;

        dayEvents.forEach(event => {
          const start = new Date(event.start.dateTime);
          const end = new Date(event.end.dateTime);
          const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
          const startDate = start.toLocaleDateString(undefined, options);
          const endDate = end.toLocaleDateString(undefined, options);
          const location = event.location || 'Location not provided';
          const description = event.description || 'Description not provided';
          let locationHtml = '';
          if (event.location) {
            const encodedLocation = encodeURIComponent(location);
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
            locationHtml = `<h4>Location: <a href="${googleMapsUrl}" target="_blank">${location}</a></h4>`;
          } else {
            locationHtml = '<h4>Location not provided</h4>';
          }
          dayHtmlContent += `<div class="ind-event"><h2>${event.summary}</h2><h4>${startDate} - ${endDate}</h4>${locationHtml}<h4>Description: ${description}</h4></div>`;
        });

        htmlContent += dayHtmlContent;
      }
    });

    document.getElementById('your-div-id').innerHTML = htmlContent;
  })
  .catch(error => console.log('Error fetching events:', error));
