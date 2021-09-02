fetch('/api/v1/menu-options')
    .then(response => response.json())
    .then(data => {
        console.log(data);

        for (const item of data.menuoptions) {
          document.querySelector('#output').innerHTML += '<h1>' + item.item + '</h1> <br>';
          document.querySelector('#output').innerHTML += item.ingredients + "<br>";
          document.querySelector('#output').innerHTML += item.dininghall + '<br>';
        }

    })
