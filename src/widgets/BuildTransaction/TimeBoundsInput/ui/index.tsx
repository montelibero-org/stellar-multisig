import { FC } from "react";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";

const TimeBoundsInput: FC = () => {
  const { tx, setTimeCondition } = useStore(useShallow((state) => state));

  const setTimeBoundsToFiveMinutes = () => {
    const now = Math.floor(Date.now() / 1000);
    setTimeCondition(now, now + 300);
  };

  return (
    <div>
      <h4>Time Bounds</h4>
      <input
        placeholder="Lower time bound unix timestamp. Ex: 1479151713"
        value={
          tx.tx.cond?.time?.min_time === 0 ? "" : tx.tx.cond?.time?.min_time
        }
        onChange={(e) => {
          setTimeCondition(
            Number(e.target.value),
            Number(tx.tx.cond.time.max_time)
          );
        }}
      />
      <input
        placeholder="Upper time bound unix timestamp. Ex: 1479151713"
        value={
          tx.tx.cond?.time?.max_time === 0 ? "" : tx.tx.cond?.time?.max_time
        }
        onChange={(e) => {
          setTimeCondition(
            Number(tx.tx.cond.time.min_time),
            Number(e.target.value)
          );
        }}
      />
      <button onClick={setTimeBoundsToFiveMinutes}>
        Set to 5 minutes from now
      </button>
    </div>
  );
};

export default TimeBoundsInput;
