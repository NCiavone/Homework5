/*
-----------------------------------------------------------------------------
Name: index.js
Author: @NCiavone
Date Created: 12/2/21
Purpose: The js landing page for the server.
Notes:
    -The noted from this come from fullstack.js from Prof Sen and his 
    recording from Nov. 18th
    -Having SERIOUS issues with having ejs files open and not download

-----------------------------------------------------------------------------
*/


const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const path = require("path");
// Trivia Question Feature
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')


let shuffledQuestions, currentQuestionIndex


const app = new express();
// DataBase Config
const db = createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Rocknroll1!',
   // database: "testDB",
});

// Creating the DB connection
db.connect((err) => {
    if (err) {
      throw err;
    } else {
      console.log(`Successful connected to the DB....`);
    }
  });

//Middleware Function init
//Body Parser!
app.use(json());
app.use(urlencoded({extended:true})); //to parse the HTML form

//Initialize ejs Middleware
app.set('view engine', 'ejs');
app.use(static('public'));

//route <url the client will use and how the server will repons to that url>
app.get('/',(req,res) => {
    res.render('/views/index');
});

app.get('/my_resume',(req,res) => {
  res.render('/html/my_resume');
});

app.get('/my_fun_facts',(req,res) => {
  res.render('/html/my_fun_facts');
});

app.get('/blog',(req,res) => {
  res.render('/html/blog');
});

//Trivia listeners

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
  currentQuestionIndex++
  setNextQuestion()
})

function startGame() {
  startButton.classList.add('hide')
  shuffledQuestions = questions.sort(() => Math.random() - .5)
  currentQuestionIndex = 0
  questionContainerElement.classList.remove('hide')
  setNextQuestion()
}

function setNextQuestion() {
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
  questionElement.innerText = question.question
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    if (answer.correct) {
      button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  })
}

function resetState() {
  clearStatusClass(document.body)
  nextButton.classList.add('hide')
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

function selectAnswer(e) {
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct
  setStatusClass(document.body, correct)
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct)
  })
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide')
  } else {
    startButton.innerText = 'Restart'
    startButton.classList.remove('hide')
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add('correct')
  } else {
    element.classList.add('wrong')
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct')
  element.classList.remove('wrong')
}
// Where you write up the questions
const questions = [
  {
    question: 'Who is the NBA All Time Leading Scorer?',
    answers: [
      { text: 'Michael Jordan', correct: false },
      { text: 'LeBron James', correct: false },
      { text: 'Kareem Abdul-Jabbar', correct: true },
      { text: 'Kobe Bryant', correct: false }
    ]
  },
  {
    question: 'Who has 4x Defensive Players of the Year?',
    answers: [
      { text: 'Ben Wallace', correct: true },
      { text: 'Dwight Howard', correct: false },
      { text: 'Charles Oakley', correct: false },
      { text: 'Gary Payton', correct: false }
    ]
  },
  {
    question: 'What NFL team has never been to a Super Bowl?',
    answers: [
      { text: 'Detroit Lions', correct: true },
      { text: 'Houston Texans', correct: true },
      { text: 'Greenbay Packers', correct: false },
      { text: 'New York Giants', correct: false }
    ]
  },
  {
    question: 'Where do the Detroit Lions play their home games?',
    answers: [
      { text: 'Comerica Park', correct: false },
      { text: 'Ford Field', correct: true },
      { text: 'Little Ceasars Arena', correct: false },
      { text: 'The Big House', correct: false }
    ]
  },
  {
    question: 'Where did the Detroit Pistons play their home games in the 1990s and 2000s?',
    answers: [
      { text: 'Pontiac Silverdome', correct: false },
      { text: 'The Palace of Auburn Hills', correct: true },
      { text: 'Comerica Park', correct: false },
      { text: 'Joe Louis Arena', correct: false }
    ]
  },
  {
    question: 'Where did the Pistons originate from before rellocating in 1957 to Detroit, Michigan?',
    answers: [
      { text: 'New York City, New York', correct: false },
      { text: 'Fort Wayne, Indiana', correct: true },
      { text: 'Chicago,Illinios', correct: false },
      { text: 'Cleveland, Ohio', correct: false }
    ]
  },
  {
    question: 'Which of the four team was a part of the Original Six NHL teams',
    answers: [
      { text: 'Vancouver Jets', correct: false },
      { text: 'Pittsburgh Penguins', correct: false },
      { text: 'Detroit Red Wings', correct: true },
      { text: 'Las Vegas Golden Knights', correct: false }
    ]
  }
]
// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server is running on ${PORT}`));


