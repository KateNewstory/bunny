(function (global) {
    function Box(className, left, top, order) {
        var self = {
            className:className,
            left:left,
            top:top,
            order:order
        };
        this.display = function () {
            document.getElementById('box-' + self.order).classList.add(self.className);
            APP.playground[self.left][self.top] = 1;
        };
        this.getProp = function () {
            return self;
        }
    }

    ;
    function Animal(className, left, top, order, step) {
        Box.call(this, className, left, top, order);
        var self = {
            className:className,
            left:left,
            top:top,
            order:order,
            step:step
        };
        this.run = function (leftTo, topTo) {
            //clear prev position
            document.getElementById('box-' + self.order).classList.remove(self.className);
            APP.playground[self.left][self.top] = 0;
            self.left = leftTo;
            self.top = topTo;
            self.order = APP.getOrderFromCoord(self.left, self.top);
            //and display
            this.display();
        };
    }

    ;

    function Bunny(className, left, top, order, step) {
        Animal.call(this, className, left, top, order, step);
        var run = this.run;
        this.run = function () {
            alert('Bunny');
            run();
        };
        this.isDead = function () {
            var difLeft, difTop;
            difLeft = this.getProp().left - APP.woolf.getProp().left;
            difTop = this.getProp().top - APP.woolf.getProp().top;
            return (((difLeft == 1) || (difLeft == 0) || (difLeft ==-1)) && ((difTop == 1) || (difTop == 0) || (difTop == -1)));
        }
    }

    ;

    function Woolf(className, left, top, order, step) {
        Animal.call(this, className, left, top, order, step);
        var run = this.run;
        this.run = function () {
            alert('Woolf');
            run();
        }
    }

    ;

    function Plant(className, left, top, order, time) {
        Box.call(this, className, left, top, order);
        var self = {
            className:className,
            left:left,
            top:top,
            order:order,
            time:time
        };
        this.reborn = function () {
            if (self.time == 0) {
                //delete old plant
                document.getElementById('box-' + self.order).classList.remove(self.className);
                APP.playground[self.left][self.top] = 0;
                //get new coords
                var coord = APP.getCoord();

                self.left = coord.left;
                self.top = coord.top;

                self.order = APP.getOrderFromCoord(self.left, self.top);
                self.time = APP.settings[self.className + 'Time'];
                //and display
                //Could not user this.display()!!!!!!Why? Closure? How make it work?!
                document.getElementById('box-' + self.order).classList.add(self.className);
                APP.playground[self.left][self.top] = 1;

            } else {
                self.time -= 1;
            }
        };

    }

    ;

    var APP = {
        settings:{},
        woolf:{},
        bunny:{},
        tree:[],
        bush:[],
        playground:[],
        init:function () {
            var self = APP;
            var startBtn = document.getElementById('startBtn');

            var setSettings = function () {
                var inputs = document.querySelectorAll(".settings-container input");
                for (var i = 0; i < inputs.length; i++) {
                    self.settings[inputs[i].id] = inputs[i].value || 1;
                }
            };

            var createPlayGround = function () {
                //remove setting fields
                var settingsContainer = document.getElementsByClassName('settings-container');
                settingsContainer[0].parentNode.removeChild(settingsContainer[0]);

                //create playground
                var boxSize = 100 / self.settings.dimension;
                var boxContainer = document.createElement('div');
                boxContainer.className = 'box-container';

                for (var i = 0; i < self.settings.dimension; i++) {
                    self.playground[i] = [];
                    for (var j = 0; j < self.settings.dimension; j++) {
                        var order = i * self.settings.dimension + j;
                        var div = document.createElement('div');
                        div.className = 'box';
                        div.setAttribute('style', 'width : ' + boxSize + '%; height : ' + boxSize + '%');
                        div.setAttribute('data-top', i);
                        div.setAttribute('data-left', j);
                        div.setAttribute('data-order', order);
                        div.setAttribute('id', 'box-' + order);
                        boxContainer.appendChild(div);
                        self.playground[i][j] = 0;

                    }
                }
                document.body.children[0].appendChild(boxContainer);
            };

            var createObjects = function () {
                var coord = self.getCoord();
                self.bunny = new Bunny('bunny', coord.left, coord.top, self.getOrderFromCoord(coord.left, coord.top), self.settings.bunnyStep);
                self.bunny.display();

                coord = self.getCoord();
                self.woolf = new Woolf('woolf', coord.left, coord.top, self.getOrderFromCoord(coord.left, coord.top), self.settings.woolfStep);
                self.woolf.display();

                for (var i = 0; i < self.settings.treeCount; i++) {
                    coord = self.getCoord();
                    self.tree[i] = new Plant('tree', coord.left, coord.top, self.getOrderFromCoord(coord.left, coord.top), self.settings.treeTime);
                    self.tree[i].display();
                }

                for (var i = 0; i < self.settings.bushCount; i++) {
                    coord = self.getCoord();
                    self.bush[i] = new Plant('bush', coord.left, coord.top, self.getOrderFromCoord(coord.left, coord.top), self.settings.bushTime);
                    self.bush[i].display();
                }
            };

            var oneStep = function (step) {
                for (var i = 0; i < self.tree.length; i++) {
                    self.tree[i].reborn();
                }
                for (var i = 0; i < self.bush.length; i++) {
                    self.bush[i].reborn();
                }
            };

            var iterate = function () {
                if (self.bunny.isDead()) {
                    alert('Poor bunny :(');
                } else {
                    if (self.settings.maxWoolfStep == 0) {
                        alert('Bunny is alive :)');
                    } else {
                        self.settings.maxWoolfStep -= 1;
                        oneStep();
                        setTimeout(iterate, self.settings.stepTime);
                    }
                }
            };


            var startGame = function () {
                setSettings();
                createPlayGround();
                createObjects();
                iterate();
            };

            self.addListener(startBtn, "click", startGame);
        },
        addListener:function (target, eventName, handlerName) {
            if (target.addEventListener) {
                target.addEventListener(eventName, handlerName, false);
            } else if (target.attachEvent) {
                target.attachEvent("on" + eventName, handlerName);
            } else {
                target["on" + eventName] = handlerName;
            }
        },
        getRandomInt:function (min, max) {

            return Math.floor(Math.random() * (max - min + 1)) + min;

        },
        getCoord:function () {
            var self = APP;
            var randomInt, coord;
            do {
                randomInt = self.getRandomInt(0, self.settings.dimension * self.settings.dimension - 1);
                coord = self.getCoordFromOrder(randomInt);
            } while (!self.isEmptyCoord(coord));
            return coord;
        },
        getCoordFromOrder:function (number) {
            var self = APP;
            var top = ~~(number / self.settings.dimension);
            var left = number % self.settings.dimension;
            return {
                left:left,
                top:top
            }

        },
        getOrderFromCoord:function (left, top) {
            var self = APP;
            return top * self.settings.dimension + left
        },
        isEmptyCoord:function (coord) {
            var self = APP;
            return (self.playground[coord.left][coord.top] == 0);
        }

    };


    window.onload = APP.init;


})(window);