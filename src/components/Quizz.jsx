import React from 'react'
import './quizz.css'
import Question from './Question'

export default function Quizz(props) {
    //An HTML elements array of the answers the user selected. 
    const [answers, setAnswers] = React.useState(Array(props.questions.length).fill(''))

    const [result, setResult] = React.useState('')
    const [quizz, setQuizz] = React.useState()
    const [quizzEnded, setQuizzEnded] = React.useState(false)

    React.useEffect(() => {
        setQuizz(createQuizz())
    }, [])


    function createQuizz() {
        //Okay hear me out
        //The API gives me the question and answer in an encoded format
        //Meaning a question like: "What is the 'powerhouse' of the Eukaryotic animal cell"
        //Becomes: "What is the &quot;powerhouse&quot; of the Eukaryotic animal cell"
        //and JS doesn't have a built in function to decode it
        //BUT this down below is a neat trick to solve it
        //ref: https://tertiumnon.medium.com/js-how-to-decode-html-entities-8ea807a140e5


        var parserElem = document.createElement('textarea')
        const decodeHTML = str => {
            parserElem.innerHTML = str
            return parserElem.value
        }

        return props.questions.map((elem, index) => {
            const questionText = decodeHTML(elem.question)
            let answersText = []

            if (elem.type === 'boolean') answersText = ['False', 'True']
            else {
                let incorrectAnswers = [...elem.incorrect_answers]
                incorrectAnswers = incorrectAnswers.map(elem => decodeHTML(elem))

                const correctAnswer = parseHTML(elem.correct_answer)

                answersText = shuffle([...incorrectAnswers, correctAnswer])
                // if(elem.type !== 'boolean') shuffle(answersText)
                // else{
                //     if(answer)
                // }
            }
            const question = <Question
                key={`q${index}`}
                id={`q${index}`}
                index={index}
                questionText={questionText}
                answersText={answersText}
                setAnswers={setAnswers}
            />

            return question
        })
    }

    function parseHTML(str) {
        let aux = str.replaceAll('&quot;', "'")
        aux = aux.replaceAll('&#039;', "'")
        return aux
    }

    function shuffle(array) {
        //Thanks --> https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    function verifyAnswers() {
        console.log('answers: ')
        console.log(answers)
        if (!answers.every(elem => elem !== '')) {
            setResult("There are unanswered questions")
            return
        }

        let correct = 0
        answers.forEach((answerHTML, index) => {
            const siblingsAndSelf = answerHTML.parentNode.children
            for (let elemHTML of siblingsAndSelf) {
                elemHTML.style.pointerEvents = 'none'
            }

            if (answerHTML.value === props.questions[index].correct_answer) {
                correct++
                answerHTML.classList.remove('answer-selected')
                answerHTML.classList.add('answer-correct')
                // answerHTML.parentNode.children.forEach(elemHTML => {
                //     if(elemHTML === answHTML)
                // })

                // console.log('correct question html')
                // console.log(quizz[index].props.id)
                // console.log(questionHTML)
            } else {
                for (let elemHTML of siblingsAndSelf) {
                    if (elemHTML === answerHTML) {
                        answerHTML.classList.remove('answer-selected')
                        answerHTML.classList.add('answer-wrong')
                    } else if (elemHTML.value === props.questions[index].correct_answer) {
                        elemHTML.classList.add('answer-correct')
                    }
                }
            }
        })

        setResult(`You scored ${correct}/${props.questions.length} correct answers`)
        setQuizzEnded(true)
        // setButton(<button className='btn-title quizz-submit' onClick={props.backToTitle}>New Quizz</button>)
    }

    return (
        <div className='quizz'>
            {quizz}
            {result ? <h2 className='quizz-result'>{result}</h2> : ''}
            {quizzEnded ?   <button className='btn-title quizz-submit' onClick={props.backToTitle}>New Quizz</button> :
                            <button className='btn-title quizz-submit' onClick={verifyAnswers}>Submit</button>}
        </div>
    )
}