import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import MainTableCSS from './MainTable.module.css'
import TableItem from './TableItem'

import { filterParamsType, initialValuesType, CSSModule } from '../../../config/types'
import { CONFIRMATION_MESSAGE, ARROWS, KEYS, VALUES } from '../../../config/constants'

import * as api from '../../../api/index'
import { useSelector } from 'react-redux'

import TableQueries from './TableQueries'
import TableTitles from './TableTitles'


interface MainTableProps {
    handleGetValue: (formFood: number | undefined) => string
    treatFoodIds: (food: Array<string>) => string   
}

const MainTable: React.FC<MainTableProps> = ({ treatFoodIds, handleGetValue }) => {
    const history = useHistory()

    const foodList = useSelector((state: any) => state.foodList)
    const reversedFoodList = useSelector((state: any) => state.reversedFoodList)    

    const [sortingParameter, setSortingParameter] = useState<string>('')
    const [usersData, setUsersData] = useState<Array<any>>([])
    const [filterParams, setFilterParams] = useState<filterParamsType>({ })

    const { inlineBirthdate, 
            area, 
            styledButton, 
            grid, 
            major, 
            buttonsRow, 
            tableFoodSelector 
        } : CSSModule = MainTableCSS


    useEffect(() => {
        const fetchUsers = async () => {
            const response = await api.getUsersData(sortingParameter)
            setUsersData(response.data)
        }

        fetchUsers()
    }, [sortingParameter])


    const deleteItemById = async (id: string, photo_id: string) => {
        if (window.confirm(CONFIRMATION_MESSAGE)) {
            setUsersData(usersData.filter(item => item.id !== id))
            await api.deleteUser(id)       
            await api.deletePhoto(photo_id)       
        } 
    }

    const universalFilter = (item: initialValuesType) => {
        const idTolerance = !filterParams.id || item.id === filterParams.id,
              usernameTolerance = !filterParams.username || item.username.toLowerCase().includes(filterParams.username),
              emailTolerance = !filterParams.email || item.email.toLowerCase().includes(filterParams.email),
              birthdateStartTolerance = !filterParams.birthdateStart || item.birthdate.split('.').reverse().join('-') >= filterParams.birthdateStart,
              birthdateEndTolerance = !filterParams.birthdateEnd || item.birthdate.split('.').reverse().join('-') <= filterParams.birthdateEnd,
              foodListTolerance = !filterParams.favoriteFood?.length || filterParams.favoriteFood?.filter(foodItem => item.favorite_food_ids.includes(foodItem)).length === filterParams.favoriteFood?.length


        return idTolerance && usernameTolerance && emailTolerance && birthdateStartTolerance && birthdateEndTolerance && foodListTolerance
    }

    return (
        <div className={ area }>
            <button className={ styledButton } onClick={ () => history.push('/create') }>
                Добавить пользователя
            </button>
            <p>
                {
                    usersData.length ? (
                        <>
                            Показаны записи: <b>{  usersData.filter(item => universalFilter(item)).length }</b> из <b>1 - { usersData.length }</b>
                        </>
                    )
                    : null 
                }
                &nbsp;&nbsp;
                {
                    filterParams.hasOwnProperty('id') && isNaN(Number(filterParams.id)) ? <b style={{ color: '#EE4C7C' }}>Неверный формат ID</b> : null
                }
            </p>


            <TableTitles 
                setSortingParameter={ setSortingParameter }
                grid={ `${grid}` } 
            />
            <TableQueries 
                filterParams={ filterParams }
                setFilterParams={ setFilterParams }
                grid={ `${grid}` } 
                inlineBirthdate={ `${inlineBirthdate}` }
                tableFoodSelector={ `${tableFoodSelector}` }
                foodList={ foodList }
                reversedFoodList={ reversedFoodList }
                handleGetValue={ handleGetValue }
            />

            {
                usersData.filter((item) => universalFilter(item)).map((item, index) =>
                    <TableItem
                        treatFoodIds={ treatFoodIds }
                        deleteItemById={ deleteItemById }
                        item={ item } 
                        grid={ `${ grid }` }
                        index={ index }
                        major={ `${ major }` }
                        buttonsRow={ `${ buttonsRow }` }
                        foodList={ foodList }                        
                    />
                )
            }               
        </div>
    )
}

export default MainTable