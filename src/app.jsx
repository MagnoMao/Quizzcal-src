import React from 'react'
import Title from './components/Title'
import Quizz from './components/Quizz'
import './app.css'

export default function App(){
    const [page, setPage] = React.useState(<Title startQuizz={startQuizz}/>)

    function startQuizz(questions){
        setPage(() => <Quizz questions={questions} backToTitle={backToTitle}/>)
    }

    function backToTitle() {
        setPage(() => <Title startQuizz={startQuizz}/>)
    }
    return(
        <React.Fragment>
            {/* <div className='blob1'></div> */}
            <main className='component'>
                {page}
            </main>
            {/* <div className='blob2'></div> */}
        </React.Fragment>
    )
}
    
