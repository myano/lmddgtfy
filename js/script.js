$(document).ready(function() {
  // variables
  var searchInput = $('#search-input'),
      urlResult = $('#url-result'),
      cursor = $('#cursor'),
      previewSearchLink = $('.preview-search-link');

  // display the current location for the shareable url
  urlResult.attr("value", window.location);
  // keep the shareable text selected
  urlResult.mouseup(function() {
    this.select()
  });
  // select the shareable url when they focus on it
  urlResult.focus(function() {
    this.select();
  });

  if (localStorage["theme"] == "dark") {
    $('body').addClass('dark-theme').removeClass('light-theme');
    $('#ddg-logo').attr('src', 'img/ddg-logo-dark-theme.png');
    $('#ddg-theme-url-param').attr("value", "d");
  }
  else if (localStorage["theme"] == "light") {
    $('body').addClass('light-theme').removeClass('dark-theme');
    $('#ddg-logo').attr('src', 'img/ddg-logo-light-theme.png');
    $('#ddg-theme-url-param').attr("value", "-1");
  }

  // if they're giving the link to someone else
  if (window.location.search == "") {
    // make the shareable link display the URL in the address bar
    urlResult.attr("value", window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search);

    // when they submit the search form
    $('#search-form').submit(function(event) {
      // don't do anything
      event.preventDefault();
      event.stopPropagation();

      // redirect
      window.location = urlResult.attr("value");

      return false;
    });

    // when they press a key
    searchInput.keyup(function(event) {
      var searchVal = $('#search-input').val();
      
      $(this).attr("value", $(this).val());

      // make the link below the search bar show the right text and link to the right place
      urlResult.attr("value", window.location.protocol + "//" + window.location.host + window.location.pathname + "?q=" + encodeURIComponent(searchVal));

      // update the preview link
      previewSearchLink.attr("href", window.location.protocol + "//" + window.location.host + window.location.pathname + "?q=" + encodeURIComponent(searchVal));
    });
  }
  // if they're following a link someone else gave them
  else {
    // decode the user's search
    var urlDecoded = decodeURIComponent(window.location.search);

    // trim off everything but the search term
    if (urlDecoded.substr(0, 3) == "?q=") {
      // trim off the "?q=" part of the url
      urlDecoded = urlDecoded.substr(3);
    }

    if (urlDecoded.length > 0) {
      // show the default cursor
      cursor.show();
      cursor.attr("src", "img/cursor-default.png");

      // make sure the link shows the right text and links to the right place
      urlResult.text(window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search);
      urlResult.attr("href", window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search);

      if ($('body').width() > 650) {
        // animate the cursor down to the search bar
        cursor.animate({
          top: '20px',
          left: '400px'
        }, 2250);

        // change the cursor to the I-beam when over the search bar
        setTimeout(function() {
          cursor.attr("src", "img/cursor-text.png");
        }, 1500);

        // type the users search query
        searchInput.delay(2250).typetype(urlDecoded, {
          // when it finishes typing go click the submit button
          callback: function() {
            cursor.animate({
              top: '10px',
              left: '600px'
            }, 1000);

            // make it look like the submit button is being hovered
            setTimeout(function() {
              $('#search-submit').addClass("hovered");
            }, 800);

            // make the cursor look like it's able to click the submit button
            setTimeout(function() {
              cursor.attr("src", "img/cursor-pointer.png");
            }, 800);

            // simulate a click on the submit button
            setTimeout(function() {
              $('#search-submit').trigger("click");
              $('#search-submit').addClass("active");
            }, 1100);
          }
        });
      }
      else if ($('body').width() <= 650) {
        // animate the cursor down to the search bar
        cursor.animate({
          top: '16px',
          left: '200px'
        }, 1700);

        // change the cursor to an I-beam when over the search bar
        setTimeout(function() {
          cursor.attr("src", "img/cursor-text.png");
        }, 1100);

        // type the users search query
        searchInput.delay(2000).typetype(urlDecoded, {
          // when it finishes typing go click the submit button
          callback: function() {
            cursor.animate({
              top: '10px',
              left: '260px'
            }, 800);

            // make it look like the submit button is being hovered
            setTimeout(function() {
              $('#search-submit').addClass("hovered");
            }, 320);

            // make the cursor look like it's able to click the submit button
            setTimeout(function() {
              cursor.attr("src", "img/cursor-pointer.png");
            }, 320);

            // simulate a click on the submit button
            setTimeout(function() {
              $('#search-submit').trigger("click");
            }, 1000);
          }
        });
      }
    }
  }

  // focus on the input when they click in the search form
  $('#search-form').click(function() {
    $('#search-input').focus();
  });

  // give them the shortened url when they ask for it
  $('#shorten-url-result').click(function(event) {
    event.preventDefault();
    event.stopPropagation();

    var urlToShorten = "https://is.gd/create.php?format=json&url=" + encodeURIComponent(urlResult.attr("value")),
        shortenedURL;

    if (!shortenedURL) {
      $.getJSON(urlToShorten, function(data) {
        shortenedURL = data.shorturl;
        shortenedURL = shortenedURL.replace("http:", "https:");
        urlResult.attr("value", shortenedURL);
      });
    }
    else {
      urlResult.attr("value", shortenedURL);
    }
  });

  // switching themes
  $('#dark-theme-icon').click(function() {
    $('body').addClass('dark-theme').removeClass('light-theme');
    $('#ddg-logo').attr('src', 'img/ddg-logo-dark-theme.png');
    $('#ddg-theme-url-param').attr("value", "d");

    localStorage["theme"] = "dark";
  });

  $('#light-theme-icon').click(function() {
    $('body').addClass('light-theme').removeClass('dark-theme');
    $('#ddg-logo').attr('src', 'img/ddg-logo-light-theme.png');
    $('#ddg-theme-url-param').attr("value", "-1");

    localStorage["theme"] = "light";
  });
});
