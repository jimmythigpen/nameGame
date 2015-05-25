(function() {
  'use strict';

  //
  // App Model
  //
  var Person = Backbone.Model.extend({
    defaults: {
        name: '',
        url: ''
    },
  });

  //
  // People Collection
  //
  var People = Backbone.Collection.extend({
    model: Person,

    url: function (){
      return "http://api.namegame.willowtreemobile.com/";
   },

    parse: function(response) {
      return _.sample(((_.shuffle(response))), 5);
     }
  });

  //
  //Index Page View
  //
  var IndexPageView = Backbone.View.extend({
    className: '.game-container',
    events: {
      "click div": "selectImage",
      "click .reset-button": "reset",
      "click .hint-button": "hint"
    },

    selectImage: function(e) {
        if ($(e.currentTarget).text() == this.chosen && this.attempts === 0){
          $(e.currentTarget.children[1]).addClass("correct");
          this.scoreCount = +localStorage.score + 1;
          localStorage.setItem("score", +this.scoreCount);
        } else if ($(e.currentTarget).text() == this.chosen && this.attempts > 0) {
          $(e.currentTarget.children[1]).addClass("correct");
        } else {
          $(e.currentTarget.children[1]).addClass("incorrect");
          this.attempts = this.attempts + 1;
        }
        if ($(e.currentTarget.children[1]).hasClass("correct")){
          setTimeout(function(){
            this.roundCount = +localStorage.rounds + 1;
            localStorage.setItem("rounds", this.roundCount);
            location.reload();
          }, 1000);
        }
      },

    renderChosenAndScore: function() {
      var person = this.collection.first(5);
      var rounds;
      var scorePercent = Math.round(localStorage.score/localStorage.rounds * 100);
      if (isNaN(scorePercent)) {
        scorePercent = 'Start Playing to see your score!';
      } else {
        scorePercent = ' Score ' + scorePercent + '%';
      }
      if (+localStorage.rounds === 0 || localStorage.rounds === undefined || isNaN(localStorage.rounds)) {
        rounds = '';
        localStorage.setItem("rounds", 0);
      } else {
        rounds = 'Rounds ' + (+localStorage.rounds);
      }
      person = _.shuffle(person);
      this.chosen = person[0].get('name');
      this.$el.html('<h1 class="chosen-name">' + "Who is " + this.chosen + "?" + '</h1>' + '<h2 class="score">' +
      scorePercent + '</h2>' + '<h3 class="rounds">' + rounds + '</h3>' + '<span class="button-container">' +
      '<button class="reset-button">' + 'Reset' + '</button>'+ '<button class="hint-button">' + 'Hint?' + '</button>' + '</span>');

    },

    render: function() {
      this.attempts = 0;
      if (localStorage.score === undefined) {
        localStorage.setItem("score", 0);
      }
      var self = this;
      this.collection.each(function(person){
        var name = person.get('name');
        var url = person.get('url');
        self.$el.append('<div class="person-container">' + '<img src="' + url + '"/>' + '<span class="person-info">' +
        '<h3 class="person-info-title">' + name + '</h3>' + '</span>' + '</div>');
      });
    },

    hint: function(){
      var hintNumber = _.random(1, 5);
      if (hintNumber == 1 && this.collection.models[0].get("name") != this.chosen && +$(".person-container:nth-of-type(1)").css('opacity') !== 0 && !$(".person-container:nth-of-type(1) .person-info").hasClass("incorrect")) {
        $(".person-container:nth-of-type(1)").fadeTo(500, 0);
        setTimeout(function(){
          $(".person-container:nth-of-type(1)").addClass('hinted');
        }, 500);

      } else if (hintNumber == 2 && this.collection.models[1].get("name") != this.chosen && +$(".person-container:nth-of-type(2)").css('opacity') !== 0 && !$(".person-container:nth-of-type(2) .person-info").hasClass("incorrect")) {
          $(".person-container:nth-of-type(2)").fadeTo(500, 0);
          setTimeout(function(){
            $(".person-container:nth-of-type(2)").addClass('hinted');
          }, 500);

      } else if (hintNumber == 3 && this.collection.models[2].get("name") != this.chosen && +$(".person-container:nth-of-type(3)").css('opacity') !== 0 && !$(".person-container:nth-of-type(3) .person-info").hasClass("incorrect")) {
          $(".person-container:nth-of-type(3)").fadeTo(500, 0);
          setTimeout(function(){
            $(".person-container:nth-of-type(3)").addClass('hinted');
          }, 500);

      } else if (hintNumber == 4 && this.collection.models[3].get("name") != this.chosen && +$(".person-container:nth-of-type(4)").css('opacity') !== 0 && !$(".person-container:nth-of-type(4) .person-info").hasClass("incorrect")) {
          $(".person-container:nth-of-type(4)").fadeTo(500, 0);
          setTimeout(function(){
            $(".person-container:nth-of-type(4)").addClass('hinted');
          }, 500);

      } else if (hintNumber == 5 && this.collection.models[4].get("name") != this.chosen && +$(".person-container:nth-of-type(5)").css('opacity') !== 0 && !$(".person-container:nth-of-type(5) .person-info").hasClass("incorrect")) {
          $(".person-container:nth-of-type(5)").fadeTo(500, 0);
          setTimeout(function(){
            $(".person-container:nth-of-type(5)").addClass('hinted');
          }, 500);
      } else {
        this.hint();
      }
    },

    reset: function(){
      localStorage.setItem("score", 0);
      localStorage.setItem("rounds", 0);
      location.reload();
    }
  });

  //
  // Router
  //
  var AppRouter = Backbone.Router.extend({
    routes: {
      "": "index",
    },

    initialize: function() {
      this.willowTree = new People([{model: this.Person}]);
      this.indexPage = new IndexPageView({collection: this.willowTree});
    },

    index: function() {
      var self = this;
      this.willowTree.fetch().done(function(){
      self.indexPage.renderChosenAndScore();
      self.indexPage.render();
    });
      $('#app').html(this.indexPage.el);
    },
  });

  $(document).ready(function() {
    window.router = new AppRouter();
    Backbone.history.start();
  });

})();
