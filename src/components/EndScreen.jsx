function EndScreen({text, score, highScore, difficulty}) {
  return (
    <>
      <h1 className='title'>{text}</h1>
      <div className="score">
        <p>your Score: {score}</p>
        <p>your HighScore: {highScore[difficulty]}</p>
      </div>
    </>
  )
}

export default EndScreen
