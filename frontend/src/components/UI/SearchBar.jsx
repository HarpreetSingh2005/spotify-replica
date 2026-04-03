import "./SearchBar.css";

const SearchBar = ({ value, onChange, placeholder = "Search music..." }) => {
  return (
    <div className="search-bar">
      <span className="search-icon">⌕</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;
