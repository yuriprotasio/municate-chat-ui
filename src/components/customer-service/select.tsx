import { get } from "lodash";
import { useEffect, useState } from "react";

const SuggestionList = (props: any) => {
  const {
    suggestions,
    inputValue,
    onSelectSuggestion,
    displaySuggestions,
    selectedSuggestion
  } = props;

  if (displaySuggestions) {
    if (suggestions.length > 0) {
      return (
        <ul className="suggestions-list border-gray-400  border-b-[1px] border-l-[1px] border-r-[1px]">
          {suggestions.map((suggestion: any, index: any) => {
            const isSelected = selectedSuggestion === index;
            const classname = `suggestion ${isSelected ? "selected" : ""} hover:bg-blue-100 cursor-pointer border-gray-100 border-[1px] py-[8px] px-[8px] whitespace-nowrap text-ellipsis overflow-hidden`;
            return (
              <li
                key={index}
                className={classname}
                onClick={() => onSelectSuggestion(index)}
              >
                {suggestion.name} | {suggestion.email}
              </li>
            );
          })}
        </ul>
      );
    } else {
      return <div>No suggestions available...</div>;
    }
  }
  return <></>;
};

export default function Select ({ list = [], defaultSelected, onSelect, onClear }: any) {
  const [inputValue, setInputValue] = useState(defaultSelected?.name || '');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [displaySuggestions, setDisplaySuggestions] = useState(false);
  const [optionSelected, setOptionSelected] = useState(defaultSelected || {})

  useEffect(() => {
    document.addEventListener("mousedown", (e: any) => {
      if (e.target.id === 'select' || e.target.tagName === 'LI') return
      setDisplaySuggestions(false)
    });
  }, [])

  const onChange = (event: any) => {
    const value = event.target.value;
    setInputValue(value);
    
    if (!value) {
      setFilteredSuggestions(list);
      setDisplaySuggestions(true);
      return
    }
  
    const filteredSuggestions = list.filter((item: any) =>
      get(item, 'name', '').toLowerCase().includes(value.toLowerCase()) || get(item, 'email', '').toLowerCase().includes(value.toLowerCase())
    );


    setFilteredSuggestions(filteredSuggestions);
    setDisplaySuggestions(true);
  };

  const onSelectSuggestion = (index: any) => {
    setSelectedSuggestion(index);
    setInputValue(`${get(filteredSuggestions, '[' + index + '].name')}`);
    setFilteredSuggestions([]);
    setDisplaySuggestions(false);
    setOptionSelected(filteredSuggestions[index])
    onSelect(filteredSuggestions[index])
  };

  const clearOptionSelected = () => {
    setInputValue('')
    setOptionSelected({})
    onClear()
  }

  return (
    <div>
      {get(optionSelected, 'name') && <div className="p-[6px] border-gray-400 border-[1px] rounded-md w-[100%]">
        {inputValue}
        <span className="float-right px-[10px] pt-[10px] pb-[16px] cursor-pointer font-semibold text-xl leading-[0px] bg-gray-50 hover:bg-gray-100 rounded-md" onClick={() => clearOptionSelected()}>x</span></div>}
      {!get(optionSelected, 'name') && <input id="select" placeholder="Selecione o operador" onClick={onChange} onChange={onChange} value={inputValue} className="p-[6px] border-gray-400 border-[1px] rounded-md w-[100%] outline-2 outline-blue-500/50"></input>}
        <SuggestionList inputValue={inputValue}
        selectedSuggestion={selectedSuggestion}
        onSelectSuggestion={onSelectSuggestion}
        displaySuggestions={displaySuggestions}
        suggestions={filteredSuggestions} />
    </div>
  )
}