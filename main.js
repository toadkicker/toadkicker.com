String.prototype.endsWith = function (suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function debounce(func, wait, immediate) {
  var timeout;
  return function (args) {
    var context = this, argz = args || arguments, later = function () {
      timeout = null;
      if (!immediate) func.apply(context, argz);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, argz);
  };
}

var Toadkicker;
Toadkicker = (function ($) {
  return {
    init: function () {

      //set the year in the footer
      $("#year").html(new Date().getFullYear());
      //EVENTS

      //for when we land on the page
      $(document).on('ready', null, function () {
        var view = "#home";
        if(window.location.search.length > 0) {
          view = "#404";
        }
        //i want my hash tag in the url!
        window.location.hash = view;
        Toadkicker.getBackgroundImages();
        return Toadkicker.controller(view);
      });

      //and when we click on a nav item
      $(document).on('click', 'nav a', function (event) {
        var tmplTarget = event.currentTarget.attributes["href"].nodeValue;
        Toadkicker.controller(tmplTarget)
      });

      $(document).on("change", "#wallpaper-picker", function (event) {
        Toadkicker.$body.data("imageUrl", event.currentTarget.value);
        Toadkicker.$body.css({"background-image": "url('" + event.currentTarget.value + "')"});
        $("#wallpaper-download").attr('href', event.currentTarget.value);
      });

      $(document).on("click", "#hide-everything", function (event) {
        Toadkicker.toggleView(event);
      });

      $(window).on('resize', function () {
        debounce(Toadkicker.getBackgroundImages(), 1000, true);
      })

    },
    randomImages: [],
    $body: $("html"),
    progressElem: $("#progress"),
    homeView: $("#home-template").html(),
    portfolioView: $("#portfolio-template").html(),
    contactView: $("#contact-template").html(),
    // playgroundView: $("#playground-template").html(),
    fourOhFourView: $("#fourOhFour-template").html(),
    wallpapers: $("#reddit-wallpapers"),
    controller: function (view) {
      var $main = $("#main");
      switch (view) {
        case "#home"||"/#home"||"/home":
          Toadkicker.setActiveNav(view);
          return $main.html(Toadkicker.homeView);
        case "#portfolio"||"/#portfolio"||"/portfolio":
          Toadkicker.setActiveNav(view);
          return $main.html(Toadkicker.portfolioView);
        case "#contact"||"/#contact"||"/contact":
          Toadkicker.setActiveNav(view);
          return $main.html(Toadkicker.contactView);
        // case "#playground"||"/#playground"||"/playground":
        //   Toadkicker.setActiveNav(view);
        //   return $main.html(Toadkicker.playgroundView);
        case "#404" || "/#404" || "/?=404":
          Toadkicker.setActiveNav(view);
          return $main.html(Toadkicker.fourOhFourView);
        default:
          Toadkicker.setActiveNav(view);
          return $main.html(Toadkicker.homeView);
      }
    },
    setActiveNav: function (target) {
      //clear the active class from it
      $('nav a').removeClass('active');
      //maybe we don't have a hashtag in the url yet?
      if (window.location.hash === "" || window.location.hash === "/#" || window.location.hash === "/#home") {
        $("nav a[href='#home']").addClass("active")
      }
      //lets make sure we got the target argument
      if (target !== undefined) {
        $("nav a[href=" + target + "]").addClass("active");
      } else {
        $("nav a[href=" + window.location.hash + "]").addClass("active");
      }
    },
    populateWallpaperPicker: function () {
      var $wallpaper = $("#wallpaper-picker");
      var imgUrl = Toadkicker.$body.data("imageUrl");
      if (Toadkicker.randomImages.length > 0) {
        Toadkicker.randomImages.forEach(function (img) {
          $wallpaper.append('<option value="' + img + '">' + img + '</option>');
        });
      } else {
        $wallpaper.append('<option value="reload">Get New Wallpapers!</option>');
      }
      $wallpaper.val(imgUrl);
      $("#wallpaper-download").attr('href', imgUrl);
    },
    getWindowSize: function () {
      var w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0],
          x = w.innerWidth || e.clientWidth || g.clientWidth,
          y = w.innerHeight || e.clientHeight || g.clientHeight;

      return {width: x, height: y};
    },
    setWallaperURL: function () {
      var windowSize = this.getWindowSize();
      if (windowSize.width <= 480) {
        return "https://www.reddit.com/r/iwallpaper.json#nonsfw?jsonp=?";
      }
      return "https://www.reddit.com/r/EarthPorn.json?jsonp=?";
    },
    getBackgroundImages: function () {
      $.ajax({
        type: 'GET',
        dataType: 'json',
        async: true,
        url: this.setWallaperURL(),
        cache: false,
        error: function (xhr, ajaxOptions, thrownError) {
          console.log(xhr.responseText);
          console.log(thrownError);
          alert("It looks like you might be using some ad-blocking extensions like Adblock or Disconnect. Please whitelist me! I'm only using Google Analytics. You're likely getting this message because I'm loading background images from Reddit.com.")
        },
        xhr: function () {
          var xhr = new window.XMLHttpRequest();
          //Download progress
          xhr.addEventListener("progress", function (evt) {
            Toadkicker.progressElem.show();
            Toadkicker.$body.addClass('loading');
            if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total;
              Toadkicker.progressElem.querySelector('.progress-bar').html(Math.round(percentComplete * 100) + "%");
            }
          }, false);
          return xhr;
        },
        complete: function () {
          Toadkicker.$body.removeClass('loading');
          Toadkicker.progressElem.hide();
        },
        success: function (result) {
          result.data.children.filter(function (row) {
            if (row.data.url.endsWith("jpg") || row.data.url.endsWith("png") || row.data.url.endsWith("jpeg")) {
              Toadkicker.randomImages.push(row.data.url);
            }
          });
          Toadkicker.setBackgroundImage();
          Toadkicker.populateWallpaperPicker();
        }
      });
    },
    setBackgroundImage: function () {
      var pickOne = Math.floor((Math.random() * Toadkicker.randomImages.length));
      if (Toadkicker.randomImages.length > 0) {
        var htmlEl = document.querySelector('html');
        htmlEl.setAttribute('style', "background-image: url('" + Toadkicker.randomImages[pickOne] + "')");
        Toadkicker.$body.data("imageUrl", Toadkicker.randomImages[pickOne]);
      }

    },
    toggleView: function (event) {
      if (event !== undefined) {
        event.preventDefault();
      }
      var elements = ["#home-link", "#portfolio-link", "#playground-link", "#contact-link", "#main", "#copywhatever", "#picker"];
      var on, off, $el;
      $el = $("#hide-everything");
      //things are hidden when on
      on = function () {
        $el.html("Show Stuff!");
        $el.css({top: "32px", right: "10px"});
        $("footer").slideUp();
      };
      //things are visible when off
      off = function () {
        $el.html("Enjoy the View!");
        $el.css({top: "45px", right: "0"});
        $("footer").slideDown();
      };
      if ($el.data("state")) {
        off();
      } else {
        on();
      }
      $(elements.join()).toggleClass("out", "in");
      $el.data('state', !$el.data('state'));
    }
  }
})(window.jQuery);


//complements of http://stackoverflow.com/questions/1664140/js-function-to-calculate-complementary-colour
function RGB2HSV(rgb) {
  hsv = {};
  max = max3(rgb.r, rgb.g, rgb.b);
  dif = max - min3(rgb.r, rgb.g, rgb.b);
  hsv.saturation = (max == 0.0) ? 0 : (100 * dif / max);
  if (hsv.saturation == 0) hsv.hue = 0;
  else if (rgb.r == max) hsv.hue = 60.0 * (rgb.g - rgb.b) / dif;
  else if (rgb.g == max) hsv.hue = 120.0 + 60.0 * (rgb.b - rgb.r) / dif;
  else if (rgb.b == max) hsv.hue = 240.0 + 60.0 * (rgb.r - rgb.g) / dif;
  if (hsv.hue < 0.0) hsv.hue += 360.0;
  hsv.value = Math.round(max * 100 / 255);
  hsv.hue = Math.round(hsv.hue);
  hsv.saturation = Math.round(hsv.saturation);
  return hsv;
}

// RGB2HSV and HSV2RGB are based on Color Match Remix [http://color.twysted.net/]
// which is based on or copied from ColorMatch 5K [http://colormatch.dk/]
function HSV2RGB(hsv) {
  var rgb = new Object();
  if (hsv.saturation == 0) {
    rgb.r = rgb.g = rgb.b = Math.round(hsv.value * 2.55);
  } else {
    hsv.hue /= 60;
    hsv.saturation /= 100;
    hsv.value /= 100;
    i = Math.floor(hsv.hue);
    f = hsv.hue - i;
    p = hsv.value * (1 - hsv.saturation);
    q = hsv.value * (1 - hsv.saturation * f);
    t = hsv.value * (1 - hsv.saturation * (1 - f));
    switch (i) {
      case 0:
        rgb.r = hsv.value;
        rgb.g = t;
        rgb.b = p;
        break;
      case 1:
        rgb.r = q;
        rgb.g = hsv.value;
        rgb.b = p;
        break;
      case 2:
        rgb.r = p;
        rgb.g = hsv.value;
        rgb.b = t;
        break;
      case 3:
        rgb.r = p;
        rgb.g = q;
        rgb.b = hsv.value;
        break;
      case 4:
        rgb.r = t;
        rgb.g = p;
        rgb.b = hsv.value;
        break;
      default:
        rgb.r = hsv.value;
        rgb.g = p;
        rgb.b = q;
    }
    rgb.r = Math.round(rgb.r * 255);
    rgb.g = Math.round(rgb.g * 255);
    rgb.b = Math.round(rgb.b * 255);
  }
  return rgb;
}

//Adding HueShift via Jacob (see comments)
function HueShift(h, s) {
  h += s;
  while (h >= 360.0) h -= 360.0;
  while (h < 0.0) h += 360.0;
  return h;
}

//min max via Hairgami_Master
function min3(a, b, c) {
  return (a < b) ? ((a < c) ? a : c) : ((b < c) ? b : c);
}
function max3(a, b, c) {
  return (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);
}

//thanks StackOverflow//
function hexToRGB(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return {r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16)};
}

function refreshColor() {
  var x = 1, d = new Date(), h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();

  if (h <= 9) {
    h = '0' + h
  }
  if (m <= 9) {
    m = '0' + m
  }
  if (s <= 9) {
    s = '0' + s
  }

  //since the background color is changing, lets use the complementary color for the text
  hex = h.toString() + m.toString() + s.toString();
  temprgb = hexToRGB(hex);
  temphsv = RGB2HSV(temprgb);
  temphsv.hue = HueShift(temphsv.hue, 180.0);
  tempcomp = HSV2RGB(temphsv);
  primary = "rgba(" + temprgb.r + "," + temprgb.g + "," + temprgb.b + ", 0.75)";
  complement = "rgba(" + tempcomp.r + "," + tempcomp.g + "," + tempcomp.b + ", 0.75)";

  $("nav ul li a.active").css({
    "text-shadow": "0 1px 0 rgba(255, 255, 255, 0.4)",
    "background-color": "rgba(255,255,255, .7)",
    "color": complement
  });
  $("nav ul li a:not('.active')").css({
    "text-shadow": "0 1px 0 " + complement,
    "background-color": complement,
    "color": "rgba(255,255,255, .7)"
  });

  $("a#hide-everything").css({"color": "rgb(255,255,255)", "background-color": primary});

  setTimeout(refreshColor, x * 1000);
}

!function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';
  if (!d.getElementById(id)) {
    js = d.createElement(s);
    js.id = id;
    js.src = p + '://platform.twitter.com/widgets.js';
    fjs.parentNode.insertBefore(js, fjs);
  }
}(document, 'script', 'twitter-wjs');

refreshColor(); // execute color changing menu

Toadkicker.init();
