import { useRef, useState } from 'react'

type Item = {
  title: string
  content: string
}

type Props = {
  items: Item[]
}

const ButtonDisclosure = ({ items }: Props) => {
  const [openStatus, setOpenStatus] = useState<boolean[]>(Array(items.length).fill(false))
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])

  const toggleDisclosure = (index: number) => {
    setOpenStatus(openStatus.map((status, i) => (i === index ? !status : status)))
  }

  const contentStyles = openStatus.map((isOpen, index) => ({
    maxHeight: isOpen ? `${contentRefs.current[index]?.scrollHeight}px` : '0px',
    overflow: 'hidden',
    transitionDuration: '0.3s'
  }))

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <button
            onClick={() => toggleDisclosure(index)}
            aria-expanded={openStatus[index]}
            aria-controls={`Disclosure-content-${index}`}
            id={`Disclosure-header-${index}`}
            type="button"
          >
            {item.title}
          </button>
          <div
            id={`Disclosure-content-${index}`}
            aria-hidden={!openStatus[index]}
            ref={(el) => (contentRefs.current[index] = el)}
            style={contentStyles[index]}
          >
            <div>{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ButtonDisclosure
