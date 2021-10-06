import React from 'react'
import { useParams } from 'react-router-dom'
import NavigationBarCSS from './NavigationBar.module.css'


const NavigationBar: React.FC = () => {
    const { ID } = useParams<{ ID: string }>()
    const { area } : { readonly [key: string]: string } = NavigationBarCSS

    return (
        <div className={ area }>
            <a href="/user/index">Главная</a> /&nbsp;
            {
                ID ?
                    <>
                        <a href="/user/index">Пользователи</a> / { ID }
                    </> 
                :
                    <>Пользователи</>
            }           
        </div>
    )
}


export default NavigationBar