import './App.css'
import Card from './components/Card.jsx'
import { useEffect } from 'react'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import EndScreen from './components/EndScreen.jsx'

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function App() {
  let [cards, setCards] = useState([])
  let [difficulty, setDifficulty] = useState(null)
  let [score, setScore] = useState(0)
  let [highScore, setHighScore] = useState(new Array(0, 0, 0))
  let [lose, setLose] = useState(false)
  let cardElements = []

  useEffect(() => {
    (async () => {
      console.log(difficulty)
      if(difficulty == null) {
        return
      }

      let request = await getData(difficulty)

      setCards(request)
    })()
  }, [difficulty])

  function handleClick(id) {
    setDifficulty(id)
  }

  function handleClick2() {
    setCards([])
    setDifficulty(null)
    setLose(false)
    setScore(0)
  }

  for(let i of cards) {
    cardElements.push(<Card key={uuidv4()} obj={i} score={score} setScore={setScore} cards={cards} setCards={setCards} setLose={setLose}></Card>)
  }
  shuffleArray(cardElements)

  let diff = (difficulty + 1) * 4 + 1

  if(score == diff && difficulty != null) {
    checkHighScore(score, highScore, difficulty, setHighScore)

    return (
      <div className='container'>
        <EndScreen text="You Win" score={score} highScore={highScore} difficulty={difficulty} />
        <button className='restart' onClick={handleClick2}>Restart</button>
      </div>
    )
  }

  if(difficulty == null) {
    return (
      <>
        <h1 className='title'>Memory Card</h1>
        <div className='btns'>
          <button id='easy' onClick={() => handleClick(0)}>easy</button>
          <button id='normal' onClick={() => handleClick(1)}>normal</button>
          <button id='hard' onClick={() => handleClick(2)}>hard</button>
        </div>
        <div className='score-board'>
          <p>Easy HighScore: {highScore[0]}</p>
          <p>Normal HighScore: {highScore[1]}</p>
          <p>Hard HighScore: {highScore[2]}</p>
        </div>
      </>
    )

  } else if (lose) {
    return (
      <div className='container'>
        <EndScreen text="You Lose" score={score} highScore={highScore} difficulty={difficulty} />
        <button onClick={handleClick2}>Restart</button>
      </div>
    )

  } else {
    checkHighScore(score, highScore, difficulty, setHighScore)

    return (
      <>
        <div className='score'>
          <p>Score: {score}</p>
          <p>HighScore: {highScore[difficulty]}</p>
        </div>
        <div className='card-container'>
          {cardElements}
        </div>
      </>
    )
  }
}

function checkHighScore(score, highScore, difficulty, setHighScore) {
  if(score > highScore[difficulty]) {
    let temp = highScore
    temp[difficulty] = score
    console.log(highScore)

    setHighScore(temp)
  }
}

async function getData(dif) {
  try {
    let cardCount = (dif+1) * 4 + 1
    let pokemons = []

    let i = 0;
    let randomNums = []

    while (i < cardCount) {
      let rand = Math.ceil(Math.random() * 200)

      if(!randomNums.includes(rand)) {
        pokemons.push(fetchData(rand))
        randomNums.push(rand)
        i++;
      }
    }

    const result = await Promise.all(pokemons);
    return result.map((e, index) => new Object({"id": index, "name": e.name, "image": e.image, "clicked": false}));

  } catch(err) {
    console.log("error:" + err)
  }
}

async function fetchData(rand) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${rand}`)
  let data = await response.json()

  return {name: data.name, image: data.sprites.front_default}
}

export default App
