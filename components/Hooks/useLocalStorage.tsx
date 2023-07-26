"use client";

import { useState } from "react";

export default function useLocalStorage(key: string) {
    const getValue = () => {
        const valueString = localStorage.getItem(key);
        if (!valueString) return null;
        const parsedValue = JSON.parse(valueString);
        return parsedValue;
    };

    const [value, setValue] = useState(getValue());
    
    const saveValue = (newValue: any) => {
        const newValueString = JSON.stringify(newValue);
        console.log("setting item with key:", key, "and value:", newValueString, "from value:", newValue);
        localStorage.setItem(key, newValueString);
        setValue(newValue);
    };

    return [value, saveValue];
}