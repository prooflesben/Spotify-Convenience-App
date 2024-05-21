import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Button,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import "../App.css";
import React from "react";

function Select() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (eventKey) => {
    setSelectedOption(eventKey);
  };

  const convertSelected = () => {
    if(selectedOption === "1 month"){
      return 1;
    }
    else if(selectedOption === "3 months"){
      return 3;
    }
    else if(selectedOption === "1 year"){
      return 12;
    }

    else {
      return -1;
    }
  } 

  const handleSumbit = () => {
    const selected = convertSelected();
    if(selected === -1){
      setSelectedOption("Please Select a time period");
    }
    else {
     window.location.href = `http://localhost:3000/playlistView/${convertSelected(selectedOption)}`; 
    }
  }

  return (
    <div className="App">
      <h1>Select how far back you would like to make your playlist</h1>
      <Dropdown onSelect={handleSelect}>
        <DropdownToggle variant="success" id="timeRangeDropdown">
          {selectedOption ? `${selectedOption}` : "Select Time Range"}
        </DropdownToggle>

        <DropdownMenu>
          <DropdownItem eventKey="1 month">1 month</DropdownItem>
          <DropdownItem eventKey="3 months">3 months</DropdownItem>
          <DropdownItem eventKey="1 year">1 year</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Button 
      variant="primary"
      // need to get the menu selection and do validation
      onClick={handleSumbit}>
        Submit Range
      </Button>
    </div>
  );
}

export default Select;
