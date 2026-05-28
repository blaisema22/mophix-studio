import React from 'react'

const Panel = ({ as = 'div', children, className = '', ...props }) => {
  const Tag = as
  return (
    <Tag className={`rounded-[1.75rem] border border-orange-400/20 bg-black-dark p-8 shadow-xl ${className}`} {...props}>
      {children}
    </Tag>
  )
}

export default Panel
