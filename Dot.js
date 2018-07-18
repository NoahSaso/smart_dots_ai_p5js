function Dot() {
  // start the dots at the bottom of the window with no velocity or acceleration
  this.pos = new p5.Vector(width / 2, height - 10);
  this.vel = new p5.Vector(0, 0);
  this.acc = new p5.Vector(0, 0);
  this.brain = new Brain(maxInstructions);
  this.dead = false;
  this.reachedGoal = false;
  this.isBest = false; // true if this dot is the best dot from the previous generation
  this.fitness = 0;

  // draws the dot on the screen
  this.show = function() {
    // if this dot is the best dot from the previous generation then draw it as a big green dot
    if (this.isBest) {
      fill(0, 255, 0);
      ellipse(this.pos.x, this.pos.y, 8, 8);
    } else {
      // all other dots are just smaller white dots
      fill(255);
      ellipse(this.pos.x, this.pos.y, 4, 4);
    }
  }

  // moves the dot according to the brains directions
  this.move = function() {
    if (this.brain.directions.length > this.brain.step) {
      // if there are still directions left then set the acceleration as the next vector in the directions array
      this.acc = this.brain.directions[this.brain.step];
      this.brain.step++;
    } else {
      // if at the end of the directions array, then the dot is dead
      this.dead = true;
    }

    // apply the acceleration and move the dot
    this.vel.add(this.acc);
    // not too fast
    this.vel.limit(5);
    this.pos.add(this.vel);
  }

  // calls the move function and check for collisions and stuff
  this.update = function() {
    if (!this.dead && !this.reachedGoal) {
      this.move();
      if (this.pos.x < 2 || this.pos.y < 2 || this.pos.x > width - 2 || this.pos.y > height - 2) { // if near the edges of the window then kill it
        this.dead = true;
      } else if (dist(this.pos.x, this.pos.y, goal.x, goal.y) < 5) { // if reached goal
        this.reachedGoal = true;
        if (!hasReachedGoal) {
          hasReachedGoal = true;
          onlyShowBestCheckbox.checked(true);
          onlyShowBest = true;
        }
      } else if (this.hitObstacle()) {
        this.dead = true;
      }
    }
  }

  // loops through obstacle array and returns if within bounds of any of them
  this.hitObstacle = function() {
    for (var i = 0; i < obstacles.length; i++) {
      var o = obstacles[i];
      if (this.pos.x > o.x && this.pos.x < o.x + o.width && this.pos.y > o.y && this.pos.y < o.y + o.height) {
        return true;
      }
    }
    return false;
  }


  // calculates the fitness
  this.calculateFitness = function() {
    if (this.reachedGoal) {
      // if the dot reached the goal, give fitness boost (1/16) and then the fitness is based on the amount of steps it took to get there
      this.fitness = 1.0/16.0 + 10000.0/(float)(this.brain.step * this.brain.step);
    } else {
      // if the dot didn't reach the goal then the fitness is based on how close it is to the goal
      var distanceToGoal = dist(this.pos.x, this.pos.y, goal.x, goal.y);
      this.fitness = 1.0/(distanceToGoal * distanceToGoal);
    }
  }

  // clone it
  this.getOffspring = function() {
    var child = new Dot();
    child.brain = this.brain.clone(); // child has same brain as parent
    return child;
  }
}
