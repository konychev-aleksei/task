import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import MainTableCSS from './MainTable.module.css'
import TableItem from './TableItem'

import { filterParamsType, foodListType, initialValuesType, CSSModule } from '../../../config/types'
import { CONFIRMATION_MESSAGE, ARROWS, KEYS, VALUES, CHOOSE_FOOD, CHOOSE_ALL, CANCEL_CHOICE } from '../../../config/constants'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import * as api from '../../../api/index'
import { useSelector } from 'react-redux'


interface TableProps {
    grid: string,
    setSortingParameter: React.Dispatch<React.SetStateAction<string>>
}

const TableTitles: React.FC<TableProps> = ({ grid, setSortingParameter }) => {
    const [tableField, setTableFields] = useState<Array<string>>(VALUES)

    const handleEvent = (e: any, index: number) => {
        const currentValue = e.target.innerHTML, currentLength = e.target.innerHTML.length 
              
        if (!currentValue || currentValue === VALUES[0] || currentValue === VALUES[2]) {
            return
        }

        const param = ARROWS.includes(currentValue[currentLength - 1]), id = Number(currentValue[currentLength - 1] === ARROWS[0])
        setTableFields([...tableField.map((item, index) => 
            item ===  currentValue ? 
                `${ param ? item.slice(0, -1) : item } ${ ARROWS[param ? id : 0] }` 
            : 
                VALUES[index] 
            )
        ])

        if (KEYS[index]) {
            setSortingParameter(`${ id ? '-' : '' }${ KEYS[index] }`)
        }
    }

    return(
        <div className={ grid }>
            {
                tableField.map((item, index) => 
                    <div onClick={ (e) => handleEvent(e, index) }>
                        { item }
                    </div>
                )
            }
        </div>        
    )
}


interface TableQueriesProps {
    grid: string,
    inlineBirthdate: string,
    tableFoodSelector: string
    filterParams: filterParamsType,
    setFilterParams: React.Dispatch<React.SetStateAction<filterParamsType>>,
    foodList: foodListType,
    reversedFoodList: foodListType,
    handleGetValue: (formFood: number | undefined) => string
}

const TableQueries: React.FC<TableQueriesProps> = ({ grid, inlineBirthdate, filterParams, tableFoodSelector, setFilterParams, foodList, reversedFoodList, handleGetValue }) => {
    const chosenRef = useRef<HTMLOptionElement>(null)

    const getFoodItem = (item: string) => {
        return(
            <div>
                <div>{ foodList[item] }</div>
                <button type="button" onClick={ () => {
                    setFilterParams({
                        ...filterParams, 
                        favoriteFood: filterParams?.favoriteFood?.filter((foodItem: string) => foodItem !== item)
                    })                                                   
                }}>
                    <FontAwesomeIcon icon={ faTimes } />
                </button>                                                
            </div>   
        )
    }

    const calculateHeight = () => {
        let height: number = 50
        if (filterParams?.favoriteFood?.length) {
            height += filterParams?.favoriteFood?.length * 50
        }
        return `${ height }px`
    }


    const handleChoice = (targetValue: string) => {        
        if (targetValue === CANCEL_CHOICE) {
            return []
        }

        let newFoodList: Array<string> = []
        if (targetValue === CHOOSE_ALL) {
            newFoodList = [...Object.keys(foodList)]
        }                                    
        else {
            if (!filterParams?.favoriteFood) {
                return [reversedFoodList[targetValue]]
            }

            newFoodList = filterParams.favoriteFood.includes(reversedFoodList[targetValue]) ? 
                filterParams.favoriteFood.filter((item: string) => item !== reversedFoodList[targetValue])
            :
                [...filterParams.favoriteFood, reversedFoodList[targetValue]]
        }

        return newFoodList
    }


    const handleSelectionChange = (targetValue: string) => {
        if (targetValue === CHOOSE_FOOD) {
            return
        }      

        const newFoodList: Array<string> = handleChoice(targetValue)

        setFilterParams({ ...filterParams, favoriteFood: [...newFoodList] })
        if (chosenRef.current) {
            chosenRef.current.selected = true
        }
    }


    return(
        <div style={{ height: calculateHeight() }} className={ grid }>
            <div></div>
            <div>
                <input 
                    type="text" 
                    onChange={ e => setFilterParams({ ...filterParams, id: Number(e.target.value) }) } 
                />                
            </div>
            <div></div>
            <div>
                <input 
                    type="text" 
                    onChange={e => setFilterParams({ ...filterParams, username: e.target.value }) } 
                />
            </div>
            <div>
                <input 
                    type="text" 
                    onChange={e => setFilterParams({ ...filterParams, email: e.target.value }) } 
                />
            </div>
            <div className={ inlineBirthdate }>
                <input 
                    onChange={e => setFilterParams({ ...filterParams, birthdateStart: e.target.value }) } 
                    type="date" 
                />
                <b>—</b>
                <input 
                    onChange={e => setFilterParams({ ...filterParams, birthdateEnd: e.target.value }) } 
                    type="date" 
                />
            </div>
            <div className={ tableFoodSelector }>
                <select onChange={ (e) => handleSelectionChange(e.target.value) }>
                    <option style={ { color: 'grey' } } ref={ chosenRef }>Выберите еду</option>
                    <option>{ handleGetValue(filterParams?.favoriteFood?.length) }</option>
                    {
                        Object.entries(foodList).map(
                            ([key, value]) => <option style={ filterParams?.favoriteFood?.includes(String(key)) ? { backgroundColor: '#25527E'  } : {} }>{ String(value) }</option>
                        )
                    }    
                </select>                
                <div>
                    {
                        filterParams?.favoriteFood?.map(item => {
                                return item?.length ? getFoodItem(item) : null
                            }
                        )
                    }                                                                                                                                                                                                                                                                                                                                                                                                                     
                </div>
            </div>
            <div></div>
        </div>        
    )
}



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
            <button className={ styledButton } onClick={ () => history.push('/user/create') }>
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