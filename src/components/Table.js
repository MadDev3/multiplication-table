import { render } from "@testing-library/react";
import React from "react";
import './table.css';



class Table extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            status: false,
            auth_status: false,
            start_status: false,
            username: '',
            email: '',
            password: '',
            password_confirm: '',
            email_user: '',
            password_user: '',
            hard: 1,
            points: 0,
            time: 0,
            question: '',
            options: [],
            timer: 0,
            endGame: false,
            questions: [],
            answers: [],
            current_answers: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.auth = this.auth.bind(this);
        this.startTest = this.startTest.bind(this);
        this.changeHard = this.changeHard.bind(this);
        this.getAuth = this.getAuth.bind(this);
        this.getSignUp = this.getSignUp.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.toMain = this.toMain.bind(this);
    }


    handleChange(e){
        const target = e.target;
        const name = target.name;
        this.setState({[name]: e.target.value});
    } 

    handleSubmit(e){
        e.preventDefault();
        const user = {
            name: this.state.username,
            email: this.state.email,
            password: this.state.password,
            password_confirm: this.state.password_confirm
        };
        let url = 'https://internsapi.public.osora.ru/api/auth/signup';
        const form = new FormData();
        form.append('name',user.name);
        form.append('email',user.email);
        form.append('password',user.password);
        form.append('password_confirmation',user.password_confirm);
        fetch(url,{method: 'POST', body: form})
        .then((res) => res.json()).then((data)=>{
            if(!data.status){
                if(data.errors){
                    if(data.errors.email){
                        alert(data.errors.email[0]);
                    }
                    else if(data.errors.password){
                        alert(data.errors.password[0]);
                    }
                }
            }
            else{
                this.setState({status: data.status});
            }
            console.log(data.status);
        });
       
    }

    auth(e){
        e.preventDefault();
        let url = 'https://internsapi.public.osora.ru/api/auth/login';
        const form = new FormData();
        form.append('email',this.state.email_user);
        form.append('password',this.state.password_user);
        fetch(url,{method: 'POST', body: form})
        .then((res)=>res.json())
        .then((data)=>{
            if(!data.status){
                if(data.errors){
                    if(data.errors.email){
                        alert(data.errors.email[0]);
                    }
                    else{
                        alert(data.errors);
                    }
                }
            }
            else if(data.status){
                localStorage.setItem('email',this.state.email_user);
                localStorage.setItem('access_token',data.data.access_token);
                this.setState({auth_status: data.status});
            }
        });
    }

    getAuth(){
        this.setState({status: true});
    }

    getSignUp(){
        this.setState({status: false});
    }

    changeHard(e){
        this.setState({hard: e.target.value});
    }

    startTimer(){
        if(this.state.time>0)
            this.setState({time: (this.state.time-1)});
    }

    toMain(){
        this.setState({start_status: false, endGame: false});
        clearInterval(this.state.timer);
    }

    startTest(e){
        e.preventDefault();
        let url = 'https://internsapi.public.osora.ru/api/game/play';
        const form = new FormData();
        form.append('type_hard',this.state.hard);
        form.append('type',1);
        fetch(url,{method: 'POST', body: form, headers: {'Authorization': 'Bearer '+localStorage.getItem('access_token')}})
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            if(data.status){
                this.setState({start_status: data.status, 
                    points: data.data.points, 
                    time: data.data.time, 
                    options: data.data.options, 
                    question: data.data.question});
                this.state.timer = setInterval(this.startTimer,1000);
                if(this.state.time<1)
                    clearInterval(this.state.timer);
            }
        });
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
        if(!this.state.status){
            return(
                <form onSubmit={this.handleSubmit}>
                    <h2>Регистрация</h2>
                    <label>Введите имя <br/>
                    <input value={this.state.username} onChange={this.handleChange} name="username" id="username" type='text' />
                    </label>
                    <label>Введите email <br/>
                    <input value={this.state.email} onChange={this.handleChange} name="email" id="email" type='text'/>
                    </label>
                    <label>Введите пароль <br/>
                    <input value={this.state.password} onChange={this.handleChange} name="password" id="password" type='password'/>
                    </label>
                    <label>Повторите пароль <br/>
                    <input value={this.state.password_confirm} onChange={this.handleChange} name="password_confirm" id="repeatPassword" type='password'/>
                    </label>
                    <input value='Зарегистрироваться' type='submit' className='regist' />
                    <input onClick={this.getAuth} value='Авторизоваться' type='button'/>
                </form>
            );
        }
        else if(this.state.status){
            if(this.state.auth_status){

                if(this.state.endGame){
                    const questions = this.state.questions;
                    const answers = this.state.answers;
                    const cur_answers = this.state.current_answers;
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
                            <h3>Score: {this.state.points}</h3>
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

                else if(this.state.start_status){
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
                else {
                    return(
                    <form onSubmit={this.startTest}>
                        <select value={this.state.hard} onChange={this.changeHard}>
                            <option disabled value={0}>Выберите сложность</option>
                            <option value='1'>Easy/Легко</option>
                            <option value='2'>Hard/Тяжело</option>
                        </select>
                        <input type='submit' value='Start' className="start" />
                    </form>
                );
            }
            }
            else {
            return(
                <form onSubmit={this.auth}>
                    <h2>Авторизация</h2>
                    <label>Введите email <br/>
                    <input value={this.state.email_user} onChange={this.handleChange} name="email_user" id="email_user" type='text'/>
                    </label>
                    <label>Введите пароль <br/>
                    <input value={this.state.password_user} onChange={this.handleChange} name="password_user" id="password_user" type='password'/>
                    </label>
                    <input value='Авторизоваться' type='submit' className='regist' />
                    <input onClick={this.getSignUp} type='button' value='Зарегистрироваться' />
                </form>
            );}
        }
}
}

export default Table;