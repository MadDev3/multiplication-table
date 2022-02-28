import React from "react";
import './table.css';

class Test extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            hard: this.props.hard,
            points: this.props.points,
            time: this.props.time,
            question: this.props.question,
            options: this.props.options,
            timer: 0,
            questions: [],
            answers: [],
            current_answers: []
        }

        this.nextQuestion = this.nextQuestion.bind(this);
        this.toMain = this.toMain.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.startTimer = this.startTimer.bind(this);
    }

    startTimer(){
        if(this.state.time>0)
            this.setState({time: (this.state.time-1)});
    }

    componentDidMount(){
        this.state.timer = setInterval(this.startTimer,1000);
        
    }

    toMain(){
        this.setState({start_status: false, endGame: false});
        this.props.updateData('start_status',false);
        this.props.updateData('endGame',false);
        clearInterval(this.state.timer);
    }

    nextQuestion(e){
        e.preventDefault();
        clearInterval(this.state.timer);
        let url ='https://internsapi.public.osora.ru/api/game/play';
        const form = new FormData();
        form.append('answer', parseInt(e.target.value));
        form.append('type_hard', this.state.hard);
        form.append('type', 2);
        fetch(url,{
            method: 'POST',
            body :form,
            headers: {'Authorization': 'Bearer '+localStorage.getItem('access_token')}
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.data.questions){
                clearInterval(this.state.timer);
                this.setState({endGame: true});
                let questions = [];
                let answers = [];
                let cur_answers = [];
                for(var i = 0; i < 15; i++){
                    questions[i] = data.data.questions[i].question;
                    answers[i] = data.data.questions[i].answer;
                    cur_answers[i] = data.data.questions[i].current_answer;
                }
                this.setState({
                    questions: questions,
                    answers: answers,
                    current_answers: cur_answers
                })
                this.props.updateData('points',data.data.points);
                this.props.updateData('endGame',true);
                this.props.updateData('questions',this.state.questions);
                this.props.updateData('answers',this.state.answers);
                this.props.updateData('current_answers',this.state.current_answers);
            }
            this.setState({
                points: data.data.points, 
                time: data.data.time, 
                options: data.data.options, 
                question: data.data.question
            })
            console.log(data.data);
            this.state.timer = setInterval(this.startTimer,1000);
                if(this.state.time<1)
                    clearInterval(this.state.timer);
            
                
        });
    }


    render(){
        return(
            <form onSubmit={this.nextQuestion}>
                <h3>Score: {this.state.points}</h3>
                <h3>Timer: {this.state.time}</h3>
                <h3>{this.state.question}</h3>
                <div className="options">
                    <input onClick={this.nextQuestion} className="option" type='submit' value={this.state.options[0]} />
                    <input onClick={this.nextQuestion} className="option" type='submit' value={this.state.options[1]} />
                    <input onClick={this.nextQuestion} className="option" type='submit' value={this.state.options[2]} />
                    <input onClick={this.nextQuestion} className="option" type='submit' value={this.state.options[3]} />
                </div>
                <input onClick={this.toMain} type='button' value='Go back' />
            </form>
        );
    }
}

export default Test;