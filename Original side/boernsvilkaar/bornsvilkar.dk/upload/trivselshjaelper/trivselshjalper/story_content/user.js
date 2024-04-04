function ExecuteScript(strId)
{
  switch (strId)
  {
      case "661xSk8SeWi":
        Script1();
        break;
      case "66n0e3TeQXD":
        Script2();
        break;
      case "5xCKVAwRFrT":
        Script3();
        break;
      case "6Jdr9o3syBM":
        Script4();
        break;
      case "6lOREjqg3bX":
        Script5();
        break;
      case "68Urf2dONcE":
        Script6();
        break;
      case "5mCbzDnKLeK":
        Script7();
        break;
      case "6pTRZfjs4FX":
        Script8();
        break;
      case "5km1Q4iAKEq":
        Script9();
        break;
      case "6psowg5MYu2":
        Script10();
        break;
  }
}

window.InitExecuteScripts = function()
{
var player = GetPlayer();
var object = player.object;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
window.Script1 = function()
{
  var player = GetPlayer(); 
var email = 'skriv din email her' 
var spg1 = player.GetVar('dfspg1'); 
var spg2 = player.GetVar('dfspg2'); 
var spg3 = player.GetVar('dfspg3'); 
var subject = 'Jeres aftaler fra trivselshjælper'; 
var emailBody = 'Det vil vi gøre som forældre gruppe: ' + spg1 + '\n' + 'Det vil vi gøre/tale om derhjemme: ' + spg2 + '\n' + 'Sådan vil vi følge op: ' + spg3 
var mailto_link = 'mailto:' + email + '?subject=' + subject + '&body=' + encodeURIComponent(emailBody); 
win = window.open(mailto_link, 'emailWin');
}

window.Script2 = function()
{
  window.print();
}

window.Script3 = function()
{
  var player = GetPlayer(); 
var email = 'skriv din email her' 
var spg1 = player.GetVar('hsspg1'); 
var spg2 = player.GetVar('hsspg2'); 
var spg3 = player.GetVar('hsspg3'); 
var subject = 'Jeres aftaler fra Trivselshjælperen'; 
var emailBody = 'Det vil vi gøre som forældre gruppe: ' + spg1 + '\n' + 'Det vil vi gøre/tale om derhjemme: ' + spg2 + '\n' + 'Sådan vil vi følge op: ' + spg3 
var mailto_link = 'mailto:' + email + '?subject=' + subject + '&body=' + encodeURIComponent(emailBody); 
win = window.open(mailto_link, 'emailWin');
}

window.Script4 = function()
{
  window.print();
}

window.Script5 = function()
{
  var player = GetPlayer(); 
var email = 'skriv din email her' 
var spg1 = player.GetVar('huspg1'); 
var spg2 = player.GetVar('huspg2'); 
var spg3 = player.GetVar('huspg3'); 
var subject = 'Jeres aftaler fra Trivselshjælperen'; 
var emailBody = 'Det vil vi gøre som forældre gruppe: ' + spg1 + '\n' + 'Det vil vi gøre/tale om derhjemme: ' + spg2 + '\n' + 'Sådan vil vi følge op: ' + spg3 
var mailto_link = 'mailto:' + email + '?subject=' + subject + '&body=' + encodeURIComponent(emailBody); 
win = window.open(mailto_link, 'emailWin');
}

window.Script6 = function()
{
  window.print();
}

window.Script7 = function()
{
  var player = GetPlayer(); 
var email = 'skriv din email her' 
var spg1 = player.GetVar('sfspg1'); 
var spg2 = player.GetVar('sfspg2'); 
var spg3 = player.GetVar('sfspg3'); 
var subject = 'Jeres aftaler fra Trivselshjælperen'; 
var emailBody = 'Det vil vi gøre som forældre gruppe: ' + spg1 + '\n' + 'Det vil vi gøre/tale om derhjemme: ' + spg2 + '\n' + 'Sådan vil vi følge op: ' + spg3 
var mailto_link = 'mailto:' + email + '?subject=' + subject + '&body=' + encodeURIComponent(emailBody); 
win = window.open(mailto_link, 'emailWin');
}

window.Script8 = function()
{
  window.print();
}

window.Script9 = function()
{
  var player = GetPlayer(); 
var email = 'skriv din email her' 
var spg1 = player.GetVar('nespg1'); 
var spg2 = player.GetVar('nespg2'); 
var spg3 = player.GetVar('nespg3'); 
var subject = 'Jeres aftaler fra Trivselshjælperen'; 
var emailBody = 'Det vil vi gøre som forældre gruppe: ' + spg1 + '\n' + 'Det vil vi gøre/tale om derhjemme: ' + spg2 + '\n' + 'Sådan vil vi følge op: ' + spg3 
var mailto_link = 'mailto:' + email + '?subject=' + subject + '&body=' + encodeURIComponent(emailBody); 
win = window.open(mailto_link, 'emailWin');
}

window.Script10 = function()
{
  window.print();
}

};
