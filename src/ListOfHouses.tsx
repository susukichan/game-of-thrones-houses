// @ts-nocheck

import { useState, useEffect } from "react";
// import ListItem from "./ListItem";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Loading from "./Loading";
import "./list-of-houses-style.css";

function customTheme(theme: any) {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary25: "orange",
      primary: "green",
    },
  };
}

const optionRegions = [
  { value: "", label: "🗺 In all regions" },
  { value: "The Crownlands", label: "👑 The Crownlands" },
  { value: "The North", label: "🐺 The North" },
  { value: "The Vale", label: "🦅 The Vale" },
  { value: "The Riverlands", label: "🐟 The Riverlands" },
  { value: "Iron Islands", label: "🐙 Iron Islands" },
  { value: "The Westerlands", label: "🐻 The Westerlands" },
  { value: "The Reach", label: "🌼 The Reach" },
  { value: "The Stormlands", label: "🦌 The Stormlands" },
  { value: "Dorne", label: "🔆 Dorne" },
];

const optionProperties = [
  {
    value: "hasWords",
    label: "🎤Has words",
  },
  { value: "hasTitles", label: "🔖Has title" },
  {
    value: "hasSeats",
    label: "🪑Has seats",
  },
  {
    value: "hasDiedOut",
    label: "😵Has died out",
  },
  {
    value: "hasAncestralWeapons",
    label: "🪓Has Ancestral Weapons",
  },
];

const optionPageSize = [
  {
    value: "10",
    label: "10",
  },
  { value: "20", label: "20" },
  {
    value: "30",
    label: "30",
  },
  {
    value: "40",
    label: "40",
  },
  {
    value: "50",
    label: "50",
  },
];

const ListOfHouses = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [houses, setHouses] = useState([]);
  const [region, setRegion] = useState({});
  const [hasWords, setHasWords] = useState(false);
  const [hasTitles, setHasTitles] = useState(false);
  const [hasSeats, setHasSeats] = useState(false);
  const [hasDiedOut, setHasDiedOut] = useState(false);
  const [hasAncestralWeapons, setHasAncestralWeapons] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [hasOptionProperties, setOptionProperties] = useState([]);
  const [linkHeader, setLinkHeader] = useState("");
  const [parsed, setParsed] = useState({});
  // const [houseInput, setHouseInput] = useState("");

  useEffect(() => {
    const set = new Set(hasOptionProperties.map((x) => x.value));
    setHasWords(set.has("hasWords"));
    setHasTitles(set.has("hasTitles"));
    setHasSeats(set.has("hasSeats"));
    setHasDiedOut(set.has("hasDiedOut"));
    setHasAncestralWeapons(set.has("hasAncestralWeapons"));
  }, [hasOptionProperties]);

  useEffect(() => {
    var parse = require("parse-link-header");
    var parsed = parse(linkHeader);
    setParsed(parsed);
  }, [linkHeader]);

  useEffect(() => {}, [parsed]);

  // console.log(linkHeader);

  return (
    <div className="container">
      <div className="select-bar">
        <form
          id="search-form"
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);

            const params = new URLSearchParams(
              Object.fromEntries(
                [
                  ["region", region?.value ?? ""],
                  ["hasWords", hasWords],
                  ["hasTitles", hasTitles],
                  ["hasSeats", hasSeats],
                  ["hasDiedOut", hasDiedOut],
                  ["hasAncestralWeapons", hasAncestralWeapons],
                  ["pageSize", pageSize?.value ?? ""],
                ].filter(([, v]) => Boolean(v))
              )
            );

            fetch(`https://anapioficeandfire.com/api/houses?${params}`)
              .then((x) => x.json())
              .then((rsp) => {
                setHouses(rsp);
                setLoading(false);
              });

            fetch(`https://anapioficeandfire.com/api/houses?${params}`).then(
              (x) => setLinkHeader(x.headers.get("Link"))
            );
          }}
        >
          <Select
            theme={customTheme}
            options={optionRegions}
            onChange={setRegion}
            placeholder="Select a region"
            isSearchable
            className="select-region"
          />
          <Select
            components={makeAnimated()}
            theme={customTheme}
            options={optionProperties}
            onChange={setOptionProperties}
            placeholder="Select properties"
            isMulti
            noOptionsMessage={() => "no other properties 😅"}
            autoFocus
            isSearchable
            className="select-properties"
          />

          <Select
            theme={customTheme}
            options={optionPageSize}
            onChange={setPageSize}
            placeholder="Result per page"
            isSearchable
            className="select-page-size"
          />
          <div>
            <button type="submit" id="search-btn">
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="search-result">
        <h1>houses</h1>
        {/* <div className="list-items">
        {houses.map((house) => (
          <ListItem key={house.url} data={house} />
        ))}
      </div> */}
        {loading ? <Loading /> : <pre>{JSON.stringify(houses, null, 2)}</pre>}
        {/* <pre>{JSON.stringify(houses, null, 2)}</pre> */}
        {/* <h3>route props</h3>
        <pre>{JSON.stringify(props, null, 2)}</pre> */}
      </div>
      <div className="next-prev-buttons">
        {parsed?.prev?.url ? (
          <button
            onClick={() => {
              fetch(parsed.prev.url)
                .then((x) => x.json())
                .then((rsp) => {
                  setHouses(rsp);
                  setLoading(false);
                });

              fetch(parsed.prev.url).then((x) =>
                setLinkHeader(x.headers.get("Link"))
              );
            }}
          >
            Previous page
          </button>
        ) : null}
        {parsed?.next?.url ? (
          <button
            onClick={() => {
              if (parsed?.next?.url) {
                fetch(parsed.next.url)
                  .then((x) => x.json())
                  .then((rsp) => {
                    setHouses(rsp);
                    setLoading(false);
                  });

                fetch(parsed.next.url).then((x) =>
                  setLinkHeader(x.headers.get("Link"))
                );
              } else {
                return null;
              }
            }}
          >
            Next page
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ListOfHouses;
