// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

// Jquery dependent code
$(function() {
    // When an avatar image is selected
    $("#id_avatar").change(function() {
        var too_large_text = JSON.parse(document.getElementById("my-details-text").innerHTML)
            .too_large_text;
        var file = this.files[0],
            fileName = file.name,
            fileSize = file.size,
            msg;
        if (fileSize > 8388608) {
            // 8Mb
            msg = fileName + " " + too_large_text + " (8Mb)"; // 8 Mb setting should come from configs
            $("#profile").prepend(AKVO_RSR.utils.alertSnippet(msg));
            AKVO_RSR.utils.resetFormElement($("#id_avatar"));
            AKVO_RSR.utils.scheduleAlertFade(4000);
        } else {
            $(".btn").prop("disabled", true);
            $(".btn").attr("disabled", true);
            $("#avatarForm").submit();
        }
    });

    // Auto dismiss alerts
    $(".alert").alert();
    window.setTimeout(function() {
        $(".alert").alert("close");
    }, 2000);

    // Form for updating details
    $("#profileForm").submit(function(event) {
        var close_text = JSON.parse(document.getElementById("my-details-text").innerHTML)
            .close_text;
        var details_updated_text = JSON.parse(document.getElementById("my-details-text").innerHTML)
            .details_updated_text;

        serializedData = {};

        $.each($(this).serializeArray(), function(i, obj) {
            serializedData[obj.name] = obj.value;
        });

        $.ajax({
            type: "POST",
            url: JSON.parse(document.getElementById("akvo-rsr-ajax-url").innerHTML).ajaxUrl,
            data: JSON.stringify(serializedData),
            contentType: "application/json; charset=UTF-8",
            success: function(response) {
                $("#profile").prepend(
                    '<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">' +
                        close_text +
                        "</span></button>" +
                        details_updated_text +
                        "</div>"
                );
                window.setTimeout(function() {
                    $(".alert")
                        .fadeTo(500, 0)
                        .slideUp(500, function() {
                            $(this).remove();
                        });
                }, 2000);
            },
            error: function(response) {
                jsonValue = $.parseJSON(response.responseText);

                $.each(jsonValue, function(key, value) {
                    $("#profile").prepend(
                        '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">' +
                            close_text +
                            "</span></button>" +
                            value +
                            "</div>"
                    );
                });

                window.setTimeout(function() {
                    $(".alert")
                        .fadeTo(500, 0)
                        .slideUp(500, function() {
                            $(this).remove();
                        });
                }, 2000);
            }
        });

        event.preventDefault();
    });
});
