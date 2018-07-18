function Brain(size) {
  // series of vectors which get the dot to the goal (hopefully)
  this.directions = [];
  this.step = 0;

  // sets all the vectors in directions to a random vector with length 1
  this.randomize = function () {
    this.directions = [];
    for (var i = 0; i < size; i++) {
      var randomAngle = random(2*PI);
      this.directions.push(p5.Vector.fromAngle(randomAngle));
    }
  }

  this.randomize();

  // returns a perfect copy of this brain object
  this.clone = function () {
    // set clone to max instructions in case change config in middle of simulation
    var clone = new Brain(maxInstructions);
    for (var i = 0; i < this.directions.length; i++) {
      clone.directions[i] = this.directions[i].copy();
    }

    return clone;
  }

  // mutates the brain by setting some of the directions to random vectors
  this.mutate = function () {
    // chance that any vector in directions gets changed
    var mutationRate = 0.01;
    for (var i = 0; i < this.directions.length; i++) {
      var rand = random(1);
      if (rand < mutationRate) {
        // set this direction as a random direction
        var randomAngle = random(2*PI);
        this.directions[i] = p5.Vector.fromAngle(randomAngle);
      }
    }
  }
}