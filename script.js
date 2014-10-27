(function (global) {
    function Box(className, left, top) {
        var self = {
            className:className,
            left:left,
            top:top
        };
        this.display = function () {
            var order = self.top * APP.settings.dimension + self.left;
            document.getElementById('box-' + order).classList.add(self.className);
        }
    }

    ;
    function Animal(className, left, top, step) {
        Box.call(this, className, left, top);
        var self = {
            className:className,
            left:left,
            top:top,
            step:step
        };
        this.run = function () {
            alert('Run, Forest, run!');
        }
    }

    ;

    function Bunny(className, left, top, step) {
        Animal.call(this, className, left, top, step);
        var run = this.run;
        this.run = function () {
            alert('Bunny');
            run();
        }

    }

    ;

    function Woolf(className, left, top, step) {
        Animal.call(this, className, left, top, step);
        var run = this.run;
        this.run = function () {
            alert('Woolf');
            run();
        }
    }

    ;

    function Plant(className, left, top, time) {
        Box.call(this, className, left, top);
        var self = {
            className:className,
            left:left,
            top:top,
            time:time
        };
        this.die = function () {
            alert('Sorry, die(');
        };
        this.born = function () {
            alert('Alive!');
        }

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
                self.bunny = new Bunny('bunny', coord.left, coord.top, self.settings.bunnyStep);
                self.bunny.display();

                coord = self.getCoord();
                self.woolf = new Woolf('woolf', coord.left, coord.top, self.settings.woolfStep);
                self.woolf.display();

                for (var i = 0; i < self.settings.treeCount; i++) {
                    coord = self.getCoord();
                    self.tree[i] = new Plant('tree', coord.left, coord.top, self.settings.treeTime)
                    self.tree[i].display();
                }

                for (var i = 0; i < self.settings.bushCount; i++) {
                    coord = self.getCoord();
                    self.bush[i] = new Plant('bush', coord.left, coord.top, self.settings.bushTime);
                    self.bush[i].display();
                }
            };

            var startGame = function () {
                setSettings();
                createPlayGround();
                createObjects();
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
                randomInt = self.getRandomInt(0, self.settings.dimension*self.settings.dimension - 1);
                console.log(randomInt);
                coord = self.getCoordFromOrder(randomInt);
                } while (!self.isEmptyCoord(coord));
            return coord;
        },
        getCoordFromOrder:function (number) {
            var self = APP;
            var top = ~~(number / self.settings.dimension);
            var left = number % self.settings.dimension;
            return {
                left : left,
                top : top
            }

        },
        isEmptyCoord : function (coord) {
            var self = APP;
            console.log(coord);
             return (self.playground[coord.left][coord.top] == 0);
        }

    };


    window.onload = APP.init;


})(window);