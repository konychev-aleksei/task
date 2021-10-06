type initialValuesType = {
    id?: number | null,
    username: string,
    email: string,
    birthdate: string,
    favorite_food_ids: Array<string>,
    upload_photo: string | Blob
}

type foodListType = { [key: string]: string }

type filterParamsType = {
    id?: number,
    username?: string,
    email?: string,
    birthdateStart?: string,
    birthdateEnd?: string,
    favoriteFood?: Array<string>
}

type CSSModule = { 
    readonly [key: string]: string 
}

type stringObject = {
    [key: string]: string 
}

type tableValueType = {
    id: string, 
    username: string, 
    email: string, 
    birthdate: string, 
    favorite_food_ids: Array<string>, 
    photo_id: string
}

export type { initialValuesType, foodListType, filterParamsType, CSSModule, stringObject, tableValueType }

