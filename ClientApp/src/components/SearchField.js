import React from "react";
import { TextField, InputAdornment } from "@material-ui/core";
import { Search } from "@material-ui/icons";

const SearchField = props => (
  <TextField
    {...props}
    id="input-with-icon-textfield"
    className="float-right"
    placeholder="Søg..."
    variant="outlined"
    InputProps={{
      startAdornment: (
        <InputAdornment position="end">
          <Search />
        </InputAdornment>
      ),
      onChange: event => props.onChange(event)
    }}
  />
);

export default SearchField;
