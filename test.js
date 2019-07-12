const FuzzySet = require('fuzzyset.js')

const fuzzySet = FuzzySet(['story', 'bug', 'open', 'planned', 'in progress', 'Q&A', 'QA passed', 'done', 'closed'])

const transcription = ['stairs', '5674', 'bag', 'opan', 'plant']

transcription.forEach((word, index) => {
  transcription[index] = fuzzySet.get(word)[0][1]
})

console.log(transcription)
