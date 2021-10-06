import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'axios'

import MainTableCSS from '../../functional/MainTable/MainTable.module.css'
import UserInfoCSS from './UserInfo.module.css'

import { foodListType } from '../../../config/types'
import { FIELDS, BASENAME, GET } from '../../../config/constants'

import Loader from 'react-loader-spinner'


interface UserInfoProps {
    foodList: foodListType,
    treatFoodIds: (arg1: Array<string>) => string
}

const UserInfo: React.FC<UserInfoProps> = ({ foodList, treatFoodIds }) => {
    const history = useHistory()
    const { ID } = useParams<{ ID: string }>()
    const { area, grid, styledButton } : { readonly [key: string]: string } = MainTableCSS
    const { split, forImage, buttonStyle } : { readonly [key: string]: string } = UserInfoCSS
    
    const [userdata, setuserData] = useState<Array<string | Array<string>>>([])



    useEffect(() => {
        const fetchUser = async () => {
            const response = await axios({
                url: `${ BASENAME }/v1/user/view?id=${ ID }`,
                method: GET
            })

            const { id, username, email, birthdate, favorite_food_ids, photo_id } = response.data
            setuserData([id, username, email, birthdate, [...favorite_food_ids], photo_id])
        }

        fetchUser()
    }, [ID])

    return (
        <div className={ area }>
            <button 
                onClick={ () => history.push(`/user/update/${ ID }`) }
                className={ styledButton }
            >
                изменить
            </button>
            <button 
                onClick={ () => {} }
                className={ `${ styledButton } ${ buttonStyle }` }
            >
                удалить
            </button>


            {
                userdata.length ? 
                    userdata.map((item, index) => {
                        return index === userdata.length - 1 ? 
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