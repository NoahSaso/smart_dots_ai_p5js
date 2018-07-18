function Population(size) {
  this.dots = [];
  this.fitnessSum = 0.0;
  this.gen = 1;
  // the index of the best dot in the dots[]
  this.bestDot = 0;
  this.minStep = 1000;

  for (var i = 0; i < size; i++) {
    this.dots.push(new Dot());
  }

  // show all dots
  this.show = function() {
    // only show other dots if best hasn't made it yet or manually enabled
    // onlyShowBest is automatically enabled when at least one dot (the best) reaches the target
    // but can be manually enabled or disabled with the checkbox anytime
    if (!onlyShowBest) {
      for (var i = 1; i < this.dots.length; i++) {
        this.dots[i].show();
      }
    }
    this.dots[0].show();
  }

  // update all dots
  this.update = function() {
    for (var i = 0; i < this.dots.length; i++) {
      if (this.dots[i].brain.step > this.minStep) {
        // if the dot has already taken more steps than the best dot has taken to reach the goal
        this.dots[i].dead = true;
      } else {
        this.dots[i].update();
      }
    }
  }

  // calculate all the fitnesses
  this.calculateFitness = function() {
    for (var i = 0; i < this.dots.length; i++) {
      this.dots[i].calculateFitness();
    }
  }


  // returns whether all the dots are either dead or have reached the goal
  this.allDotsDead = function() {
    for (var i = 0; i < this.dots.length; i++) {
      if (!this.dots[i].dead && !this.dots[i].reachedGoal) {
        return false;
      }
    }
    return true;
  }


  // gets the next generation of dots
  this.naturalSelection = function() {
    var newDots = []; // next gen
    this.setBestDot();
    this.calculateFitnessSum();

    // the champion lives on
    newDots[0] = this.dots[this.bestDot].getOffspring();
    newDots[0].isBest = true;
    // only do it as many times as the new population size (-1 because already added 1 best)
    for (var i = 1; i < populationSize - 1; i++) {
      // select parent based on fitness
      let parent = this.selectParent();
      // get child from them
      newDots.push(parent.getOffspring());
    }

    this.dots = newDots.slice();
    this.gen++;
  }


  // add all fitnesses together
  this.calculateFitnessSum = function() {
    this.fitnessSum = 0;
    for (var i = 0; i < this.dots.length; i++) {
      this.fitnessSum += this.dots[i].fitness;
    }
  }

  // chooses dot from the population to return randomly (considering fitness)
  // this function works by randomly choosing a value between 0 and the sum of all the fitnesses
  // then go through all the dots and add their fitness to a running sum and if that sum is greater than the random value generated that dot is chosen
  // since dots with a higher fitness function add more to the running sum then they have a higher chance of being chosen
  this.selectParent = function() {
    var rand = random(this.fitnessSum);

    var runningSum = 0;

    for (var i = 0; i < this.dots.length; i++) {
      runningSum += this.dots[i].fitness;
      if (runningSum > rand) {
        return this.dots[i];
      }
    }

    // should never get to this point
    return null;
  }

  // mutates all the brains of the offspring
  this.mutateOffspring = function() {
    for (var i = 1; i < this.dots.length; i++) {
      this.dots[i].brain.mutate();
    }
  }

  // finds the dot with the highest fitness and sets it as the best dot
  this.setBestDot = function() {
    var max = 0,
      maxIndex = 0;
    for (var i = 0; i < this.dots.length; i++) {
      if (this.dots[i].fitness > max) {
        max = this.dots[i].fitness;
        maxIndex = i;
      }
    }

    this.bestDot = maxIndex;

    // if this dot reached the goal then reset the minimum number of steps it takes to get to the goal
    if (this.dots[this.bestDot].reachedGoal) {
      this.minStep = this.dots[this.bestDot].brain.step;
      console.log("minStep:", this.minStep);
    }
  }
}
