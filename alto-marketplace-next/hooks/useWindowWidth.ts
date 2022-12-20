import { useEffect, useState } from "react"

export const useWindowWidth = (breakPoints: [ number, number, number ] = [ 1024, 768, 576 ]) => {
  const [ widerThanLarge, setLarge ] = useState<boolean>(true)
  const [ widerThanMedium, setMedium ] = useState<boolean>(true)
  const [ widerThanSmall, setSmall ] = useState<boolean>(true)

  useEffect(() => {
    function handleResize() {
      setLarge(!!window?.innerWidth && window.innerWidth >= breakPoints[0])
      setMedium(!!window?.innerWidth && window.innerWidth >= breakPoints[1])
      setSmall(!!window?.innerWidth && window.innerWidth >= breakPoints[2])
    }
    handleResize()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [ breakPoints ])

  return {
    widerThanLarge,
    widerThanMedium,
    widerThanSmall
  }
}