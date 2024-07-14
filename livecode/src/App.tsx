import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ReadProblem from './components/ReadProblem'
import Combobox from './components/Combobox'
import EditorSection from './components/EditorSection'
import TabComponent from './components/Tabs'
import { Contact } from 'lucide-react'
import Contest from './pages/Contest'
import OneTwoComponent from './components/OneLeftTwoRight'
import { Link } from 'react-router-dom'
import Header from './components/Header'
import Index from './deletepage/Index'
import { getContentFromGithub } from './lib/api'

function App() {
  const [count, setCount] = useState(0)
  // const getProblemDescFromPath = async (url:string) =>{
  //    fetch(url).then((res)=>res.text()).then((data)=>console.log(data)).catch((err)=>console.log(err)) ;
  //   // const data = await res.text();
  //   // console.log(data)
  // }
  useEffect(()=>{
    
    (async()=>{
      const desc = await getContentFromGithub('two-sum/problem.md')
      console.log(desc)
    })();

  },[])

  return (
    <>
     <h1> 
       LiveCode
      </h1>
      <Index />
    </>
  )
}

export default App
