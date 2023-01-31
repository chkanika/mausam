async function dothis() {
    console.log("aaj barish aari hai");

    let countries_data= []

//2aa2387eb5c648b5b6b232109232801
    let countries=  ["Arab", "Bengal", "Bulgaria", "China", "Czech", "Dutch", "United Kingdom", "Finland", "India", "United States of America"];
    for (let i = 0; countries.length > i; i++) {
        console.log(i);
        console.log(countries[i])
        let response = await fetch(`http://api.weatherapi.com/v1/current.json?key=2aa2387eb5c648b5b6b232109232801&q=${countries[i]}&aqi=no`)
        response = await response.json();

        countries_data.push(response)
    }
    console.log(countries_data)
    setup()
}

function setup() {
    let myCanvas = createCanvas(600, 400);
    myCanvas.parent('myContainer');
  }
