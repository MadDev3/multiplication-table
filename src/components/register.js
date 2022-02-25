import { render } from "@testing-library/react";
import React from "react";
import './register.css';
import jquery from "jquery";



class Register extends React.Component{

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
        this.startTimer = this.startTimer.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
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
            this.setState({status: data.status});
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
            if(data.status){
                localStorage.setItem('email',this.state.email_user);
                localStorage.setItem('password',this.state.password_user);
                localStorage.setItem('access_token',data.data.access_token);
                this.setState({auth_status: data.status});
            }
        });
    }

    getAuth(){
        this.setState({status: true});
    }

    changeHard(e){
        this.setState({hard: e.target.value});
    }

    startTimer(){
        if(this.state.time>0)
            this.setState({time: (this.state.time-1)});
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
                    
                    <input value={this.state.username} onChange={this.handleChange} name="username" id="username" type='text'/>
                    
                    <input value={this.state.email} onChange={this.handleChange} name="email" id="email" type='text'/>
                    
                    <input value={this.state.password} onChange={this.handleChange} name="password" id="password" type='password'/>
                    
                    <input value={this.state.password_confirm} onChange={this.handleChange} name="password_confirm" id="repeatPassword" type='password'/>
                    <input value='Зарегистрироваться' type='submit' className='regist' />
                    <input onClick={this.getAuth} value='Авторизоваться' type='button'/>
                </form>
            );
        }
        else if(this.state.status){
            if(this.state.auth_status){

                if(this.state.endGame){
                    return(
                        <form>
                            <h3>Score: {this.state.points}</h3>
                            <h3>Timer: 0</h3>
                            <h3>END GAME</h3>
                            <div className="tabl-head"><span>Question</span><span>Answer</span><span>Correct</span></div>
                            <div className="row">
                                <span className="cell">{this.state.questions[0]}</span>
                                <span className="cell">{this.state.answers[0]}</span>
                                <span className="cell">{this.state.current_answers[0]}</span>
                            </div>
                            <div className="row">
                                <span className="cell">{this.state.questions[1]}</span>
                                <span className="cell">{this.state.answers[1]}</span>
                                <span className="cell">{this.state.current_answers[1]}</span>
                            </div>
                            <div className="row">
                                <span className="cell">{this.state.questions[2]}</span>
                                <span className="cell">{this.state.answers[2]}</span>
                                <span className="cell">{this.state.current_answers[2]}</span>
                            </div>
                            <div className="row">
                                <span className="cell">{this.state.questions[3]}</span>
                                <span className="cell">{this.state.answers[3]}</span>
                                <span className="cell">{this.state.current_answers[3]}</span>
                            </div>
                            <div className="row">
                                <span className="cell">{this.state.questions[4]}</span>
                                <span className="cell">{this.state.answers[4]}</span>
                                <span className="cell">{this.state.current_answers[4]}</span>
                            </div>
                            <div className="row">
                                <span className="cell">{this.state.questions[5]}</span>
                                <span className="cell">{this.state.answers[5]}</span>
                                <span className="cell">{this.state.current_answers[5]}</span>
                            </div>
                            <div className="row">
                                <span className="cell">{this.state.questions[5]}</span>
                                <span className="cell">{this.state.answers[5]}</span>
                                <span className="cell">{this.state.current_answers[5]}</span>
                            </div>
                            <div className="row">
                                <span className="cell">{this.state.questions[6]}</span>
                                <span className="cell">{this.state.answers[6]}</span>
                                <span className="cell">{this.state.current_answers[6]}</span>
                            </div>
                            <div className="row">
                                <span className="cell">{this.state.questions[7]}</span>
                                <span className="cell">{this.state.answers[7]}</span>
                                <span className="cell">{this.state.current_answers[7]}</span>
                            </div>
                            <div className="row">
                                <span className="cell">{this.state.questions[8]}</span>
                                <span className="cell">{this.state.answers[8]}</span>
                                <span className="cell">{this.state.current_answers[8]}</span>
                            </div>
                            <div className="row">
                                <span className="cell">{this.state.questions[9]}</span>
                                <span className="cell">{this.state.answers[9]}</span>
                                <span className="cell">{this.state.current_answers[9]}</span>
                            </div>
                            <div className="row">
                                <span className="cell">{this.state.questions[10]}</span>
                                <span className="cell">{this.state.answers[10]}</span>
                                <span className="cell">{this.state.current_answers[10]}</span>
                            </div>
                            <div className="row">
                                <span className="cell">{this.state.questions[11]}</span>
                                <span className="cell">{this.state.answers[11]}</span>
                                <span className="cell">{this.state.current_answers[11]}</span>
                            </div>
                            <div className="row">
                                <span className="cell">{this.state.questions[12]}</span>
                                <span className="cell">{this.state.answers[12]}</span>
                                <span className="cell">{this.state.current_answers[12]}</span>
                            </div>
                            <div className="row">
                                <span className="cell">{this.state.questions[13]}</span>
                                <span className="cell">{this.state.answers[13]}</span>
                                <span className="cell">{this.state.current_answers[13]}</span>
                            </div>
                            <div className="row">
                                <span className="cell">{this.state.questions[14]}</span>
                                <span className="cell">{this.state.answers[14]}</span>
                                <span className="cell">{this.state.current_answers[14]}</span>
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
                            <input type='button' value='Go back' />
                        </form>
                    );
                }
                else {
                    return(
                    <form onSubmit={this.startTest}>
                        <select value={this.state.hard} onChange={this.changeHard}> 
                            <option selected value='1'>Easy/Легко</option>
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
                    <input value={this.state.email_user} onChange={this.handleChange} name="email_user" id="email_user" type='text'/>
                    <input value={this.state.password_user} onChange={this.handleChange} name="password_user" id="password_user" type='password'/>
                    <input value='Авторизоваться' type='submit' className='regist' />
                </form>
            );}
        }
}
}

export default Register;