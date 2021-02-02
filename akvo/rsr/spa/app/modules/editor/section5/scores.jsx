import React, {useState, useEffect} from 'react'
import { Input, Button } from 'antd'

const Scores = ({ input }) => {
  const [items, setItems] = useState([])
  const handleAdd = () => {
    setItems([...items, ''])
  }
  const handleRemove = () => {
    setItems(items.slice(0, items.length - 1))
  }
  const handleItemChange = (index) => (ev) => {
    setItems([...items.slice(0, index), ev.target.value, ...items.slice(index + 1)])
  }
  useEffect(() => {
    input.onChange(items)
  }, [items])
  useEffect(() => {
    if(input.value){
      setItems(input.value)
    }
  }, [])
  return (
    <ul className="scores">
      {items.map((item, index) => (
        <li>
          <div className="cap">Score {index + 1}</div>
          <Input.TextArea autosize value={item} onChange={handleItemChange(index)} />
        </li>
      ))}
      <footer>
        <Button icon="plus" onClick={handleAdd}>Add another</Button>
        <Button type="link" icon="minus" onClick={handleRemove}>Remove</Button>
      </footer>
    </ul>
  )
}

export default Scores
