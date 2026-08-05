import React from "react";
import Icon from "./Icon";

interface Props {}

const StatusBar = (props: Props) => {
  const {} = props;

  return (
    <div className="relative h-10 w-full bg-brand-primary">
      <span className="absolute left-[19px] top-1/2 -translate-y-1/2 text-sm text-white">
        8:24
      </span>
      <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-white">
        <Icon name="signal_cellular_alt" className="text-[18px]" />
        <Icon name="battery_full" className="text-[18px]" />
      </div>
    </div>
  );
};

export default StatusBar;
