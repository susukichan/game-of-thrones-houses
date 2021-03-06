import "./list-item-style.css";
import { DataBlock } from "../DataBlock/DataBlock";
import { House, HouseWithMetadata, mkInitialHouseMetadata } from "../../types";
import { useEffect, useState } from "react";
import { fetchHouseMetaData } from "../../api";

interface ListItemProps {
  house: House;
}

export const ListItem = ({ house }: ListItemProps): JSX.Element => {
  const [houseWithMetadata, setHouseWithMetadata] = useState<HouseWithMetadata>(
    mkInitialHouseMetadata
  );

  useEffect(() => {
    fetchHouseMetaData(house).then(setHouseWithMetadata);
  }, [house]);

  return (
    <div
      className={`list-item list-item__region--${
        house.region.replace(/ /g, "") || null
      }`}
    >
      <DataBlock houseWithMetadata={houseWithMetadata} />
    </div>
  );
};
