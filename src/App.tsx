import React, { useEffect } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import './App.css'

import MainTable from './components/functional/MainTable/MainTable'
import UserForm from './components/functional/UserForm/UserForm'
import UserInfo from './components/functional/UserInfo/UserInfo'

import Header from './components/pure/Header/Header'
import Footer from './components/pure/Footer/Footer'
import NavigationBar from './components/pure/NavigationBar/NavigationBar'

import * as api from './api/index'
import { stringObject } from './config/types'
import { WRONG_ID_FORMAT } from './config/constants'

import { CANCEL_CHOICE, CHOOSE_ALL, SETREVERSEDVALUE, SETVALUE } from './config/constants'
import { useSelector, useDispatch } from 'react-redux'


const App = () => {
  const dispatch = useDispatch()
  const foodList = useSelector((state: any) => state.foodList)


  useEffect(() => {
    const fetchFoodList = async () => {
      const response = await api.getFoodList()

      const reversed: stringObject = {}
      Object.entries(response.data).forEach(([key, value]) => {
        reversed[String(value)] = key
      })

      dispatch({ type: SETREVERSEDVALUE, payload: reversed })
      dispatch({ type: SETVALUE, payload: response.data })
    }

    fetchFoodList()
  }, [])


  const treatFoodIds = (food: Array<string>) => {
    return food
    .map((item: string) => Object.keys(foodList).includes(item) || !item.length ? 
            foodList[item] 
        : 
            WRONG_ID_FORMAT
    )
    .join(', ')  
  }


  const handleGetValue = (formFood: number | undefined) => {
    return formFood && formFood === Object.entries(foodList).length ? CANCEL_CHOICE : CHOOSE_ALL
  }


  return (
    <BrowserRouter basename="/user">
      <div className="wrapper">
        <Switch>
          <Route exact path="/index">
            <NavigationBar />            
            <MainTable
              treatFoodIds={ treatFoodIds }            
              handleGetValue={ handleGetValue }
            />
          </Route>
          <Route exact path="/view/:ID">
            <NavigationBar />            
            <UserInfo 
              treatFoodIds={ treatFoodIds }
              foodList={ foodList }
            />
          </Route>      
          <Route exact path="/update/:ID">
            <UserForm 
              modify 
              handleGetValue={ handleGetValue }
            />
          </Route>             
          <Route exact path="/create">
            <UserForm 
              handleGetValue={ handleGetValue }
            />
          </Route>                   
          <Route exact path="*" >
            <Redirect to="/index" />
          </Route>
        </Switch>
        <Header />
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
