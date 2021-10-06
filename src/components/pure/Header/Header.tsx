import React, { memo } from 'react'
import { useHistory } from 'react-router-dom'

import HeaderCSS from './Header.module.css'
import { CSSModule } from '../../../config/types'


const Header: React.FC = () => {
    const history = useHistory()
    const { area } : CSSModule = HeaderCSS

    return(
        <div className={ area }>
            <h3>My Application</h3>
            <button onClick={ () => history.push('/user/index') }>Home</button>
            <button>
                <a target="blank" href="/">Swagger</a>
            </button>
        </div>
    )
}

export default memo(Header)