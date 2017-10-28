/**
 * Question constructor
 * @param {string} prompt The question prompt
 * @param {Array<string>} answers The array of answers
 * @param {number} correctIndex The correct answer index
 */
function Question(prompt, answers, correctIndex) {
  this.prompt = prompt
  this.answers = answers
  this.correctIndex = correctIndex
}

/**
 * Question bank
 */
const questions = [
  new Question(
    'What is the time complexity of the binary search algorithm in Big-O?',
    [
      'O(log\u2082 n)',
      'O(n)',
      '0(n log\u2082 n)',
      'O(1)'
    ],
    0,
  ),
  new Question(
    'Traversing a linked list falls under which of the following time complexities?',
    [
      'constant',
      'linear',
      'quadratic',
      'logarithmic',
    ],
    1
  ),
  new Question(
    'What\'s the difference between <code>null</code> and <code>undefined</code> in JavaScript?',
    [
      '<code>null</code> constitutes empty, <code>undefined</code> constitutes not defined.',
      'They mean the same thing, but <code>null<code> is truthy.',
      'Unwrapping a <code>null</code> value will throw a runtime error, <code>undefined</code> will not.',
      'They mean the same thing, but <code>undefined</code> is truthy.',
    ],
    0
  ),
  new Question(
    'How many bits of percision do JavaScript floating point numbers have?',
    [
      '64 bit',
      '32 bit',
      '128 bit',
      '54 bit',
    ],
    3
  ),
  new Question(
    'What do JQuery methods return?',
    [
      'A <code>boolean</code> describing the success of the method.',
      'Number of milliseconds the DOM manipulation took.',
      'The jquery element instance of the invoked method.',
      'Jquery methods are <code>void</code>.',
    ],
    2
  ),
  new Question(
    'How would one add a method to a core object?',
    [
      '<code>object.methods.push(newMethod)</code>',
      '<code>object.newMethod = newMethod</code>',
      '<code>object.prototype.newMethod = newMethod</code>',
      'You can\'t extend core objects in javascript.',
    ],
    2
  ),
  new Question(
    'In terms of scope, what\'s the difference between <code>let</code>/<code>const</code> and <code>var</code>?',
    [
      '<code>let</code> and <code>const</code> have block level scope, <code>var</code> has function level scope.',
      '<code>let</code> and <code>const</code> have function level scope <code>var</code> has block level scope.',
      '<code>let</code> and <code>const</code> are not valid keywords.',
      'There is no difference.',
    ],
    0
  ),
  new Question(
    'How are primitive types and objects passed to a function as parameters in JavaScript?',
    [
      'Primitive types are passed by reference, objects are passed by value.',
      'Primitive types and objects are passed by reference.',
      'Primitive types and objects are passed by value.',
      'Primitive types are passed by value, objects are passed by reference.',
    ],
    3
  ),
  new Question(
    'How would one go about comparing to objects in JavaScript for equality?',
    [
      'Simply use the <code>===</code> operator.',
      'Sort each key on the objects and compare their key/value pairs one by one.',
      'Simply use the <code>==</code> operator.',
      'Use the <code>Object.prototype.isEqualTo(otherObject)</code> method.',
    ],
    1
  )
]

/**
 * Quiz object
 */
const quiz = {
  correct: 0,
  incorrect: 0,
  questionStack: [],
  currentQuestion: null,
  timer: null,
  timeRemaining: 30,
  elements: {
    self: $('#quiz'),
    timer: $('#timer'),
    prompt: $('#prompt'),
    answers: $('#answers'),
  }
}

/**
 * Setup the quiz
 */
quiz.init = function() {
  this.getRandomQuestions()
  this.setupNextQuestion()
}

/**
 * Attempts to guess the answer
 * @param {number} attempt Index of selection
 */
quiz.attemptAnswer = function(attempt) {
  const { correctIndex } = this.currentQuestion
  const wasCorrect = correctIndex === attempt
  this.next(wasCorrect)
}

/**
 * Continues through quiz
 * @param {boolean} wasCorrect User was correct
 */
quiz.next = function(wasCorrect) {
  // deinit timer
  this.deinitTimer()
  // update score
  if (wasCorrect) {
    this.correct++
    Materialize.toast('Correct!', 500)
  } else {
    this.incorrect++
    Materialize.toast('Incorrect!', 500)
  }
  // continue
  if (this.questionStack.length) {
    this.setupNextQuestion()
  } else {
    this.end()
  }
}

/**
 * setup question
 */
quiz.setupNextQuestion = function() {
  // get next question from the stack
  this.currentQuestion = this.questionStack.pop()
  this.renderQuestionElements()
  this.initTimer()
}

/**
 * Render question elements
 */
quiz.renderQuestionElements = function() {
  console.log(this.currentQuestion)
  const { prompt, answers } = this.currentQuestion
  // change prompt
  this.elements.prompt.html(prompt)
  // change each answer
  this.elements.answers.children().each(function(i) {
    $(this).html(answers[i])
  })
}

/**
 * Gets random 5 questions
 */
quiz.getRandomQuestions = function() {
  const $questions = questions
  for (let i = 0; i < 5; i++) {
    // generate random index
    const rand = Math.floor(
      Math.random() * $questions.length
    )
    // splice item from array
    let question = $questions.splice(rand, 1).pop()
    this.questionStack.push(question)
  }
}

/**
 * Sets up question timer
 */
quiz.initTimer = function() {
  this.timeRemaining = 30
  this.timer = setInterval(
    this.onTick.bind(this),
    1000
  )
}

quiz.onTick = function() {
  // update time remaining
  this.timeRemaining--;
  this.elements.timer.text(`${this.timeRemaining}s`)
  // stop if no time left
  if (this.timeRemaining < 1) {
    this.next()
  }
}

/**
 * Tears down question timer
 */
quiz.deinitTimer = function() {
  clearInterval(this.timer)
}

/**
 * Ends the quiz
 */
quiz.end = function() {
  const { href } = window.location
  const url = href.replace(
    'quiz.html',
    `results.html?correct=${this.correct}`
  )
  window.location.href = url
}

$('.quiz-answer').on('click', function() {
  const index = parseInt(
    $(this).attr('index')
  )
  quiz.attemptAnswer(index)
})

quiz.init()
