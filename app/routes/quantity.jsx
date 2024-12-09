import { useState,useCallback } from "react";
import { TextField } from "@shopify/polaris";
export default function Quantity({value, getquant}) {
    const [finalquant, updatequant] = useState(value.quantity);
    const handleChange = useCallback(
        (newValue) => {updatequant(newValue);getquant(newValue,value.id);},
        [],
      );
    return (
        <>
            <TextField
                label="Quantity"
                type="number"
                value={finalquant}
                autoComplete="off"
                onChange={handleChange}
            />
        </>
    )
}