import React from 'react'
interface NavIconProps {
    onClick: () => void;
  }

const NavIcon = (props: NavIconProps) => {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="28" height="28" rx="14" fill="#20262D"/>
<g clipPath="url(#clip0_368_5981)">
<path fillRule="evenodd" clipRule="evenodd" d="M10.9108 14.5893C10.5854 14.2639 10.5854 13.7362 10.9108 13.4108L15.6249 8.69672C15.9503 8.37128 16.478 8.37128 16.8034 8.69672C17.1288 9.02215 17.1288 9.54979 16.8034 9.87523L12.6786 14L16.8034 18.1248C17.1288 18.4503 17.1288 18.9779 16.8034 19.3034C16.478 19.6288 15.9503 19.6288 15.6249 19.3034L10.9108 14.5893Z" fill="white"/>
</g>
<rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="white" strokeOpacity="0.1"/>
<defs>
<clipPath id="clip0_368_5981">
<rect width="20" height="20" fill="white" transform="translate(4 4)"/>
</clipPath>
</defs>
</svg>

  )
}

export default NavIcon