import React, { useRef } from 'react'

import { filterParamsType, foodListType } from '../../../config/types'
import { CHOOSE_FOOD, CHOOSE_ALL, CANCEL_CHOICE } from '../../../config/constants'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'



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

export default TableQueries