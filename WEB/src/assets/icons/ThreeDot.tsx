
import React from 'react'
interface ThreeDotProps {
    onClick: () => void;
  }

const ThreeDot = (props: ThreeDotProps) => {
  return (
    <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 0C1.55229 0 2 0.447733 2 1C2 1.55227 1.55229 2 1 2C0.447713 2 0 1.55227 0 1C0 0.447733 0.447713 0 1 0ZM5 0C5.55227 0 6 0.447733 6 1C6 1.55227 5.55227 2 5 2C4.44773 2 4 1.55227 4 1C4 0.447733 4.44773 0 5 0ZM9 0C9.55227 0 10 0.447733 10 1C10 1.55227 9.55227 2 9 2C8.44773 2 8 1.55227 8 1C8 0.447733 8.44773 0 9 0Z" fill="white"/>
    </svg>
  )
}

export default ThreeDot