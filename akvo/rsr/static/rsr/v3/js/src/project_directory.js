function insertParam(key, value)
{
    key = encodeURI(key); value = encodeURI(value);
    var kvp = document.location.search.substr(1).split('&');
    var i=kvp.length; var x; while(i--)
    {
        x = kvp[i].split('=');
        if (x[0]==key)
        {
            x[1] = value;
            kvp[i] = x.join('=');
            break;
        }
    }
    if(i<0) {kvp[kvp.length] = [key,value].join('=');}

    // Reload the page
    document.location.search = kvp.join('&');
}


$(document).ready(function(){

  // Submit filter form on select change
  $('#filter select').change(function() {
    $('#filterForm').submit();
  });

  // setup Bloodhound for typeahead
  var projects = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('background',
                                                         'current_image_credit',
                                                         'current_status',
                                                         'project_plan',
                                                         'project_plan_summary',
                                                         'subtitle',
                                                         'title'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/rest/v1/project/?format=json&limit=10000',
      filter: function(response) {
        f = [
          'id',
          'background',
          'current_image_credit',
          'current_status',
          'project_plan',
          'project_plan_summary',
          'subtitle',
          'title'
        ];
        return _.map(response.results, _.partialRight(_.pick, f));
      }
    }
  });

  var focus_areas = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/rest/v1/focus_area/?format=json&limit=1000',
      filter: function(response) {
        f = [
          'id',
          'name',
          'slug'
        ];
        return _.map(response.results, _.partialRight(_.pick, f));
      }
    }
  });

  projects.initialize();
  focus_areas.initialize();

  $('#id_title').typeahead(
    {
      highlight: true
    },
    {
      name: 'projects',
      displayKey: 'title',
      source: projects.ttAdapter(),
      templates: {
        header: '<h3 class="dd-category">Projects</h3>',
        suggestion: _.template('<a href="/project/<%= id %>"><p><%= title %>!</p><p><%= subtitle %></p></a>')
       }
    },
    {
      name: 'focus_areas',
      displayKey: 'name',
      source: focus_areas.ttAdapter(),
      templates: {
        header: '<h3 class="dd-category">Filter on focus area</h3>',
        suggestion: _.template('<a class="filter_focus_area"><%= name %></a>')
       }
    }
  );

  $('#filterForm').on('click', '.filter_focus_area', function (event) {
    var tmp = $('#id_title').val();
    $('select#id_focus_area option').filter(function() {
      return $(this).text() == tmp;
    }).prop('selected', true);
    $('#id_title').val('');
    $('#filterForm').submit();
  });

  $('#filterForm').on('mouseover', '.filter_focus_area', function (event) {
    $('#collapseOne').addClass('in');
    $('select#id_focus_area option').filter(function() {
      return $(this).text() == $(this).val();
    }).prop('selected', true);
  });

  $('#filterForm').on('mouseout', '.filter_focus_area', function (event) {
    $('#collapseOne').removeClass('in');
  });

  $('#sortByDropdown').on('click', 'a', (function(event) {
    insertParam('sort_by', $(event.target).attr('param'));
  }));

  // var googleMap = {
  //   canvas: document.getElementById('haj'),
  //   options: {
  //     mapTypeId: google.maps.MapTypeId.ROADMAP,
  //     streetViewControl: false,
  //     scrollwheel: false
  //   },
  //   load: function() {
  //     var map = new google.maps.Map(this.canvas, this.options);
  //     var bounds = new google.maps.LatLngBounds();
  //   }
  // };
  // googleMap.load();




  // $('.akvo_map').each(function() {
  //   var mapId = $(this).attr('id');
  //   var domNode = document.getElementById("haj");
  //   // var mapObj = window[mapId];

  //   var googleMap = {
  //     // canvas: document.getElementById($(this).attr('id')),
  //     // mapObj: window[mapId],
  //     mapObj: window[mapId],

  //     options: {
  //           mapTypeId: google.maps.MapTypeId.ROADMAP,
  //           streetViewControl: false,
  //           scrollwheel: false
  //     },
  //     // locations: this.mapObj["locations"],
  //     // locations: this.mapObj["locations"],
  //     load: function() {
  //       // console.log(this.mapObj);
  //       // console.log(this.domNode);
  //       var map = new google.maps.Map(document.getElementById("haj"),
  //                                     this.options);
  //       //var bounds = new google.maps.LatLngBounds();
  //       // $.each(this.mapObj["locations"], function(index, value) {
  //       //   console.log(value);
  //       //   var position = new google.maps.LatLng(value['latitude'], value['longitude']);
  //       //   var marker = new google.maps.Marker({
  //       //     icon: 'haj.png',
  //       //     position: position,
  //       //     map: map
  //       //   });

  //       //   // bounds.extend(marker.position);

  //       //   // console.log(value);

  //       //   // var position = new google.maps.LatLng(this.locations[i][0], this.locations[i][1]);
  //       //   // var marker = new google.maps.Marker({
  //       //   //   icon: '{{ marker_icon }}',
  //       //   //   position: position,
  //       //   //   map: map
  //       //   // });
  //       //   // map.fitBounds(bounds);
  //       //   // map.panToBounds(bounds);

  //       // });
  //     }
  //   };
  //   googleMap.load();

  //   // window.onload = function (){googleMap.load()};

  //   // var map_data = window[$(this).attr('id')];
  //   // console.log(map_data);

  //   // $.each($(this).attr('id')  , function(index, value) {
  //   //   alert(value);
  //   // });
  //   // alert($(this).attr('id'));
  // });

});
