

(function($) {
    var checkOtherBudgetItemLabel = function(select) {
        //show or hide the associated budgetitem_set-*-other_extra field depending on the selected label
        var selected = select.options[select.selectedIndex].value;
        if ( selected == 1 || selected == 2 || selected == 3 )
            $("input[name='budgetitem_set-"+ select.name.split('-')[1] +"-other_extra']").show()
        else
            $("input[name='budgetitem_set-"+ select.name.split('-')[1] +"-other_extra']").hide();
    };

    var checkPartnerType = function(select) {
        //show or hide the associated partnership_set-*-funding_amount field depending on the selected partner type
        var selected = select.options[select.selectedIndex].value;
        if ( selected == 'funding' )
            $("input[name='partnership_set-"+ select.name.split('-')[1] +"-funding_amount']").show()
        else
            $("input[name='partnership_set-"+ select.name.split('-')[1] +"-funding_amount']").hide();
    };

    $(document).ready(function($) {
        //find all inputs named budgetitem_set-*-other_extra except budgetitem_set-__prefix__-other_extra
        $("input[name^='budgetitem_set-'][name$='-other_extra'][name!='budgetitem_set-__prefix__-other_extra']").each(function(i) {
            var select = $("select[name='budgetitem_set-" + i + "-label']");
            checkOtherBudgetItemLabel(select[0]);
        })

        $("select[name^='budgetitem_set-'][name$='-label']").change(function() {
            checkOtherBudgetItemLabel(this);
        })

        //find all inputs named partnership_set-*-funding_amount except partnership_set-__prefix__-funding_amount
        $("input[name^='partnership_set-'][name$='-funding_amount'][name!='partnership_set-__prefix__-funding_amount']").each(function(i) {
            var select = $("select[name='partnership_set-" + i + "-partner_type']");
            checkPartnerType(select[0]);
        })

        $("select[name^='partnership_set-'][name$='-partner_type']").change(function() {
            checkPartnerType(this);
        })
    });
})(django.jQuery);
