import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

function IxRadioVanilla({ value, label, labelPlacement }) {
  return (
    <div>
      <FormControl component="fieldset">
        <RadioGroup row aria-label="position" name="position" defaultValue="top">
          <FormControlLabel
            value={value}
            control={<Radio color="primary" />}
            label={label}
            labelPlacement={labelPlacement}
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default IxRadioVanilla;
