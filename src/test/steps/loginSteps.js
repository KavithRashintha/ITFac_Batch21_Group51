import { Given, When, Then} from "@cucumber/cucumber";       

         Given('Provide valid URL', function () {
           console.log("URL Provided")
         });
       
       
         When('Provide valid username and password', function () {
           console.log("Username and Password provided")
         });
       
       
         Then('click the login button', function () {
           console.log("Login button clicked")
         });


       
    