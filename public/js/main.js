fetch('/api/v1/dining-halls')
    .then(response => response.json())
    .then(data => {
        console.log(data);

        for (const item of data.dininghalls) {
          document.querySelector('#output').innerHTML += '<h1>' + item.name + '</h1> <br>';
          document.querySelector('#output').innerHTML += item.hours + "<br>";
          document.querySelector('#output').innerHTML += '<img src="' + item.picture + '"> <br>';
        }

    })
