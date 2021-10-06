import React, { useState } from 'react'
import { ARROWS, KEYS, VALUES } from '../../../config/constants'


interface TableProps {
    grid: string,
    setSortingParameter: React.Dispatch<React.SetStateAction<string>>
}

const TableTitles: React.FC<TableProps> = ({ grid, setSortingParameter }) => {
    const [tableField, setTableFields] = useState<Array<string>>(VALUES)

    const handleEvent = (e: any, index: number) => {
        const currentValue = e.target.innerHTML, currentLength = e.target.innerHTML.length 
              
        if (!currentValue || currentValue === VALUES[0] || currentValue === VALUES[2]) {
            return
        }

        const param = ARROWS.includes(currentValue[currentLength - 1]), id = Number(currentValue[currentLength - 1] === ARROWS[0])
        setTableFields([...tableField.map((item, index) => 
            item ===  currentValue ? 
                `${ param ? item.slice(0, -1) : item } ${ ARROWS[param ? id : 0] }` 
            : 
                VALUES[index] 
            )
        ])

        if (KEYS[index]) {
            setSortingParameter(`${ id ? '-' : '' }${ KEYS[index] }`)
        }
    }

    return(
        <div className={ grid }>
            {
                tableField.map((item, index) => 
                    <div onClick={ (e) => handleEvent(e, index) }>
                        { item }
                    </div>
                )
            }
        </div>        
    )
}

export default TableTitles