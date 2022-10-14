
import './question.css'

export default function Question(props){
    const answers = props.answersText.map((answer,index) => {
            return <button 
                key={`${props.id} a${index}`}
                id={`${props.id} a${index}`}
                index={props.index}
                className='btn-answer'
                onClick={() => handleClick(answer,`${props.id} a${index}`)}
                value={answer}>
                    {answer}
                </button>
        })

    function handleClick(value, id){
        //Remove the 'answer-selected' class from the other alternatives
        const questionAnswerElem = []
        for(let i = 0; i < props.answersText.length; i++){
            questionAnswerElem.push(document.getElementById(`${props.id} a${i}`))
        }
        questionAnswerElem.forEach(elem => elem.classList.remove('answer-selected'))

        //Mark the selected answer
        const answerHTML = document.getElementById(id)
        answerHTML.classList.add('answer-selected')

        //Inform the parent state
        props.setAnswers((prevState) => {
            // console.log('inside question')
            // console.log(value)
            let arr = [...prevState]
            arr[props.index] = answerHTML
            console.log(arr)
            return arr
        })
    }

    return(
        <div className="question" id={props.id}>
            <h2>{props.questionText}</h2>
                <div className="answers">
                    {answers}
                </div>
        </div>
    )

}