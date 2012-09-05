

(function($) {
    var checkOtherBudgetItemLabel = function(select) {
        //show or hide the associated budget_items-*-other_extra field depending on the selected label
        var selected = select.options[select.selectedIndex].value;
        if ( selected == 1 || selected == 2 || selected == 3 )
            $("input[name='budget_items-"+ select.name.split('-')[1] +"-other_extra']").show()
        else
            $("input[name='budget_items-"+ select.name.split('-')[1] +"-other_extra']").hide();
    };

    var checkPartnerType = function(select) {
        //show or hide the associated partnerships-*-funding_amount field depending on the selected partner type
        var selected = select.options[select.selectedIndex].value;
        if ( selected == 'funding' )
            $("input[name='partnerships-"+ select.name.split('-')[1] +"-funding_amount']").show()
        else
            $("input[name='partnerships-"+ select.name.split('-')[1] +"-funding_amount']").hide();
    };

    $(document).ready(function($) {
        //find all inputs named budget_items-*-other_extra except budget_items-__prefix__-other_extra
        $("input[name^='budget_items-'][name$='-other_extra'][name!='budget_items-__prefix__-other_extra']").each(function(i) {
            var select = $("select[name='budget_items-" + i + "-label']");
            checkOtherBudgetItemLabel(select[0]);
        })

        $("select[name^='budget_items-'][name$='-label']").change(function() {
            checkOtherBudgetItemLabel(this);
        })

        //find all inputs named partnerships-*-funding_amount except partnerships-__prefix__-funding_amount
        $("input[name^='partnerships-'][name$='-funding_amount'][name!='partnerships-__prefix__-funding_amount']").each(function(i) {
            var select = $("select[name='partnerships-" + i + "-partner_type']");
            checkPartnerType(select[0]);
        })

        $("select[name^='partnerships-'][name$='-partner_type']").change(function() {
            checkPartnerType(this);
        })
    });
})(django.jQuery);
