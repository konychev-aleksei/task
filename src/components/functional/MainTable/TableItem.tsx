import React from 'react'
import { useHistory } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEye, faEdit } from '@fortawesome/free-solid-svg-icons'

import { BASENAME, USER_PLACEHOLDER } from '../../../config/constants'
import { foodListType, tableValueType } from '../../../config/types'


interface TableItemProps {
    item: tableValueType,
    grid: string,
    major: string, 
    buttonsRow: string, 
    index: number, 
    foodList: foodListType,
    deleteItemById: (arg1: string, arg2: string) => void,
    treatFoodIds: (arg1: Array<string>) => string
}

const TableItem:React.FC<TableItemProps> = ({ item, grid, index, major, buttonsRow, foodList, deleteItemById, treatFoodIds }) => {
    const { id, username, email, birthdate, favorite_food_ids, photo_id } = item
    const history = useHistory()

    const treatPhoto = () => {
        return photo_id ? 
            `${ BASENAME }/file/get?id=${ photo_id }` 
        : 
            USER_PLACEHOLDER 
    }

    return (
        <div className={ `${grid} ${major}` }>
            <div>{ index + 1 }</div>
            <div>{ id }</div>
            <div>
                <img 
                    draggable="false"
                    src={ treatPhoto() }
                    alt="" 
                />
            </div>
            <div>{ username }</div>
            <div 
                style={{ textDecoration: 'underline' }}
            >
                { email }
            </div>
            <div>{ birthdate }</div>
            <div>{ treatFoodIds(favorite_food_ids) }</div>
            <div className={ buttonsRow }>
                <button onClick={ () => history.push(`/user/view/${ id }`) }>
                    <FontAwesomeIcon icon={ faEye } />
                </button>
                <button onClick={ () => history.push(`/user/update/${ id }`) }>
                    <FontAwesomeIcon icon={ faEdit } />
                </button>
                <button onClick={ () => deleteItemById(id, photo_id) }>
                    <FontAwesomeIcon icon={ faTrash } />
                </button>
            </div>
    </div>     
    )
}

export default TableItem