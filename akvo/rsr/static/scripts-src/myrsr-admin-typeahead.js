/** @jsx React.DOM */
function buildReactComponents(placeholder, typeaheadOptions, typeaheadCallback, displayOption, selector, valueId, label, help) {
    var Typeahead, TypeaheadLabel, TypeaheadContainer;

    Typeahead = ReactTypeahead.Typeahead;   

    var inputClass = selector + " form-control";

    TypeaheadContainer = React.createClass({displayName: 'TypeaheadContainer',
        render: function() {
            return (
                    React.DOM.div(null, 
                        Typeahead(
                            {placeholder:placeholder,
                            options:typeaheadOptions,
                            onOptionSelected:typeaheadCallback,
                            maxVisible:10,
                            displayOption:displayOption,
                            filterOption:"title",
                            childID:selector,
                            customClasses:{
                              typeahead: "",
                              input: inputClass,
                              results: "",
                              listItem: "",
                              token: "",
                              customAdd: "",           
                            },
                            inputProps:{
                                name: selector, 
                                id: selector,
                            }} )
                    )
            );
        }
    });

    React.render(
        TypeaheadContainer(null ),
        document.querySelector('.' + selector)
    );

    var savedResult;

    if (valueId !== null) {
        for (var i = 0; i < typeaheadOptions.length; i++) {
            if (parseInt(typeaheadOptions[i].id, 10) == parseInt(valueId, 10)) {
                savedResult = typeaheadOptions[i];
                $('.' + selector + ' .typeahead' + ' input').attr('value', savedResult.id);
                $('.' + selector + ' .typeahead' + ' input').prop('value', savedResult.title);   
            }
        }
    }
  
    $('.' + selector + ' .typeahead').append(label);
    $('.' + selector + ' .typeahead').append(help);   
    $('.' + selector).addClass('has-typeahead');
}          