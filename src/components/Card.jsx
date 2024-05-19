import './Card.css'

function Card({obj, score, setScore, cards, setCards, setLose}) {
  function handleClick() {
    if(obj.clicked) {
      setLose(true)
    } else {
      setScore(score + 1)

      let temp = cards
      temp[obj.id].clicked = true

      setCards(temp)
    }
  }

  return (
    <div className="card" onClick={handleClick}>
      <img src={obj.image} />
      <p>{obj.name}</p>
    </div>
  )
}

export default Card
