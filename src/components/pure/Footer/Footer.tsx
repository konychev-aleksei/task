import React from 'react'
import { CSSModule } from '../../../config/types'
import FooterCSS from './Footer.module.css'

    
const Footer: React.FC = () => {
    const { area } : CSSModule = FooterCSS

    return (
        <div className={ area }>
            (C) My Company 2021
        </div>
    )
}

export default Footer