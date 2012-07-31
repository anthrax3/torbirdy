const Ci = Components.interfaces;
const Cc = Components.classes;

const PREF_BRANCH = "extensions.torbirdy.";
const CUSTOM_BRANCH = "extensions.torbirdy.custom.";

var prefs = Cc["@mozilla.org/preferences-service;1"]
                .getService(Ci.nsIPrefBranch);

var torbirdyPref = Cc["@mozilla.org/preferences-service;1"]
                       .getService(Ci.nsIPrefService).getBranch(CUSTOM_BRANCH);

function setDefaultPrefs() {
  prefs.setCharPref("network.proxy.socks", "127.0.0.1");
  prefs.setIntPref("network.proxy.socks_port", 9050);
  prefs.setIntPref("network.proxy.ssl_port", 8118);
  prefs.setIntPref("network.proxy.http_port", 8118);
}

function onAccept() {
  var win = Cc['@mozilla.org/appshell/window-mediator;1']
              .getService(Ci.nsIWindowMediator)
              .getMostRecentWindow('mail:3pane');
  var myPanel = win.document.getElementById("my-panel");

  var anonService = document.getElementById('proxy-settings').selectedIndex;

  // Default (recommended) settings for TorBirdy.
  if (anonService === 0) {
    // Set proxies for Tor.
    setDefaultPrefs();
    myPanel.label = "TorBirdy Enabled:    Tor";
  }
  
  if (anonService === 1) {
    // Set custom proxies.
    var anonType = document.getElementById('anon-settings').selectedIndex;
    if (anonType === 0 || typeof anonType === "undefined") {
      // First set the preferences immediately.
      prefs.setIntPref("network.proxy.socks_port", 4001);
      prefs.setIntPref("network.proxy.ssl_port", 4001);
      prefs.setIntPref("network.proxy.http_port", 4001);
      // Now save them for later use.
      prefs.setIntPref(CUSTOM_BRANCH + "network.proxy.socks_port", 4001);
      prefs.setIntPref(CUSTOM_BRANCH + "network.proxy.ssl_port", 4001);
      prefs.setIntPref(CUSTOM_BRANCH + "network.proxy.http_port", 4001);
      myPanel.label = "TorBirdy Enabled:    JonDo";
    }
    prefs.setIntPref(PREF_BRANCH + 'proxy.type', anonType);
  }

  if (anonService === 2) {
    var socks_host = document.getElementById('socks-host').value;
    var socks_port = document.getElementById('socks-port').value;
    // Set them now.
    prefs.setCharPref("network.proxy.socks", socks_host);
    prefs.setIntPref("network.proxy.socks_port", socks_port);
    // Later use.
    prefs.setCharPref(CUSTOM_BRANCH + "network.proxy.socks", socks_host);
    prefs.setIntPref(CUSTOM_BRANCH + "network.proxy.socks_port", socks_port);
    myPanel.label = "TorBirdy Enabled:    Custom Proxy";
  }
  prefs.setIntPref(PREF_BRANCH + 'proxy', anonService);
}

function onLoad() {
  // Load the preference values.
  // Proxy.
  var anonService = prefs.getIntPref(PREF_BRANCH + 'proxy');
  document.getElementById('proxy-settings').selectedIndex = anonService;

  if (anonService === 1) {
    var anonType = prefs.getIntPref(PREF_BRANCH + 'proxy.type');
    document.getElementById('anon-settings').selectedIndex = anonType;
  }

  if (anonService === 2) {
    var socks_host = prefs.getCharPref(CUSTOM_BRANCH + 'network.proxy.socks');
    var socks_port = prefs.getIntPref(CUSTOM_BRANCH + 'network.proxy.socks_port');

    document.getElementById('socks-host').value = socks_host;
    document.getElementById('socks-port').value = socks_port;

    document.getElementById('socks-host').disabled = false;
    document.getElementById('socks-port').disabled = false;
  }
}

function checkSetting() {
  var anonService = document.getElementById('proxy-settings').selectedIndex;
  if (anonService === 2) {
    document.getElementById('socks-host').disabled = false;
    document.getElementById('socks-port').disabled = false;
  }
  else {
    document.getElementById('socks-host').disabled = true;
    document.getElementById('socks-port').disabled = true;
  }
}
