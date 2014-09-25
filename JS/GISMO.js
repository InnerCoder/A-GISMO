var GISMO = Ember.Application.create({

});

EmberENV = {FEATURES: {'query-params': true}};
///////////////////
//EMBER DATA
///////////////////

GISMO.ApplicationAdapter = DS.FirebaseAdapter.extend({
    firebase: new Firebase('https://fiery-fire-2822.firebaseio.com')
  });

// GISMO.Map = new ol.Map({
//   layers: [
//     new ol.layer.Tile({
//       source: new ol.source.MapQuest({layer: 'sat'})
//     })
//   ],
//   view: new ol.View2D({
//         center: ol.proj.transform(
//             [-122.85676399771559, 42.3389246879193], 'EPSG:4326', 'EPSG:3857'),
//         zoom: 12
//     })

// });



// GISMO.MapView = Ember.View.extend({
//   templateName: 'map',

//   didInsertElement: function() {
//       // bind the map to the div from the handlebars template
//       GISMO.Map.set('target', 'map');
//       GISMO.Map.updateSize();
//   }
// });



GISMO.ApplicationSerializer = DS.FirebaseSerializer.extend();

GISMO.User = Ember.Object.extend({

});


///////////////////
//ROUTES  MAP
///////////////////


GISMO.Router.map(function() {
  this.resource('home', {path: '/'});
  this.resource('userpanel', {path:'/params.user_id'});
  this.resource('maps', {path: '/Maps'});
  this.resource('map', {path: '/Map/:towns_id'});
  this.resource('info', {path: '/MapInfo/:towns_id'});
  this.resource('about', {path:'/About'});
  this.resource('future', {path:'/Future'});
  this.resource('createUser', {path:'/Welcome'});
});

//////////////////
//MODELS
//////////////////

GISMO.Towns = DS.Model.extend({
  name : DS.attr('string'),
  state : DS.attr('string'),
  maps: DS.attr(),
  public: DS.attr(),
  assessing: DS.attr()
});


GISMO.Assessing = DS.Model.extend({
  data : DS.attr(),
  updated : DS.attr()
});

GISMO.Myusers = DS.Model.extend({
  userID: DS.attr('number'),
  email: DS.attr('string'),
  firstname: DS.attr('string'),
  lastname: DS.attr('string'),
  usetype: DS.attr('string'),
  availabletowns: DS.attr()
});

GISMO.Availabletowns = DS.Model.extend({
  town: DS.attr('string'),
  stateName: function(){
    var fullName = this.get('town');
    var locName = fullName.split(',');
    return locName[1];
  }.property('town'),
  townName: function(){
    var fullName = this.get('town');
    var locName = fullName.split(',');
    return locName[0];
  }.property('town')
});



/////////////
//CONTROLLERS
/////////////

GISMO.UserpanelController = Ember.ArrayController.extend({
  sortProperties: ['town'],
  sortAscending: true,
  needs: "home",
  isAuth: false,
  isExpanded: false,
  model: [],
  
  actions: {
    LogOut: function () {
      this.store.unloadAll('myusers');
      this.authClient.logout();
      this.set('isAuth', false);
      this.set('isExpanded', false);

    },
    panelexpand: function(){
      this.toggleProperty('isExpanded');
      return this.get('myusers');
    },
    marchFourth: function() {
      console.log('made it inside login');
      this.authClient.login('password', {
          email: username.value,
          password: password.value
      });
    }
  },
  init: function() {
        var dbRef = new Firebase('https://fiery-fire-2822.firebaseio.com');
        this.authClient = new FirebaseSimpleLogin(dbRef, function(error, user) {
            if (error) {
                alert('Authentication failed: ' , error);
            } 
            else if (user) 
            {
                this.set('isAuth', true);
                $('#myModal').modal('hide');
                this.set('model', (this.store.findById('myusers', user.id)));
            } 
            else 
            {
                this.set('isAuth', false);
            }
        }.bind(this));
  }
  
});

GISMO.PubliclistController = Ember.ArrayController.extend({

});

GISMO.HomeController = Ember.ArrayController.extend({
  sortProperties: ['name'],
  sortAscending: true,
  needs: ['userpanel'],
  isLoggedIn: Ember.computed.alias('controllers.userpanel.isAuth')
});

GISMO.MapsController = Ember.ArrayController.extend({
  needs: ['userpanel'],
  isLoggedIn: Ember.computed.alias('controllers.userpanel.isAuth')
});

GISMO.CreateUserController = Ember.ArrayController.extend({
  selectOne : false,
  selectMany : false,
  selectAll : false

});

////////////
///ROUTES
////////////

GISMO.HomeRoute = Ember.Route.extend({
  model: function(){
    return (this.store.findAll('towns'));
  }
  
});

// GISMO.ApplicationRoute = Ember.Route.extend({
//   // renderTemplate: function() {
//   //     this.render();
      
//   //     this.render('userpanel', {    // render the `upperpanel` template
//   //           into: 'application',         // into the `application` template (rendered above)
//   //           outlet: 'upperpanel',   // using the outlet named `upperpanel`
//   //           controller: 'userpanel',
//   //           router: 'userpanel'
//   //     });

//   // } 
//   // model: function(){
//   //     return (this.store.findAll('towns'));
//   //   }
// });

GISMO.AboutRoute = Ember.Route.extend({

});



GISMO.MapRoute = Ember.Route.extend({

});

GISMO.UserpanelView = Ember.View.extend({

  
});

GISMO.InfoRoute = Ember.Route.extend({

});

GISMO.IndexRoute = Ember.Route.extend({
  beforeRender: function(){
    this.render('home');
  }
});


GISMO.CreateUserRoute = Ember.Route.extend({
    model: function(){
        return (this.store.findAll('towns'));
    },

    actions: {
          aConvert: function(){
            console.log('made it inside create User');
            this.authClient.createUser(newusername.value, newpassword.value, function(error, user) {
              if (error === null) {
                console.log("User created successfully:", user);
                towns = function(selectOne, selectMany) {
                  var townSelection = [];
                        if(this.selectOne){
                          // return (document.getElementById("selectOne").value);
                          townSelection.push({'town' : document.getElementById("selectOne").value});

                        } else {
                          if(this.selectMany) {
                            for (var i = 0; i < newUserForm.selectMany.options.length; i++) {
                              if (newUserForm.selectMany.options[i].selected) {
                                townSelection.push({'town' : newUserForm.selectMany.options[i].value});
                              }
                            };
                          } else {
                            townSelection.push("All Towns");
                          }
                        }
                      return townSelection;
                      }
                var usersRef = new Firebase('https://fiery-fire-2822.firebaseio.com/myusers');
                var myUser = usersRef.child(user.id);
                console.log('possibly about to save to firebase');
                var newUser = myUser.set({
                userID: user.id,
                email: newusername.value,
                firstname: firstname.value,
                lastname: lastname.value,
                usetype: document.getElementById("usetype").value,
                availabletowns: towns()
                });
                newUser.save();
              } else {
                console.log("Error creating user:", error);
              }
            });
            
          }
    },
    init: function() {
          var dbRef = new Firebase('https://fiery-fire-2822.firebaseio.com');
          this.authClient = new FirebaseSimpleLogin(dbRef, function(error, user) {
              if (error) {
                  alert('Authentication failed: ' , error);
              } 
              else if (user) 
              {
                  this.set('isAuth', true);
                  $('#myModal').modal('hide');
                  var properties = {
                      id: user.id,
                      email: user.email
                  };
              } 
              else 
              {
                  this.set('isAuth', false);
              }
          }.bind(this));
    }
});

GISMO.MapsRoute = Ember.Route.extend({
    model: function(){
      return (this.store.findAll('towns'));
    }
});

////////CUSTOM ELEMENTS//////////
Ember.RadioButton = Ember.View.extend({  
    tagName : "input",
    type : "radio",
    attributeBindings : ["id", "name", "type", "value", "checked:checked:" ],
    click : function() {
        this.set("selection", this.$().val());
        if (this.get("value") === "selectOne"){
          this.set("controller.selectOne", true);
          this.set("controller.selectMany", false);
        }  
        if (this.get("value") === "selectMany"){
          this.set("controller.selectOne", false);
          this.set("controller.selectMany", true);
        } if (this.get("value") === "selectAll") {
          this.set("controller.selectOne", false);
          this.set("controller.selectMany", false);
        }
    },
    checked : function() {
        return this.get("value") == this.get("selection"); 
    }.property()
});







