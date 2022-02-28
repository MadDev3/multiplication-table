import React from "react";
import './table.css';

export default class Result extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            questions: [],
            answers: [],
            current_answers: []
        }
        this.toMain = this.toMain.bind(this);
    }



    toMain(){
        this.setState({start_status: false, endGame: false});
        this.props.updateData('start_status',false);
        this.props.updateData('endGame',false);
        clearInterval(this.state.timer);
    }

    render(){
        const points = this.props.points;
        const questions = this.props.questions;
        const answers = this.props.answers;
        const cur_answers = this.props.current_answers;
        const listQuestions = questions.map((question, index)=>
            <span className="cell" key={index}>{question}</span>
        );
        const listAnswers = answers.map((answer, index)=>
            <span className="cell" key={index}>{answer}</span>
        );
        const listCurAnswers = cur_answers.map((cur_answer, index)=>
            <span className="cell" key={index}>{cur_answer}</span>
        );
        return(
            <form>
                <h3>Score: {points}</h3>
                <h3>Timer: 0</h3>
                <h3>END GAME</h3>
                <input className="go-main" onClick={this.toMain} type='button' value='Go Main' />
                <div className="tabl-head"><span>Question</span><span>Answer</span><span>Correct</span></div>
                <div className="row">
                    <div className="column">{listQuestions}</div>
                    <div className="column">{listCurAnswers}</div>
                    <div className="column">{listAnswers}</div>
                </div>
            </form>
        );
    }
}