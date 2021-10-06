import axios from 'axios'
import { BASENAME, GET, DELETE, PUT } from '../config/constants'


export const getFoodList = async () => {
    return await axios({
        url: `${ BASENAME }/v1/user/get-food-list`,
        method: GET
    })
}

export const getUser = async (id: string) => {
    return await axios({
        url: `${ BASENAME }/v1/user/view?id=${ id }`,
        method: GET
    })
}

export const getUsersData = async (sortingParameter: string) => {
    return await axios({
        url: `${ BASENAME }/v1/user/index?sort=${ sortingParameter }`,
        method: GET
    })
}

export const deleteUser = async (id: string) => {
    return await axios({
        url: `${ BASENAME }/v1/user/delete?id=${ id }`,
        method: DELETE
    })
}

export const deletePhoto = async (photo_id: string) => {
    return await axios({
        url: `${ BASENAME }/file/delete?id=${ photo_id }`,
        method: DELETE
    })
}

export const createUser = async (method: any, id: string, data: FormData) => {
    const suffix = method === PUT ? `update?id=${ id }` : `create`

    return await axios({
        url: `${ BASENAME }/v1/user/${ suffix }`,
        method,
        data
    })
}