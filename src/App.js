import React, { Component } from 'react';
import "./App.css";
import Select from './extra/Select/Select';
import smallData from './data/smallData';
import bigData from './data/bigData';
import { TablePagination } from 'react-pagination-table';
class App extends Component {
constructor(props) {
    super(props);
    this.state = {
      data: '',
      sort:true,
      headers:''
    };
    this.find=this.find.bind(this);
this.myData=this.myData.bind(this);
}
componentDidMount(){
  localStorage.clear();
}


//sending data
	send(e){
let select=e.target.previousSibling.children[1];
let select_value= select.options[select.selectedIndex].value;
let data=this.getData(select_value);
let headers=data.shift();
headers=Object.values(headers);//getting headers for the table

 this.setState({data,headers});
localStorage.setItem('data',JSON.stringify(data));
 e.target.parentNode.removeChild(e.target);
  select.parentNode.removeChild(select);


	}

	checkClick(){
		let self=this;
		window.onclick=function(e){
			if(e.target.tagName==="TD"){
				let data=[];
				let index=e.target.parentNode.rowIndex;
                  let table=e.target.parentNode.parentNode.parentNode;
                  let i=[...table.rows[index].cells];
                 i.forEach((item)=>{
                 	data.push(item.textContent);
                 })

                 let result=document.getElementById('result');
                 result.innerHTML=`This row has following values: ${data.join(', ')}`;

							}else if(e.target.tagName==="TH"){
                self.setState({sort:!self.state.sort})
								self.sortTable(e.target.textContent);
							}
		}
	}

	sortTable(name){
		let n='';
		if(name==='Идентификатор'){
			n='id';
		}else if(name==='Название'){
			n='name';
		}else if(name==='Стоимость'){
			n='price';
		}else if(name==='Количество'){
			n='quantity';
		}
    let{data}=this.state;
    console.log(data)
		if(this.state.sort){
  data=data.sort((a,b)=>{
   return a[n]>b[n];
  })
  this.setState({data})
}else{
  data=data.sort((a,b)=>{
   return a[n]<b[n];
  })
  this.setState({data})
}

	}

myData(){
  //getting custom data
let number=prompt('State the number of data you want to receive from 1 to 20');
number=+number;
if(!number){
  //by default will receive 10
  return smallData();
}else{
  //get the custom amount of data
  let arr=bigData()
  return arr.slice(0,number+1);
}

}
	//getting data from server
	getData(type='s'){
		let data='';
		if(type==='s'){
data=smallData();
		}else if(type==='b'){
			data=bigData();
		}else if(type==='m'){
			data=this.myData();

		}

		return data;
	}

  find(event){
    
    let {data}=this.state;
    if(event.target.value===''){ // if the search input is empty
  let data=JSON.parse(localStorage.getItem('data'));
  this.setState({data})
}else{
    
    data=data.filter(function(item){
      return item.name.trim().toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
this.setState({data});
}
  }



render(){
let{data,headers}=this.state;
let table='';
if(data !=='' && headers !==''){
	 table= <div>Search:<input type='text' onChange={this.find} />
 <p></p><TablePagination
            
            subTitle="Table for Mauris"
            data={ data }
            headers={ headers }
            columns="id.name.price.quantity"
             perPageItemCount={ 5 }
            totalCount={ data.length }
             arrayOption={[]}
             paginationClassName='pagination'
            
        />
        </div>
}else{
	table=<span></span>
}
	return <div className='hideOverflow'>
 <Select/>
 <button onClick={(e) => this.send(e)}className="btn btn-success">Send</button>

 {table}
 <span id='result'></span>
      {this.checkClick()}
     </div>   
      }
 
}


            
export default App;
