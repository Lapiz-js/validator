Lapiz.Test("Validator/Construct", function(t){
  var validator = Lapiz.Validator({name:"Name|required"});

  validator || t.error("Validator contruction failed");
});

Lapiz.Test("Validator/Required", ['Validator/Construct'], function(t){
  var validator = Lapiz.Validator({name:"required"});
  var errors = validator({name:"Testing"});

  !errors || t.error("Validator returned errors when none were expected");

  errors = validator({name:""});
  errors && errors.name && errors.name.length === 1 || t.error("Validator did not return errors when one was expected");
});

Lapiz.Test("Validator/Min", ["Validator/Required"], function(t){
  var validator = Lapiz.Validator({name:"min:6"});
  var errors;

  errors = validator({name:"Tester"});
  !errors || t.error("Validator returned errors when none were expected");

  //min does not trigger an error for empty, only required does
  errors = validator({name:""});
  !errors || t.error("Validator returned errors when none were expected");

  errors = validator({name:"short"});
  errors && errors.name && errors.name.length === 1 || t.error("Validator did not return errors when one was expected");
});

Lapiz.Test("Validator/Div", ["Validator/Min"], function(t){
  var validator = Lapiz.Validator({name:"required"});
  var errors = validator({name:""}, Lapiz.Validator.format.divs);

  errors                             || t.error("Validator should return errors");
  errors instanceof DocumentFragment || t.error("Validator should return a DocumentFragment");
  var errText = errors.querySelector('div').textContent;
  errText === "name is required"     || t.error('Expected "Name is required", got:'+errText);

  errors = validator({name:"some name"}, Lapiz.Validator.format.divs);
  errors === false || t.error("Errors should be false");
});

Lapiz.Test("Validator/Li", ["Validator/Min"], function(t){
  var validator = Lapiz.Validator({name:"required"});
  var errors = validator({name:""}, Lapiz.Validator.format.li);

  errors                             || t.error("Validator should return errors");
  errors instanceof DocumentFragment || t.error("Validator should return a DocumentFragment");
  var errText = errors.querySelector('li').textContent;
  errText === "name is required"     || t.error('Expected "Name is required", got:'+errText);

  errors = validator({name:"some name"}, Lapiz.Validator.format.li);
  errors === false || t.error("Errors should be false");
});

Lapiz.Test("Validator/Ul", ["Validator/Min"], function(t){
  var validator = Lapiz.Validator({name:"required"});
  var errors = validator({name:""}, Lapiz.Validator.format.ul);

  errors.querySelector("ul") !== null || t.error("Should have ul");
  errors                              || t.error("Validator should return errors");
  errors instanceof DocumentFragment  || t.error("Validator should return a DocumentFragment");
  var errText = errors.querySelector('li').textContent;
  errText === "name is required"      || t.error('Expected "Name is required", got:'+errText);

  errors = validator({name:"some name"}, Lapiz.Validator.format.ul);
  errors === false || t.error("Errors should be false");
});

Lapiz.Test("Validator/Max", ["Validator/Div"], function(t){
  var validator = Lapiz.Validator({name:"max:5"});
  var errors;

  errors = validator({name:"short"});
  !errors || t.error("Validator returned errors when none were expected");

  errors = validator({name:"Tester"});
  errors && errors.name && errors.name.length === 1 || t.error("Validator did not return errors when one was expected");
});

Lapiz.Test("Validator/NumberMin", ["Validator/Max"], function(t){
  var validator = Lapiz.Validator({length:"numberMin:20"});
  var errors;

  errors = validator({length:''});
  !errors || t.error("Validator returned errors when none were expected; ''");

  errors = validator({length:"22"});
  !errors || t.error("Validator returned errors when none were expected; 22");

  errors = validator({length:"20"});
  !errors || t.error("Validator returned errors when none were expected; 20");

  errors = validator({length:"20.0"});
  !errors || t.error("Validator returned errors when none were expected; 20.0");

  errors = validator({length:"bad"});
  !errors || t.error("Validator returned errors when none were expected; bad");

  errors = validator({length:"10"});
  errors && errors.length && errors['length'].length === 1 || t.error("Validator did not return errors when one was expected; 10");
});

Lapiz.Test("Validator/NumberMax", ["Validator/NumberMin"], function(t){
  var validator = Lapiz.Validator({length:"numberMax:30"});
  var errors;

  errors = validator({length:''});
  !errors || t.error("Validator returned errors when none were expected; ''");

  errors = validator({length:"22"});
  !errors || t.error("Validator returned errors when none were expected; 22");

  errors = validator({length:"20"});
  !errors || t.error("Validator returned errors when none were expected; 20");

  errors = validator({length:"20.0"});
  !errors || t.error("Validator returned errors when none were expected; 20.0");

  errors = validator({length:"bad"});
  !errors || t.error("Validator returned errors when none were expected; bad");

  errors = validator({length:"40"});
  errors && errors.length && errors['length'].length === 1 || t.error("Validator did not return errors when one was expected; 40");
});

Lapiz.Test("Validator/Number", ["Validator/NumberMax"], function(t){
  var validator = Lapiz.Validator({length:"number"});
  var errors;

  errors = validator({length:''});
  !errors || t.error("Validator returned errors when none were expected; ''");

  errors = validator({length:"22"});
  !errors || t.error("Validator returned errors when none were expected; 22");

  errors = validator({length:"20"});
  !errors || t.error("Validator returned errors when none were expected; 20");

  errors = validator({length:"20.0"});
  !errors || t.error("Validator returned errors when none were expected; 20.0");

  errors = validator({length:"bad"});
  errors && errors.length && errors['length'].length === 1 || t.error("Validator did not return errors when one was expected; bad");
});

Lapiz.Test("Validator/Match", ["Validator/Number"], function(t){
  var validator = Lapiz.Validator({password:"match:password2"});
  var errors;

  errors = validator({password:"", password2: ""});
  !errors || t.error("Validator returned errors when none were expected");

  errors = validator({password:"testing", password2: "testing"});
  !errors || t.error("Validator returned errors when none were expected");

  //min does not trigger an error for empty, only required does
  errors = validator({password:"test", password2:"testing"});
  errors && errors.password && errors.password[0] === "Passwords do not match" || t.error("Validator did not return correct error");

  validator = Lapiz.Validator({password:"match:password2:arg2 test"});
  errors = validator({password:"test", password2:"testing"});
  errors && errors.password && errors.password[0] === "arg2 test" || t.error("Validator did not return correct error");
});

Lapiz.Test("Validator/Email", ["Validator/Match"], function(t){
  var validator = Lapiz.Validator({email:"email"});
  var errors;

  errors = validator({email:""});
  !errors || t.error("Validator returned errors when none were expected");

  errors = validator({email:"test"});
  errors && errors.email && errors.email[0] === "email must be a valid email" || t.error("Validator did not return correct error");

  errors = validator({email:"test@test.com"});
  !errors || t.error("Validator returned errors when none were expected");
});

Lapiz.Test("Validator/BadValidator", ["Validator/Match"], function(t){
  var errMsg = false;
  try {
    Lapiz.Validator({email:"xxDoesNotExistxx"},{});
  } catch(err){
    errMsg = err.message;
  }
  errMsg === "validator is not a function" || t.error("Did not get correct error");
});