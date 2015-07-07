function buildReactComponents(placeholder, typeaheadOptions, typeaheadCallback, displayOption, selector, childClass, valueId, label, help, filterOption) {
    var Typeahead, TypeaheadLabel, TypeaheadContainer;

    Typeahead = ReactTypeahead.Typeahead;   

    var inputClass = selector + " form-control " + childClass;

    TypeaheadContainer = React.createClass({
        render: function() {
            return (
                    <div>
                        <Typeahead
                            placeholder={placeholder}
                            options={typeaheadOptions}
                            onOptionSelected={typeaheadCallback}
                            maxVisible={10}
                            displayOption={displayOption}
                            filterOption={filterOption}
                            childID={selector}
                            customClasses={{
                              typeahead: "",
                              input: inputClass,
                              results: "",
                              listItem: "",
                              token: "",
                              customAdd: "",           
                            }}
                            inputProps={{
                                name: selector, 
                                id: selector,
                            }} />
                    </div>
            );
        }
    });

    React.render(
        <TypeaheadContainer />,
        document.querySelector('.' + selector)
    );

    if (valueId !== null) {
        for (var i = 0; i < typeaheadOptions.length; i++) {
            if (parseInt(typeaheadOptions[i].id, 10) == parseInt(valueId, 10)) {
                var savedResult = typeaheadOptions[i];
                $('.' + selector + ' .typeahead' + ' input').attr('value', savedResult.id);
                $('.' + selector + ' .typeahead' + ' input').prop('value', savedResult[filterOption]);   
            }
        }
    }
  
    $('.' + selector + ' .typeahead').append(label);
    $('.' + selector + ' .typeahead').append(help);   
    $('.' + selector).addClass('has-typeahead');
}          