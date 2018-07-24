var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'KombinAI',
  // App id
  id: 'com.ismailbgr.kombin',
  // Versiyon ?
  version:"1.0.0",

  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [
  {
      name: 'changelog',
      path: '/changelog/',
      url: 'changelog.html',
    },

  
  ],
  
    statusbar: {
    iosOverlaysWebview: true,
  },

 methods: {
    alert: function() {
      app.dialog.alert('Hello World');
    }
  },

  panel: {
    swipe: 'left',
  }

});

          var mainView = app.views.create('.view-main');

//Fonksiyonlar



function sifirla() {
  localStorage.trainingData = [];
  app.dialog.alert('Sıfırlandı',function() {
  location.reload()
  });
  
}





          const color1 = document.querySelectorAll(".color1");
const color2 = document.querySelectorAll(".color2");
const themes = document.getElementById('themes');

window.localStorage.trainingData = window.localStorage.trainingData || JSON.stringify([]);

var currentColors = {
  bir: {},
  iki: {},
}


function saveTrainingData(score) {
  const data = JSON.parse(window.localStorage.trainingData)

  data.push({
    input: [
    Math.round(currentColors.bir.r/2.55) / 100,
      Math.round(currentColors.bir.g/2.55) / 100,
      Math.round(currentColors.bir.b/2.55) / 100,
      Math.round(currentColors.iki.r/2.55) / 100,
      Math.round(currentColors.iki.g/2.55) / 100,
      Math.round(currentColors.iki.b/2.55) / 100,
    ],
    output: [score]
  })

  window.localStorage.trainingData = JSON.stringify(data)


  //predictThemeCombinations()
  generateRandomTheme()
}

function sonuc(){
  app.dialog.preloader("Yükleniyor");
  
  setTimeout(function() {
    predictThemeCombinations()
    app.dialog.close();
  },1000)
  
}

function generateRandomTheme() {
  currentColors.bir = getRandomRgb();
  currentColors.iki = getRandomRgb();

  document.getElementById("color1").style.background = `rgb(${currentColors.bir.r},${currentColors.bir.g},${currentColors.bir.b})`
  document.getElementById("color2").style.background = `rgb(${currentColors.iki.r},${currentColors.iki.g},${currentColors.iki.b})`
}


function getRandomRgb() {
  return {
    r: Math.round(Math.random()*205),
    g: Math.round(Math.random()*205),
    b: Math.round(Math.random()*205),
  }
}


function predictThemeCombinations() {
  const data = JSON.parse(window.localStorage.trainingData)
  if (!data.length) {
    return;
  }

  themes.innerHTML = ""
  const net = new brain.NeuralNetwork({activation: "leaky-relu"});
  const results = []

  net.train(data)

  for (let i = 0; i < 1000000; i++) {
    const one = getRandomRgb()
    const two = getRandomRgb()
    const colors = [
      Math.round(one.r/2.55) / 100,
      Math.round(one.g/2.55) / 100,
      Math.round(one.b/2.55) / 100,
      Math.round(two.r/2.55) / 100,
      Math.round(two.g/2.55) / 100,
      Math.round(two.b/2.55) / 100,
    ]

    const [ score ] = net.run(colors)
    results.push({one, two, score})
  }

  // sort results
  const sortedResults = results.sort(function(a, b) {
    var a = a.score
    var b = b.score

    return b - a
  })

  // keep the top *20* 10 results!
  for (let i = 0; i < 10; i++) {
    addNewTheme(sortedResults[i])
  }



}

function addNewTheme({one, two, score}) {
  const newTheme = document.createElement("div")
  newTheme.classList.add("predicted-theme")
  newTheme.innerHTML = `
  <div class="card">

<div class="card-content">
<div class="color1" style="background:rgb(${one.r}, ${one.g}, ${one.b})"></div>
<div class="color2" style="background:rgb(${two.r}, ${two.g}, ${two.b})"></div

  
  <p>Skor ${score}</p>
  <p>Renk 1: rgb(${one.r}, ${one.g}, ${one.b})</p>
  <p>Renk 2: rgb(${two.r}, ${two.g}, ${two.b})</p>
  
</div>
  </div>
  `
  themes.appendChild(newTheme)
}


generateRandomTheme()
//predictThemeCombinations()
