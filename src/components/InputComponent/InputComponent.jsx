import { Input } from 'antd'
import React from 'react'

export default function InputComponent({ children, size, placeholder, bodered, style, ...rests }) {
  return (
    <Input size={size} placeholder={placeholder} bordered={bodered} style={style} {...rests}>
      {children}
    </Input>
  )
}
