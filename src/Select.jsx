import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Button,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import "./App.css";
import React from "react";

function Select() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (eventKey) => {
    setSelectedOption(eventKey);
  };

  return (
    <div className="App">
      <h1>Select how far back you would like to make your playlist</h1>
      <Dropdown onSelect={handleSelect}>
        <DropdownToggle variant="success" id="timeRangeDropdown">
          {selectedOption ? `${selectedOption}` : "Select Time Range"}
        </DropdownToggle>

        <DropdownMenu>
          <DropdownItem eventKey="1-month">1 month</DropdownItem>
          <DropdownItem eventKey="3-months">3 months</DropdownItem>
          <DropdownItem eventKey="1-year">1 year</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Button 
      variant="primary"
      href= "http://localhost:5173/playlist/1">
        Submit Range
      </Button>
    </div>
  );
}

export default Select;
