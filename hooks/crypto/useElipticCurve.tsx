import { ec as EC } from "elliptic";
import { useMemo } from "react";

const useElipticCurve = (curve: string) => {
  const ec = useMemo(() => {
    return new EC(curve);
  }, []);

  return ec;
};

export default useElipticCurve;
