import { useEffect, useRef, useState } from "react";

function CustomSelect({ options, value, placeholder = "Select", onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`custom-select ${isOpen ? "open" : ""}`} ref={selectRef}>
      <button
        type="button"
        className="select-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{value || placeholder}</span>
        <svg
          aria-hidden="true"
          focusable="false"
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <path
            d="M2 4.5L6 8.5L10 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && (
        <ul className="select-options">
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                className="select-option"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;
