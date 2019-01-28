/*
  Akvo RSR is covered by the GNU Affero General Public License. See more
  details in the license.txt file located at the root folder of the Akvo RSR
  module. For additional details on the GNU license please see
  <http://www.gnu.org/licenses/agpl.html>.
*/

jsPlumb.ready(function() {
    var instance = jsPlumb.getInstance({
        Connector: ["Bezier", { curviness: 20 }],
        DragOptions: { cursor: "pointer", zIndex: 200 },
        PaintStyle: { strokeStyle: "grey", lineWidth: 1 },
        EndpointStyle: { radius: 2, fillStyle: "grey" },
        HoverPaintStyle: { strokeStyle: "orange" },
        EndpointHoverStyle: { fillStyle: "orange" },
        Container: "project-hierarchy"
    });

    instance.doWhileSuspended(function() {
        var arrowCommon = { foldback: 0.7, fillStyle: "grey", width: 7, length: 7 },
            arrow = [["Arrow", { location: 0.5 }, arrowCommon]];

        // Function to off-set arrows based on the index of connector on the
        // element for which we are using the arrows
        var get_two_arrows = function(index) {
            var two_arrows = [
                ["Arrow", { location: Math.max(0.9 - index * 0.1, 0.55) }, arrowCommon],
                [
                    "Arrow",
                    { location: Math.min(0.1 + index * 0.1, 0.45), direction: -1 },
                    arrowCommon
                ]
            ];
            return two_arrows;
        };

        var project_window = $("#project-hierarchy-project");
        var parent_windows = $(".project-hierarchy .project-hierarchy-parent");
        var top_sibling_windows = $(".project-hierarchy .project-hierarchy-sibling-top");
        var bottom_sibling_windows = $(".project-hierarchy .project-hierarchy-sibling-bottom");
        var child_windows = $(".project-hierarchy .project-hierarchy-child");
        var i;

        if (top_sibling_windows.length) {
            // Iterate over top siblings in reverse for symmetry with bottom
            top_sibling_windows = top_sibling_windows.get().reverse();
            instance.addEndpoint(project_window, {
                uuid: "project-top",
                anchor: "Top",
                maxConnections: -1
            });
        }
        if (bottom_sibling_windows.length) {
            instance.addEndpoint(project_window, {
                uuid: "project-bottom",
                anchor: "Bottom",
                maxConnections: -1
            });
        }
        if (child_windows.length) {
            instance.addEndpoint(project_window, {
                uuid: "project-right",
                anchor: "Right",
                maxConnections: -1
            });
        }
        if (parent_windows.length) {
            instance.addEndpoint(project_window, {
                uuid: "project-left",
                anchor: "Left",
                maxConnections: -1
            });
        }

        for (i = 0; i < parent_windows.length; i++) {
            var parent_uuid = parent_windows[i].getAttribute("id") + "-right";
            instance.addEndpoint(parent_windows[i], {
                uuid: parent_uuid,
                anchor: "Right"
            });
            instance.connect({
                uuids: [parent_uuid, "project-left"],
                overlays: arrow,
                connector: ["Bezier", { curviness: 20 }]
            });
        }
        for (i = 0; i < top_sibling_windows.length; i++) {
            var top_sibling_uuid = top_sibling_windows[i].getAttribute("id") + "-bottom";
            instance.addEndpoint(top_sibling_windows[i], {
                uuid: top_sibling_uuid,
                anchor: "Bottom"
            });
            instance.connect({
                uuids: [top_sibling_uuid, "project-top"],
                overlays: get_two_arrows(i),
                connector: ["Bezier", { curviness: ((i + 1) * 20) % 100 }]
            });
        }
        for (i = 0; i < bottom_sibling_windows.length; i++) {
            var bottom_sibling_uuid = bottom_sibling_windows[i].getAttribute("id") + "-top";
            instance.addEndpoint(bottom_sibling_windows[i], {
                uuid: bottom_sibling_uuid,
                anchor: "Top"
            });
            instance.connect({
                uuids: [bottom_sibling_uuid, "project-bottom"],
                overlays: get_two_arrows(i),
                connector: ["Bezier", { curviness: ((i + 1) * 10) % 100 }]
            });
        }
        for (i = 0; i < child_windows.length; i++) {
            var child_uuid = child_windows[i].getAttribute("id") + "-left";
            instance.addEndpoint(child_windows[i], {
                uuid: child_uuid,
                anchor: "Left"
            });
            instance.connect({
                uuids: ["project-right", child_uuid],
                overlays: arrow,
                connector: ["Bezier", { curviness: 20 }]
            });
        }
    });
});
