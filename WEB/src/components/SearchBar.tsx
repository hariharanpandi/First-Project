import { useState } from "react";
import SearchIcon from "../assets/icons/SearchIcon";
// import { ReactComponent as SearchIcon } from "./search-icon.svg";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className="graph-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderRadius: "8px",
          justifyContent: "space-around",
          padding: "0.5rem",
          backgroundColor: "#20262D",
          gap: '0.75rem',
          height: '2rem',
        }}
      >
        <SearchIcon />
        {/* <SearchIcon style={{ marginRight: "8px" }} /> */}
        <input
          className="global-search"
          type="text"
          placeholder="Search"
          value={query}
          onChange={handleInputChange}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.ctrlKey && event.key === "k") {
              event.preventDefault();
            }
          }}
          style={{
            border: "none",
            outline: "none",
            flex: 1,
            backgroundColor: "#20262D",
            gap: "2%",
            fontFamily: "Inter",
          }}
        />
      </div>
      <span className="ctrl-k">ctrl+k</span>
    </div>
  );
};

export default SearchBar;
