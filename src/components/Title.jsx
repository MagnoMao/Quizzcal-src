import React from 'react'
import './title.css'

export default function Title(props){
    const [category, setCategory] = React.useState()
    const [triviaAmount, setTriviaAmount] =  React.useState(10)
    const [error, setError] = React.useState()

    React.useEffect(() => {
        //The quizz questions can be filtered by category
        //Let's get a list of the possible categories the API have available
        fetch('https://opentdb.com/api_category.php')
        .then(data => data.json())
        .then(data => {
            setCategory(() => {
                //Sort the categories in alphabetical order
                const sortWords = (a,b) => {
                    if(a.name > b.name) return 1
                    else if(a.name < b.name) return -1
                    else return 0
                }
                data.trivia_categories.sort(sortWords)

                //Create the array of React elements categories
                const categoriesArray = data.trivia_categories.map(elem => {
                    return <option 
                    value={elem.id} 
                    key={elem.name}>
                        {elem.name}
                    </option>
                })
                
                //Create the default category and set it at the start of the array
                const optionAny = <option value='' key='Any Category'>Any Category</option>
                return [optionAny, ...categoriesArray]
            }
            )
        })
    }, [])

    function handleTriviaAmount(event){
        //The max amount of questions the API allows is 50 per request
        // const number =  event.target.value > 50 ? 50 : event.target.value
        console.log(this)
        let number = event.target.value
        if(number < 1) number = 1
        else if(number > 50) number = 50

        setTriviaAmount( () => number)
    }

    function startClick(event){
        if(error) setError()
        event.preventDefault()
        //Assemble the API URL
        let quizzFetchUrl = 'https://opentdb.com/api.php?amount=' + document.getElementById('trivia_amount').value

        const categoryValue = document.getElementById('trivia_category').value
        quizzFetchUrl += categoryValue ? '&category=' + categoryValue : ''

        const difficultyValue = document.getElementById('trivia_difficulty').value
        quizzFetchUrl += difficultyValue ? '&difficulty=' + difficultyValue : ''

        const typeValue = document.getElementById('trivia_type').value
        quizzFetchUrl += typeValue ? '&type=' + typeValue : ''
        
        fetch(quizzFetchUrl)
        .then( data => {
            console.log(data)
            return data.json()})
        .then( quizz => {
            if(quizz.response_code === 1) setError(<h2 className='error'>There are not enough questions for the given filters</h2>)
            else props.startQuizz(quizz.results)})

    }

    
    return (
    <div className="title">
        <h1>Quizzical</h1>
        <h2 className='title-desc'>A quizz generator by Magno</h2>

        <form action="" className="form-quizz-options">

            <label htmlFor="trivia_amount">Number of Questions:</label>
            <input
                type="number"
                name="trivia_amount"
                id="trivia_amount"
                min="1"
                max="50"
                value={triviaAmount}
                onChange={function (event){ handleTriviaAmount(event)}} />


            <label htmlFor="trivia_category">Select Category: </label>
            <select name="trivia_category" id='trivia_category'>
                {category}
            </select>


            <label htmlFor="trivia_difficulty">Select Difficulty: </label>
            <select name="trivia_difficulty" id='trivia_difficulty'>
                <option value="">Any Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>


            <label htmlFor="trivia_type">Select Type: </label>
            <select name="trivia_type" id='trivia_type'>
                <option value="">Any Type</option>
                <option value="multiple">Multiple Choice</option>
                <option value="boolean">True / False</option>
            </select>
            
            { error ? error : ''}

            <button id='start-quizz' className="btn-title" onClick={event => startClick(event)}>Start quizz</button>
	    </form>
    </div>
    )
}