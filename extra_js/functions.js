
  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  function makeArray(prob, ntrials, maxConsec, winValue, lossValue) {
    var n = (maxConsec / prob) / 2;
    var loop = ntrials / n;

    var array = []

    for (let step = 0; step < loop; step++) {
      var win = new Array(Math.round(n * prob)).fill(winValue);
      var loss = new Array(Math.round(n * (1 - prob))).fill(lossValue);
      var concatArray = [];
      var concatArray = win.concat(loss);
      shuffle(concatArray);
      array = array.concat(concatArray);
    }

    // if(array.length === ntrials){
    return array
    // } else {
    //     console.log("Array length is not equal to the specified number of trials")
    // }

  };

  //ntrials must be divisible by maxConsec and maxConsec must be an even number
  function makeImList(ntrials, maxConsec) {
    // because the arrays sit back to back, the max in each mini block must contain 
    // half the max consec allowed in the full array for each condition
    var n = maxConsec/2;
    
    // each mini block contains n of order 1 and n of order 2, so 2*n trials total
    // this means we need to loop through ntrials/n/2 times 
    
    var loop = ntrials/n/2;
    var array = []
    
    for (let step = 0; step < loop; step++) {
      var order1 = new Array(n).fill({left: "fractal1.jpg", right: "fractal2.jpg"});
      var order2 = new Array(n).fill({left: "fractal2.jpg", right: "fractal1.jpg"});
      var concatArray = order1.concat(order2);
      shuffle(concatArray);
      array = array.concat(concatArray);
    }
    return array
  }

//   function imageShuffle() {
//     var stimuliImages = ["fractal1.jpg", "fractal2.jpg"];
//     var order = ['', '']
//     var rand = Math.random();
//     if (rand <= 0.5) {
//       order = [0, 1];
//     } else {
//       order = [1, 0];
//     }
//     return {
//       left: stimuliImages[order[0]],
//       right: stimuliImages[order[1]]
//     };
//   };


  function checkReversal(reversalProb) {
    if (reversalProb > 0) {
      var prob = reversalProb / 10;
      var rand = Math.random();

      if (prob >= rand) {
        var reverse = true;
      } else {
        var reverse = false;
      }
    } else {
      var reverse = false;
    }

    return reverse;
  };

  function initReversal(reversalProb, reverse, correctImage) {
    if (reversalProb > 0) {
      if (reverse === true) {
        correctImage = (correctImage * -1) + 3;
      }
    }
    return correctImage;
  };

  function setReversal(interval, diff, n) {
    var output = [];
    for (i = 1; i <= n; i++) {
      var min = Math.ceil(i*interval-diff);
      var max = Math.floor(i*interval+diff);
      var trial = Math.floor(Math.random() * (max - min + 1) + min);
      output.push(trial)
    }
    return output
  };
