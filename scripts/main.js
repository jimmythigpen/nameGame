(function() {
  'use strict';

  //
  // Person Model
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
    },
  });

  //
  // Person View
  //
  var PersonView = Backbone.View.extend({
    className: 'person-container',
    template: _.template($('#namePic').html()),
    events: {
      "click": "selectImage"
    },
    selectImage: function(e) {
      var target = $(e.currentTarget);
      var chosenObj = localStorage.getItem('chosen');
      this.chosen = JSON.parse(chosenObj);
        if (this.$el.find('h3').data('name') == this.chosen.name && +localStorage.attempts === 0){
          $(target.children().get(1)).addClass("correct");
          this.scoreCount = +localStorage.score + 1;
          localStorage.setItem("score", +this.scoreCount);
        } else if (this.$el.find('h3').data('name') == this.chosen.name && +localStorage.attempts > 0) {
          $(target.children().get(1)).addClass("correct");
        } else {
          $(target.children().get(1)).addClass("incorrect");
          this.attempts = +localStorage.attempts + 1;
          localStorage.setItem('attempts', this.attempts);
        }
        if ($(target.children().get(1)).hasClass("correct")){
          setTimeout(function(){
            this.roundCount = +localStorage.rounds + 1;
            localStorage.setItem("rounds", this.roundCount);
            location.reload();
          }, 1000);
        }
      },

    render: function () {
      localStorage.setItem('attempts', 0);
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  //
  // Index Page View
  //
  var IndexPageView = Backbone.View.extend({
    className: 'game-container',
    events: {
      "click .reset-button": "reset",
      "click .hint-button": "hint"
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
      localStorage.setItem("chosen", JSON.stringify(person[0]));
      this.chosen = person[0].get('name');
      this.$el.html('<h1 class="chosen-name">' + "Who is <span class='chosen-name'>" + this.chosen + "</span>?" + '</h1>' + '<h2 class="score">' +
      scorePercent + '</h2>' + '<h3 class="rounds">' + rounds + '</h3>' + '<span class="button-container">' +
      '<button class="reset-button">' + 'Reset' + '</button>'+ '<button class="hint-button">' + 'Hint?' + '</button>' + '</span>');

    },

    render: function() {
      this.addAllPeople();
      if (localStorage.score === undefined) {
        localStorage.setItem("score", 0);
      }
    },

    addOnePerson: function (person) {
      var personView = new PersonView({model: person});
      this.$el.append(personView.render().el);
    },

    addAllPeople: function () {
      _.each(this.collection.models, this.addOnePerson, this);
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
      this.willowTree = new People();
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
