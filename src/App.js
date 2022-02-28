import React from 'react';
import './App.css';
import Register from './components/register';
import ChooseHard from './components/chooseHard';
import Test from './components/test';
import Result from './components/result';

class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      auth_status: false,
      start_status: false,
      endGame: false,
      hard: 1,
      points: 0,
      time: 0,
      question: '',
      options: [],

      questions: [],
      answers: [],
      current_answers: []
}
  }

  updateData = (name,value) => {
    this.setState({[name]: value})
  }

  render(){
    if(this.state.auth_status){
      if(this.state.start_status){
        if(this.state.endGame){
          return(
            <Result points={this.state.points} questions={this.state.questions} answers={this.state.answers} current_answers={this.state.current_answers} updateData={this.updateData}/>
          );
        }
        else {
          return(
          <Test updateData={this.updateData} hard={this.state.hard} points={this.state.points} time={this.state.time} question={this.state.question} options={this.state.options} />
        );
        }
      }
      else { return(
        <div className='app'>
          <ChooseHard updateData={this.updateData} />
        </div>
      );
      }
    }
    else{
      return(
        <div className='app'>
          <Register updateData={this.updateData} />
        </div>
      );
    } 
  }

}

export default App;
