import "./TabSwitcher.css";

const TabSwitcher = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tab-switcher">
      <button
        className={activeTab === "music" ? "active" : ""}
        onClick={() => setActiveTab("music")}
      >
        Music
      </button>

      <button
        className={activeTab === "albums" ? "active" : ""}
        onClick={() => setActiveTab("albums")}
      >
        Albums
      </button>
    </div>
  );
};

export default TabSwitcher;
