import React from "react";
import TextFuild from "@material-ui/core/TextField";

const TextInput = (props) => {
  return (
    <TextFuild
      fullWidth={props.fullWidth}
      label={props.label}
      margin="dense"
      multiline={props.multiline}
      require={props.require}
      rows={props.rows}
      value={props.value}
      type={props.type}
      onChange={props.onChange}
    />
  );
};

export default TextInput;
