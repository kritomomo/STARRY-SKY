import { useRef } from "react";

const usePartying = () => {
  const partyRef = useRef(null);

  const isPartying = () =>
  partyRef.current &&
  partyRef.current.progress() !== 0 &&
  partyRef.current.progress() !== 1;
  
  return { isPartying}
}

export default usePartying
