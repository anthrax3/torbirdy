function startup() {
  // Set the time zone to UTC.
  var env = Components.classes["@mozilla.org/process/environment;1"]
                            .getService(Components.interfaces.nsIEnvironment);
  env.set('TZ', 'UTC');

  var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                    .getService(Components.interfaces.nsIPrefBranch);

  var myPanel = document.getElementById("my-panel");
  if (prefs.getBoolPref("extensions.torbirdy.protected"))
  {
    var type = prefs.getIntPref("extensions.torbirdy.proxy");
    myPanel.style.color = "green";
    // Tor.
    if (type === 0)
    {
      myPanel.label = "TorBirdy Enabled:    Tor";
    }
    // JonDo.
    if (type === 1)
    {
      myPanel.label = "TorBirdy Enabled:    JonDo";
    }
    // Custom.
    if (type === 2)
    {
      myPanel.label = "TorBirdy Enabled:    Custom Proxy";
    }
  } else {
    myPanel.label = "TorBirdy:     Disabled!";
    myPanel.style.color = "red";
  }
}

window.addEventListener("load", startup, false);
