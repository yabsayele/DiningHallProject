fetch('/api/v1/user-infos')
    .then(response => response.json())
    .then(data => {
        console.log(data);

        for (const item of data.userinfos) {
          document.querySelector('#output').innerHTML += '<h1>' + item.user + '</h1> <br>';
          document.querySelector('#output').innerHTML += item.mealplan + "<br>";
          document.querySelector('#output').innerHTML += item.mealspecifications + '<br>';
        }

    })
