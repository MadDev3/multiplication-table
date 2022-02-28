import React from "react";

class ChooseHard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            status: false,
            hard: 1,
            points: 0,
            time: 0,
            question: '',
            options: [],
        }
        this.changeHard = this.changeHard.bind(this);
        this.startTest = this.startTest.bind(this);
    }

    changeHard(e){
        this.setState({hard: e.target.value});
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
                this.setState({status: data.status, 
                    points: data.data.points, 
                    time: data.data.time, 
                    options: data.data.options, 
                    question: data.data.question});
                    
                    this.props.updateData("points",this.state.points);
                    this.props.updateData("time",this.state.time);
                    this.props.updateData("question",this.state.question);
                    this.props.updateData("options",this.state.options);
                    this.props.updateData("hard",this.state.hard);
                    this.props.updateData("start_status", this.state.status);
            }
        });
    }

    render(){
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

export default ChooseHard;