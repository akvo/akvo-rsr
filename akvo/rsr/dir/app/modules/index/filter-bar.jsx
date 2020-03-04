import React, {useState, useRef, useReducer} from 'react'
import SVGInline from 'react-svg-inline'
import classNames from 'classnames'
import { useSpring, animated } from 'react-spring'
import { Button, Icon } from 'antd'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import filterSvg from '../../images/filter.svg'


const FilterBar = ({ onSetFilter, filters, dropdownOptions }) => {
  const [open, setOpen] = useState(false)
  // const [sub, setSub] = useState(null)
  const [subIndex, setSubIndex] = useState([])
  // const [subSubIndex, setSubSubIndex] = useState(-1)
  const [step, setStep] = useState(0)
  const subRef = useRef([])
  const [height, setHeight] = useState(filters.length * 42)
  const props = useSpring({ marginLeft: step * -360, height })
  const _setSubIndex = (index) => {
    setSubIndex([...subIndex, index])
    setStep(step + 1)
    setTimeout(() => {
      if (subRef.current.length > 0) setHeight(subRef.current[subRef.current.length - 1].clientHeight + 40)
    }, 50)
  }
  const setFilter = (opt, optIndex) => {
    if(opt.options) {
      // sub-sub menu
      _setSubIndex(optIndex)
    } else {
      onSetFilter(subIndex, optIndex)
    }
  }
  const back = () => {
    setStep(step - 1)
    subRef.current.pop()
    if (subRef.current.length > 0) setHeight(subRef.current[subRef.current.length - 1].clientHeight + 40)
    else setHeight(filters.length * 42)
    setTimeout(() => setSubIndex(subIndex.slice(0, subIndex.length - 1)), 300)
  }
  // console.log(filters[subIndex])
  // console.log(subIndex)
  const handleSubRef = (index) => (ref) => { if(ref && index < step) subRef.current[index] = ref }
  return [
    <div className={classNames('filters-btn', { open })} onClick={() => setOpen(!open)} role="button" tabIndex="-1">
      <SVGInline svg={filterSvg} /> Filter projects
    </div>,
    <TransitionGroup component={null}>
      {open &&
        <CSSTransition
          key="prj"
          timeout={500}
          classNames="dropdown"
        >
          <div className="filters-dropdown">
            <div className="hider">
              <animated.div className="holder" style={props}>
                <div>
                  <ul>
                  {filters.map((filter, index) => <li onClick={() => _setSubIndex(index)}>{filter.name} <div>{filter.selected.length > 0 && <div className="selected">{filter.selected.length} selected</div>} <Icon type="right" /></div></li>)}
                  </ul>
                </div>
                {subIndex.map((index, inIndex) => {
                  let options = filters[subIndex[0]].options
                  let sub = filters[subIndex[0]]
                  for(let i = 1; i <= inIndex; i += 1){
                    sub = options[subIndex[i]]
                    options = options[subIndex[i]].options
                  }
                  return (
                    <div className="sub">
                      <div className="top">
                        <Button type="link" icon="left" onClick={back}>Back</Button>
                        {sub.selected && sub.selected.length > 0 &&
                        <div className="selected">
                          {sub.selected.length} selected
                        </div>
                        }
                      </div>
                      <ul ref={handleSubRef(inIndex)}>
                        {options.map((opt, optIndex) =>
                          <li className={classNames({ selected: sub.selected.indexOf(optIndex) !== -1 })} onClick={() => setFilter(opt, optIndex)}>
                            {opt.name}
                            {opt.options && <div><Icon type="right" /></div>}
                          </li>)}
                      </ul>
                    </div>
                  )
                })}
                {/* {subIndex.length > 0 &&
                  <div className="sub">
                    <div className="top">
                      <Button type="link" icon="left" onClick={back}>Back</Button>
                      {filters[subIndex].selected.length > 0 &&
                        <div className="selected">
                          {filters[subIndex].selected.length} selected
                        </div>
                      }
                    </div>
                    <ul ref={handleSubRef}>
                      {filters[subIndex].options.map((opt, optIndex) =>
                        <li className={classNames({ selected: filters[subIndex].selected.findIndex(it => it.name === opt.name) !== -1 })} onClick={() => setFilter(opt, optIndex)}>
                          {opt.name}
                        </li>)}
                    </ul>
                  </div>
                } */}
                {/* {subSubIndex > -1 &&
                  <div className="sub sub">
                    <div className="top">
                      <Button type="link" icon="left" onClick={back}>Back</Button>
                      {filters[subIndex].options.selected.length > 0 &&
                        <div className="selected">
                          {filters[subIndex].selected.length} selected
                        </div>
                      }
                    </div>
                    <ul ref={handleSubRef}>
                      {filters[subIndex].options[subSubIndex].options.map((opt, optIndex) =>
                        <li className={classNames({ selected: filters[subIndex].selected.findIndex(it => it.name === opt.name) !== -1 })} onClick={() => setFilter(opt, optIndex)}>
                          {opt.name}
                        </li>)}
                    </ul>
                  </div>
                } */}
              </animated.div>
            </div>
          </div>
        </CSSTransition>
      }
    </TransitionGroup>
  ]
}

export default FilterBar
