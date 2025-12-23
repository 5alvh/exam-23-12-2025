
import './App.css'
import Header from './components/header/Header'
import Form from './components/form/Form'
import List from './components/list/List'
import Footer from './components/footer/Footer'
import { useState } from 'react'

function App() {
  const [refreshList, setRefreshList] = useState(false);

  const handleButtonClick = () => {
    console.log("yes triggered");
    setRefreshList(prev => !prev); 
  };

  return (
    <>
      <Header></Header>
      <Form handleButtonClick={handleButtonClick}></Form>
      <List refreshList={refreshList}></List>
      <Footer></Footer>
    </>
  )
}

export default App
