import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import MainTableCSS from '../../functional/MainTable/MainTable.module.css'
import UserInfoCSS from './UserInfo.module.css'

import { foodListType, CSSModule } from '../../../config/types'
import { FIELDS, BASENAME, CONFIRMATION_MESSAGE } from '../../../config/constants'

import Loader from 'react-loader-spinner'
import * as api from '../../../api/index'


interface UserInfoProps {
    foodList: foodListType,
    treatFoodIds: (food: Array<string>) => string
}


const UserInfo: React.FC<UserInfoProps> = ({ foodList, treatFoodIds }) => {
    const history = useHistory()
    const { ID } = useParams<{ ID: string }>()
    const { area, grid, styledButton }: CSSModule = MainTableCSS
    const { split, forImage, buttonStyle }: CSSModule = UserInfoCSS
    
    const [userData, setUserData] = useState<Array<string | Array<string>>>([])


    useEffect(() => {
        const fetchUser = async () => {
            const response = await api.getUser(ID)
            const { id, username, email, birthdate, favorite_food_ids, photo_id } = response.data

            setUserData([id, username, email, birthdate, [...favorite_food_ids], photo_id])
        }

        fetchUser()
    }, [ID])


    const deleteItem = async () => {
        const photo: string = String(userData[5])

        if (window.confirm(CONFIRMATION_MESSAGE)) {
            await api.deleteUser(ID)       
            history.push('/')    
            await api.deletePhoto(photo)               
        } 
    }    


    return (
        <div className={ area }>
            <button 
                onClick={ () => history.push(`/update/${ ID }`) }
                className={ styledButton }
            >
                изменить
            </button>
            <button 
                onClick={ () => deleteItem() }
                className={ `${ styledButton } ${ buttonStyle }` }
            >
                удалить
            </button>


            {
                userData.length ? 
                    userData.map((item, index) => {
                        return index === userData.length - 1 ? 
                            (
                                <div className={ `${grid} ${split} ${forImage}` }>
                                    <div>
                                        { FIELDS[index] }
                                    </div>
                                    <div>
                                        <img 
                                            draggable="false"
                                            src={ `${ BASENAME }/file/get?id=${ item }` ?? 1 } 
                                            alt="" 
                                        />
                                    </div>
                                </div>                                
                            )
                            :
                            (
                                <div className={ `${grid} ${split}` }>
                                    <div>
                                        { FIELDS[index] }
                                    </div>
                                    <div style={ index === 2 ? { textDecoration: 'underline' } : {} }>
                                        { 
                                            Array.isArray(item) ? 
                                                treatFoodIds(item)
                                            : 
                                                item 
                                        }
                                    </div>
                                </div>
                            )
                        }
                    )
                :
                    <div className="loader">
                        <Loader
                            type="TailSpin"
                            color="#66FCF1"
                            height={ 60 }
                            width={ 60 }
                        />
                    </div>
            }        
        </div>
    )
}

export default UserInfo