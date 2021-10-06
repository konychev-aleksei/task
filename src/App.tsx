import React, { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import './App.css'

import MainTable from './components/functional/MainTable/MainTable'
import NavigationBar from './components/functional/NavigationBar/NavigationBar'
import UserForm from './components/functional/UserForm/UserForm'

import Header from './components/pure/Header/Header'
import UserInfo from './components/pure/UserInfo/UserInfo'

import * as api from './api/index'
import { foodListType, stringObject } from './config/types'
import { WRONG_ID_FORMAT } from './config/constants'

import { CANCEL_CHOICE, CHOOSE_ALL } from './config/constants'
import { useSelector, useDispatch } from 'react-redux'

const SETREVERSEDVALUE = 'SETREVERSEDVALUE', SETVALUE = 'SETVALUE'

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
    <BrowserRouter basename="">
      <div className="wrapper">
        <Switch>
          <Route exact path="/user/index">
            <NavigationBar />            
            <MainTable
              treatFoodIds={ treatFoodIds }            
              handleGetValue={ handleGetValue }
            />
          </Route>
          <Route exact path="/user/view/:ID">
            <NavigationBar />            
            <UserInfo 
              treatFoodIds={ treatFoodIds }
              foodList={ foodList }
            />
          </Route>      
          <Route exact path="/user/update/:ID">
            <UserForm 
              modify 
              handleGetValue={ handleGetValue }
            />
          </Route>             
          <Route exact path="/user/create">
            <UserForm 
              handleGetValue={ handleGetValue }
            />
          </Route>                   
          <Route exact path="*" >
            <Redirect to="/user/index" />
          </Route>
        </Switch>
        <Header />
      </div>
    </BrowserRouter>
  )
}

export default App
