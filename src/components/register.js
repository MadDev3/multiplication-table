import React from "react";

class Register extends React.Component{


    constructor(props){
        super(props)
        this.state = {
            username: '',
            email: '',
            password: '',
            password_confirm: '',
            status: false,
            email_user: '',
            password_user: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.auth = this.auth.bind(this);
        this.getAuth = this.getAuth.bind(this);
        this.getSignUp = this.getSignUp.bind(this);
    }

    handleChange(e){
        const target = e.target;
        const name = target.name;
        this.setState({[name]: e.target.value});
    }

    getSignUp(){
        this.setState({status: false});
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

    getAuth(){
        this.setState({status: true});
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
                this.setState({status: data.status});
                this.props.updateData("auth_status",this.state.status);
            }
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
            );
        }
    }

}

export default Register;