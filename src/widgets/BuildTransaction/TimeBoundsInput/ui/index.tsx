"use client";

import { FC, useEffect, useState } from "react";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import { useSearchParams } from "next/navigation";

const TimeBoundsInput: FC = () => {
  const { tx, setTimeCondition } = useStore(useShallow((state) => state));

  const searchParams = useSearchParams();
  const setTimeBoundsToFiveMinutes = () => {
    const now = Math.floor(Date.now() / 1000);
    setTimeCondition(now, now + 300);
  };
  const initialMinTime =
    Number(searchParams.get("lowerTime")) || tx.tx.cond?.time?.min_time || 0;
  const initialMaxTime =
    Number(searchParams.get("upperTime")) || tx.tx.cond?.time?.max_time || 0;
  const [minTime, setMinTime] = useState(initialMinTime);
  const [maxTime, setMaxTime] = useState(initialMaxTime);

  useEffect(() => {
    setTimeCondition(minTime, maxTime);
  }, [minTime, maxTime, setTimeCondition]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lowerTime", minTime.toString());
    params.set("upperTime", maxTime.toString());
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [minTime, maxTime]);

  return (
    <div>
      <h4>Time Bounds</h4>
      <input
        placeholder="Lower time bound unix timestamp. Ex: 1479151713"
        value={
          tx.tx.cond?.time?.min_time === 0 ? "" : tx.tx.cond?.time?.min_time
        }
        onChange={(e) => setMinTime(Number(e.target.value))}
      />
      <div className="flex">
        <input
          placeholder="Upper time bound unix timestamp. Ex: 1479151713"
          value={
            tx.tx.cond?.time?.max_time === 0 ? "" : tx.tx.cond?.time?.max_time
          }
          onChange={(e) => setMaxTime(Number(e.target.value))}
        />
        <button
          onClick={setTimeBoundsToFiveMinutes}
          style={{ paddingRight: "60px" }}
        >
          Set to 5 minutes from now
        </button>
      </div>
    </div>
  );
};

export default TimeBoundsInput;
