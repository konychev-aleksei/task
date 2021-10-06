import React, { useState, useEffect, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import * as api from '../../../api/index'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import UserFormCSS from './UserForm.module.css'
import { BASENAME, USER_PLACEHOLDER, PUT, POST, CHOOSE_ALL, CANCEL_CHOICE, CHOOSE_FOOD, FAVORITE_FOOD_IDS, UPLOAD_PHOTO, BIRTHDATE } from '../../../config/constants'
import { foodListType, initialValuesType, CSSModule } from '../../../config/types'

import Loader from 'react-loader-spinner'
import { useSelector } from 'react-redux'


interface Props {
    modify?: boolean,
    handleGetValue: (formFood: number | undefined) => string
}


const formSchema = Yup.object().shape({
    username: Yup.string().required('Необходимо заполнить поле «Имя»‎'),
    email: Yup.string().required('Необходимо заполнить поле «Email»‎').email('Необходимо ввести валидный email'),
    birthdate: Yup.string().required('Необходимо заполнить поле «Дата рождения»‎')
})


const UserForm: React.FC<Props> = ({ modify, handleGetValue }) => {
    const history = useHistory()
    const { ID } = useParams<{ ID: string }>()    

    const foodList = useSelector((state: any) => state.foodList)
    const reversedFoodList = useSelector((state: any) => state.reversedFoodList)

    const initialValues: initialValuesType  = {
        username: '',
        email: '',
        birthdate: '',
        favorite_food_ids: [],
        upload_photo: ''
    }    
    const [userData, setUserData] = useState<initialValuesType>(initialValues)

    const [photo, setPhoto] = useState<string>(USER_PLACEHOLDER)
    const chosenRef = useRef<HTMLOptionElement>(null)
    const { form, foodSelector, birthdateSelector } : CSSModule = UserFormCSS
    

    const handleChoice = (values: any, targetValue: string) => {        
        if (targetValue === CANCEL_CHOICE) {
            return []
        }

        let newFoodList: Array<string> = []
        if (targetValue === CHOOSE_ALL) {
            newFoodList = [...Object.keys(foodList)]
        }                                    
        else {
            newFoodList = values.favorite_food_ids.includes(reversedFoodList[targetValue]) ? 
                values.favorite_food_ids.filter((item: string) => item !== reversedFoodList[targetValue])
            :
                [...values.favorite_food_ids, reversedFoodList[targetValue]]
        }

        return newFoodList
    }


    const handleSubmit = async (values: any) => {                             
        const data = new FormData()
        const birthdate = values.birthdate.split('-').reverse().join('.')

        Object.entries({ ...values, birthdate }).forEach(
            ([key, value]) => {
                Array.isArray(value) ?
                    value.length ? 
                        value.forEach(item => data.append(`${key}[]`, item))
                    :
                    data.append(`${key}[]`, '')
                :
                    data.append(key, String(value))
            }
        )

        data.append(UPLOAD_PHOTO, values.upload_photo)
        
        await api.createUser(modify ? PUT : POST, ID, data)
        history.push('/')
    }
    

    const getFoodItem = (item: string, values: any, setFieldValue: any) => {
        return(
            <div>
                { foodList[item] }
                <button type="button" onClick={ () => {
                        setFieldValue(
                            FAVORITE_FOOD_IDS, 
                            values.favorite_food_ids.filter((foodItem: string) => foodItem !== item)
                        )                                                   
                }}>
                    <FontAwesomeIcon icon={ faTimes } />
                </button>                                                
            </div>   
        )
    }


    const handleSelectionChange = (values: any, targetValue: string, setFieldValue: any) => {
        if (targetValue === CHOOSE_FOOD) {
            return
        }      

        const newFoodList: Array<string> = handleChoice(values, targetValue)

        setFieldValue(FAVORITE_FOOD_IDS, newFoodList) 
        if (chosenRef.current) {
            chosenRef.current.selected = true
        }
    }
    

    useEffect(() => {
        const fetchData = async () => {
            if (modify) {
                const response = await api.getUser(ID)  

                const { username, email, birthdate, favorite_food_ids, photo_id } = response.data
                const validBirthdate: string = String(birthdate).split('.').reverse().join('-')
                setUserData({username, email, birthdate: validBirthdate, favorite_food_ids: [...favorite_food_ids], upload_photo: ''})                
                setPhoto(`${ BASENAME }/file/get?id=${ photo_id }`)
            }
        }

        fetchData()
    }, [modify, ID])


    return(
        <>
        {
            modify && !userData.username ?
                <div className="loader lower">
                    <Loader
                        type="TailSpin"
                        color="#66FCF1"
                        height={ 60 }
                        width={ 60 }
                    />
                </div>
            :
                <div>
                    <Formik
                        onSubmit={ handleSubmit }
                        enableReinitialize
                        initialValues={ userData }
                        validationSchema={ formSchema }
                    >
                        {
                            ({ values, setFieldValue, touched, errors, isSubmitting }) => (
                                <Form style={ isSubmitting ? { opacity: '.5' } : {} } className={ form }>
                                    <img src={ photo } alt="" />
                                    <input
                                        type="file"
                                        id="fileUpload"
                                        accept="image/*"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            if (!e.target.files) return
                                            setFieldValue(UPLOAD_PHOTO, e.target.files[0])
                                            setPhoto(URL.createObjectURL(e.target.files[0]))
                                        }}
                                    />      
                                    <label htmlFor="fileUpload">
                                        <span>
                                            ЗАМЕНИТЬ
                                        </span>
                                    </label>

                                    <p>Имя</p>
                                    <Field
                                        name="username"
                                        type="text"  
                                        validate={ formSchema }
                                        autoComplete="off"                   
                                    />
                                    { errors.username && touched.username ? <b>{ errors.username }</b> : null }

                                    <p>Email</p>
                                    <Field
                                        type="email"
                                        name="email"
                                        autoComplete="off"
                                        validate={ formSchema }                    
                                    />
                                    { errors.email && touched.email ? <b>{ errors.email }</b> : null }

                                    <p>Дата рождения</p>
                                    <div className={ birthdateSelector }>
                                        <Field
                                            type="date"
                                            name="birthdate"
                                            validate={ formSchema }
                                        />
                                        <button type="button" onClick={ () => {
                                            setFieldValue(BIRTHDATE, '') 
                                        }}>
                                            <FontAwesomeIcon icon={ faTimes } />
                                        </button>    
                                    </div>
                                    { errors.birthdate && touched.birthdate ? <b>{ errors.birthdate }</b> : null }


                                    <p>Любимая еда</p>
                                    <div className={ foodSelector }>
                                        <div>
                                            {
                                                values.favorite_food_ids.map(item => {
                                                        return item?.length ? getFoodItem(item, values, setFieldValue) : null
                                                    }
                                                )
                                            }                                                                                                                                                                                                                                                                                                                                                                                                                     
                                        </div>
                                        <select onChange={ (e) => handleSelectionChange(values, e.target.value, setFieldValue) }>
                                            <option style={ { color: 'grey' } } ref={ chosenRef }>Выберите еду</option>
                                            <option>{ handleGetValue(values.favorite_food_ids.length) }</option>
                                            {
                                                Object.entries(foodList).map(
                                                    ([key, value]) => <option style={ values.favorite_food_ids.includes(String(key)) ? { backgroundColor: '#25527E'  } : {} }>{ String(value) }</option>
                                                )
                                            }    
                                        </select>                                
                                    </div>                                      
                                                                                                                    
                                    <button disabled={ isSubmitting } type="submit">СОХРАНИТЬ</button>
                                </Form>
                            )
                        }
                    </Formik>
                </div>        
        }
        </>
    )
}
  
export default UserForm