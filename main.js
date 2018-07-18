var population,
  goal = new p5.Vector(400, 10),
  obstacles = [],
  populationSize = 1500,
  speed = 3,
  maxInstructions = 500,
  hasReachedGoal = false,
  onlyShowBest = false,
  onlyShowBestCheckbox, speedP, speedSlider, populationSizeP, populationSizeSlider, maxInstructionsP, maxInstructionsSlider,
  infoP,
  bestPath = [];

// if set to true, will give first best dot already discovered almost-optimal directions
var USE_OPTIMIZED_DIRECTIONS = true;

var configChanged = function() {
  onlyShowBest = onlyShowBestCheckbox.checked();
  speed = speedSlider.value();
  speedP.html('Speed: ' + speed);
  populationSize = populationSizeSlider.value();
  populationSizeP.html('Population Size: ' + populationSize);
  maxInstructions = maxInstructionsSlider.value();
  maxInstructionsP.html('Max Instructions: ' + maxInstructions);
}

function setup() {
  createCanvas(800, 800);
  population = new Population(populationSize);

  if (USE_OPTIMIZED_DIRECTIONS) {
    // from 217_step_dot_directions.js
    var optimizedDotDirections = [];
    for (var i = 0; i < steps217DotDirections.length; i++) {
      let v = steps217DotDirections[i];
      optimizedDotDirections.push(createVector(v.x, v.y, v.z));
    }
    population.dots[0].brain.directions = optimizedDotDirections;
    population.dots[0].isBest = true;
  }

  // info
  infoP = createP('Generation: ' + population.gen);

  // config
  speedP = createP('Speed: ' + speed);
  speedSlider = createSlider(1, 50, speed);
  speedSlider.changed(configChanged);

  populationSizeP = createP('Population Size: ' + populationSize);
  populationSizeSlider = createSlider(1, 10000, populationSize);
  populationSizeSlider.changed(configChanged);

  maxInstructionsP = createP('Max Instructions: ' + maxInstructions);
  maxInstructionsSlider = createSlider(200, 10000, maxInstructions);
  maxInstructionsSlider.changed(configChanged);

  onlyShowBestCheckbox = createCheckbox('Only Show Best', onlyShowBest);
  onlyShowBestCheckbox.changed(configChanged);

  // obstacles
  obstacles.push(new Obstacle(0, 100, 100, 10));
  obstacles.push(new Obstacle(200, 100, 400, 10));
  obstacles.push(new Obstacle(700, 100, 100, 10));
  obstacles.push(new Obstacle(100, 200, 600, 10));
  obstacles.push(new Obstacle(0, 300, 100, 10));
  obstacles.push(new Obstacle(200, 300, 400, 10));
  obstacles.push(new Obstacle(700, 300, 100, 10));
  obstacles.push(new Obstacle(100, 400, 600, 10));
}

function draw() {
  background(51);

  // info
  infoP.html('Generation: ' + population.gen);

  // draw goal
  fill(255, 0, 0);
  ellipse(goal.x, goal.y, 10, 10);

  // draw obstacle(s)
  fill(0, 150, 150);

  for (var i = 0; i < obstacles.length; i++) {
    rect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
  }

  if (population.allDotsDead()) {
    // genetic algorithm
    population.calculateFitness();
    population.naturalSelection();
    population.mutateOffspring();
    bestPath = [];
  } else {
    // if any of the dots are still alive then update and then show them
    for (var i = 0; i < speed; i++) {
      population.update();
      if (population.gen > 1) {
        let bestDotPos = population.dots[0].pos;
        bestPath.push(createVector(bestDotPos.x, bestDotPos.y));
      }
    }

    population.show();

    if (population.gen > 1) {
      beginShape();
      stroke(0, 255, 0, 25);
      noFill();
      for (var pos of bestPath) {
        vertex(pos.x, pos.y);
      }
      endShape();
    }
  }
}
