function setup() {
  // get number correct
  const { href } = window.location
  const regex = /(?:correct=)(\d)/
  const correct = parseInt(regex.exec(href)[1])
  // setup page
  $('#message').text(correct > 3 ? 'You passed!' : 'You failed.')
  $('#correct').text(correct)
}

setup()
